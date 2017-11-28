/// <reference types="express" />
import * as express from 'express';
import { AuthMiddlewareOptions, AUTH_TYPE } from './auth';
import { ParserMiddlewareOptions } from './parser';
import { ComponentMiddlewareOptions } from './component';
export { AUTH_TYPE };
/**
 * MiddlewareOptions type. Defines options/configuration for Bot middleware.
 */
export interface MiddewareOptions {
    root?: string;
    auth?: AuthMiddlewareOptions;
    parser?: ParserMiddlewareOptions;
    component?: ComponentMiddlewareOptions;
}
/**
 * middleware function. Add bot middleware to the app router stack.
 * @param options: MiddlewareOptions to configure the middleware.
 * @return express.Router
 * @todo add webhook middleware
 */
export declare function middleware(options?: MiddewareOptions): express.Router;
