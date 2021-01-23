import * as express from 'express';
import { Logger } from '../common/definitions';
import { CommonProvider } from '../common/provider';
export { express }

export type ServiceInstance = express.Router | express.Express;

export interface StaticMiddlwareAbstract {
  extend(service: ServiceInstance, options?: any);
  new (service: ServiceInstance, options: any): MiddlewareAbstract
}

export interface ParsedRequest extends express.Request {
  body: any;
}

/**
 * interface for extended request object in OMCe
 * @see https://docs.oracle.com/en/cloud/paas/mobile-suite/develop/calling-apis-custom-code.html
 */
export interface MobileCloudRequest extends ParsedRequest {
  oracleMobile?: { [service: string]: { [method: string]: Function } };
}

/**
 * Embedded middleware abstraction layer.
 */
export abstract class MiddlewareAbstract {
  protected _logger: Logger; // establish a namespaced logger instance
  protected _service: ServiceInstance;

  /**
   * static getter for class constructor
   */
  private static get ctor(): StaticMiddlwareAbstract {
    return this as any;
  }

  /**
   * extend static method. Instantiate the middleware class.
   * @param service: express.Router - main namespace router.
   * @param options: any - Channel specific middleware options.
   * @return instantiated class.
   */
  public static extend(service: ServiceInstance, options: any = {}): MiddlewareAbstract {
    return new this.ctor(service, options);
  }

  constructor(service: ServiceInstance, protected options?: any) {
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
  protected abstract _init(service: ServiceInstance, options: any): void;

}
