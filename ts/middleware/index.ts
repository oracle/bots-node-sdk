import { IStaticMiddlwareAbstract, express } from './abstract';
import { ComponentMiddleware, IComponentMiddlewareOptions } from './component';
import { IParserMiddlewareOptions, ParserMiddleware } from './parser';
import { IWebhookMiddlewareOptions, WebhookMiddleware } from './webhook';

/**
 * MiddlewareOptions. Define options/configuration for Bot middleware.
 */
export interface IMiddewareOptions {
  /** body-parser middleware options */
  parser?: IParserMiddlewareOptions;
  /** custom-component middleware options */
  component?: IComponentMiddlewareOptions;
  /** custom-component middleware options */
  webhook?: IWebhookMiddlewareOptions;
};

/**
 * init middleware function. Add bot middleware to the app router stack.
 * @param layer - the layer to apply middleware onto.
 * @param options  options to configure the middleware.
 * @return express.Router
 * @todo add webhook middleware
 */
export function init(layer: express.Router | express.Application, options: IMiddewareOptions = {}) {
  // create iterable map
  const mwMap = new Map<string, IStaticMiddlwareAbstract>([
    ['component', ComponentMiddleware],
    ['webhook', WebhookMiddleware],
  ]);
  // apply body-parser for every type unless false
  if (options.parser !== false) {
    ParserMiddleware.extend(layer, options.parser);
  }
  // iterate and apply the middleware layers
  // middleware without options is ignored
  Object.keys(options).forEach(key => {
    if (mwMap.has(key)) {
      mwMap.get(key).extend(layer, options[key]);
    }
  });
  return layer;
}

/**
 * custom component middleware. Add bot custom component middleware to the app router stack.
 * @param options - ComponentMiddlewareOptions with option for parser config.
 */
export function customComponent(options: IComponentMiddlewareOptions & { parser?: IParserMiddlewareOptions } = <any>{}) {
  const router = express.Router();
  return init(router, {
    component: options,
    parser: options.parser || {},
  });
}
