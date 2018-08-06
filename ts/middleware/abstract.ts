import * as express from 'express';
import { ILogger } from '../common/definitions';
import { CommonProvider } from '../common/provider';
export { express }

export interface IStaticMiddlwareAbstract {
  extend(router: express.IRouter<any>, options?: any);
  new (layer: express.IRouter<any>, options: any): MiddlewareAbstract
}

export interface IParsedRequest extends express.Request {
  body: any;
}

/**
 * interface for extended request object in OMCe
 * @see https://docs.oracle.com/en/cloud/paas/mobile-suite/develop/calling-apis-custom-code.html
 */
export interface IMobileCloudRequest extends IParsedRequest {
  oracleMobile?: { [service: string]: { [method: string]: Function } };
}

export interface IMiddlewareHandler {
  handler: express.RequestHandler;
  url?: string;
  regexp?: RegExp;
  params?: RegExpMatchArray;
}

/**
 * Embedded middleware abstraction layer.
 */
export abstract class MiddlewareAbstract {
  protected _logger: ILogger; // establish a namespaced logger instance
  protected _layer: express.IRouter<any>;
  protected _handlers = new Map<string, IMiddlewareHandler[]>();

  /**
   * extend static method. Instantiate the middleware class.
   * @param layer: express.Router - main namespace router.
   * @param options: any - Channel specific middleware options.
   * @return instantiated class.
   */
  public static extend(layer: express.IRouter<any>, options: any = {}): MiddlewareAbstract {
    return new (<any>this)(layer, options);
  }

  constructor(layer: express.IRouter<any>, protected options?: any) {
    // setup additional iVars.
    this._logger = CommonProvider.getLogger();
    this._layer = layer;
    // init middleware
    try {
      this._init(layer, options);
      // this._logger.info(`Initialized`);
    } catch (e) {
      this._logger.error(`Failed to init ${this.constructor.name}`, e);
    }
  }

  /**
   * get list of handlers for a given method
   * @param method method to handler
   */
  public handlers(method?: string): IMiddlewareHandler[] {
    return <IMiddlewareHandler[]>[].concat(...['use', method]
      .filter(m => !!m)
      .map(m => this._handlers.get(m) || []));
  }

  /**
   * add/register a request handler
   * @param method method to which handler applies
   * @param url url pattern to match
   * @param handler middleware request handler
   */
  protected _addHandler(method: string, url: string, handler: express.RequestHandler): void {
    // keep list of handler stack
    let stack = this._handlers.get(method) || [];
    stack.push({
      url,
      handler,
      regexp: url && new RegExp('^' + url.replace(/:([\w-]+)/g, '([^/]+)').replace(/\/$/, '') + '/?$', 'i'),
      params: ((url && url.match(/:([\w-]+)/g)) || []).map(p => p.replace(/^\W/, ''))
    });
    this._handlers.set(method, stack);

    // apply directly to application layer
    if (this._layer) {
      if (url) {
        this._layer[method](url, handler);
      } else {
        this._layer[method](handler);
      }
    }

  }

  /**
   * abstract _init. to be implemented by implementation classes.
   * @param router: express.Router main namespace router.
   * @param options: any channel specific middleware options.
   */
  protected abstract _init(router: express.IRouter<any>, options: any): void;

}

/**
 * return a single request handler for the middleware stack
 * @param layers list of initialized middleware instances
 * @return request handler
 */
export function getStackHandler(...layers: MiddlewareAbstract[]): express.RequestHandler {
  return (req, res, next) => {
    const stack = <IMiddlewareHandler[]>[]
      .concat(...layers.map(layer => layer.handlers(req.method.toLowerCase())));
    // execute the layer stack
    runHandlerStack(stack, req, res, next);
  }
}

/**
 * handler stack executor
 * @private
 */
function runHandlerStack(stack: IMiddlewareHandler[], req, res, next): void {
  const layer = stack.shift();
  if (layer) {
    const { handler, url, regexp, params } = layer;
    // add named params to the req
    if (url) {
      // basic router url pattern matching
      const match = req.url.match(regexp);
      if (match) {
        // add named req params
        params.forEach((param, i) => req.params[param] = match[i + 1]);
      } else {
        // url doesn't match, proceed
        return runHandlerStack(stack, req, res, next); // doesn't match
      }
    }
    handler(req, res, () => runHandlerStack(stack, req, res, next));
  } else {
    next();
  }
}
