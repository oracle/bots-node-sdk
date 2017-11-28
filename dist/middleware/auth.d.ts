/// <reference types="express" />
import { express, MiddlewareAbstract } from './abstract';
export declare enum AUTH_TYPE {
    INHERIT = 0,
    BASIC = 1,
}
/**
 * concentrated auth middleware options
 */
export interface IAuthMiddlewareOptions {
    type: AUTH_TYPE;
    credentials?: IAuthBasicCredentials;
}
export interface IAuthBasicCredentials {
    user?: string;
    pass?: string;
}
export declare class AuthMiddleware extends MiddlewareAbstract {
    protected _init(router: express.Router, options: IAuthMiddlewareOptions): void;
    private _basicHandler(config);
}
