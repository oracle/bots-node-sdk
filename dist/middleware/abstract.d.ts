/// <reference types="express" />
import * as express from 'express';
import { ILogger } from '../common/definitions';
export { express };
export interface IStaticMiddlwareAbstract {
    required: boolean;
    extend(router: express.IRouter<any>, options?: any): any;
}
/**
 * interface for extended request object in OMCe
 * @see https://docs.oracle.com/en/cloud/paas/mobile-suite/develop/calling-apis-custom-code.html
 */
export interface IMobileCloudRequest extends express.Request {
    oracleMobile?: {
        [service: string]: {
            [method: string]: Function;
        };
    };
}
/**
 * Embedded middleware abstraction layer.
 */
export declare abstract class MiddlewareAbstract {
    static required: boolean;
    protected _logger: ILogger;
    /**
     * extend static method. Instantiate the middleware class.
     * @param router: express.Router - main namespace router.
     * @param options: any - Channel specific middleware options.
     * @return instantiated class.
     */
    static extend(router: express.IRouter<any>, options?: any): MiddlewareAbstract;
    constructor(router: express.IRouter<any>, options?: any);
    /**
     * abstract _init. to be implemented by implementation classes.
     * @param router: express.Router main namespace router.
     * @param options: any channel specific middleware options.
     */
    protected abstract _init(router: express.IRouter<any>, options: any): void;
}
