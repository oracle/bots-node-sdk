import * as express from 'express';
import { ILogger } from '../common/definitions';
import { CommonProvider } from '../common/provider';
export { express }

export interface IStaticMiddlwareAbstract {
  extend(router: express.IRouter<any>, options?: any);
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

/**
 * Embedded middleware abstraction layer.
 */
export abstract class MiddlewareAbstract {
  protected _logger: ILogger; // establish a namespaced logger instance

  /**
   * extend static method. Instantiate the middleware class.
   * @param router: express.Router - main namespace router.
   * @param options: any - Channel specific middleware options.
   * @return instantiated class.
   */
  public static extend(router: express.IRouter<any>, options: any = {}): MiddlewareAbstract {
    const THIS: any = this; // bypass "Cannot create instance of abstract class error"
    return new THIS(router, options);
  }

  constructor(router: express.IRouter<any>, protected options?: any) {
    // setup additional iVars.
    this._logger = CommonProvider.getLogger();
    // init middleware
    try {
      this._init(router, options);
      // this._logger.info(`Initialized`);
    } catch (e) {
      this._logger.error(`Failed to init ${this.constructor.name}`, e);
    }
  }

  /**
   * abstract _init. to be implemented by implementation classes.
   * @param router: express.Router main namespace router.
   * @param options: any channel specific middleware options.
   */
  protected abstract _init(router: express.IRouter<any>, options: any): void;

}
