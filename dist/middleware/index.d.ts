/// <reference types="express" />
import * as express from 'express';
import { IAuthMiddlewareOptions, AUTH_TYPE } from './auth';
import { IParserMiddlewareOptions } from './parser';
import { IComponentMiddlewareOptions } from './component';
export { AUTH_TYPE };
/**
 * MiddlewareOptions type. Defines options/configuration for Bot middleware.
 */
export interface IMiddewareOptions {
    root?: string;
    auth?: IAuthMiddlewareOptions;
    parser?: IParserMiddlewareOptions;
    component?: IComponentMiddlewareOptions;
}
/**
 * middleware function. Add bot middleware to the app router stack.
 * @param options: MiddlewareOptions to configure the middleware.
 * @return express.Router
 * @todo add webhook middleware
 */
export declare function middleware(options?: IMiddewareOptions): express.Router;
