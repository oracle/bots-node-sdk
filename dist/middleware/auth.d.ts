/// <reference types="express" />
import { express, MiddlewareAbstract } from './abstract';
export declare enum AUTH_TYPE {
    INHERIT = 0,
    BASIC = 1,
}
/**
 * concentrated auth middleware options
 */
export declare type AuthMiddlewareOptions = {
    type: AUTH_TYPE;
    credentials?: AuthBasicCredentials;
};
export interface AuthBasicCredentials {
    user?: string;
    pass?: string;
}
export declare class AuthMiddleware extends MiddlewareAbstract {
    protected _init(router: express.Router, options: AuthMiddlewareOptions): void;
    private _basicHandler(config);
}
