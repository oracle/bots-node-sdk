import * as express from 'express';
import { ILogger } from '../common/definitions';
import { CommonProvider } from '../common/provider';
export { express }

export type IServiceInstance = express.Application | express.Router;

export interface IStaticMiddlwareAbstract {
  extend(service: IServiceInstance, options?: any);
  new (service: IServiceInstance, options: any): MiddlewareAbstract
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
  protected _service: IServiceInstance;

  /**
   * static getter for class constructor
   */
  private static get ctor(): IStaticMiddlwareAbstract {
    return this as any;
  }

  /**
   * extend static method. Instantiate the middleware class.
   * @param service: express.Router - main namespace router.
   * @param options: any - Channel specific middleware options.
   * @return instantiated class.
   */
  public static extend(service: IServiceInstance, options: any = {}): MiddlewareAbstract {
    return new this.ctor(service, options);
  }

  constructor(service: IServiceInstance, protected options?: any) {
    // setup additional iVars.
    this._logger = CommonProvider.getLogger();
    this._service = service;
    // init middleware
    try {
      this._init(service, options);
    } catch (e) {
      this._logger.error(`Failed to init ${this.constructor.name}`, e);
      throw e;
    }
  }

  /**
   * abstract _init. to be implemented by implementation classes.
   * @param service: application service router
   * @param options: any channel specific middleware options.
   */
  protected abstract _init(service: IServiceInstance, options: any): void;

}
