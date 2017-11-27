/// <reference types="node" />
/// <reference types="express" />
import { express, MiddlewareAbstract } from './abstract';
/**
 * concentrated parser middleware options
 */
export interface ParserMiddlewareOptions {
    urlencoded?: boolean;
    json?: boolean;
    limit?: string;
}
/**
 * extended request object with raw properties
 */
export interface ParsedRequest extends express.Request {
    rawBody: Buffer;
    encoding: string;
}
/**
 * Body parser middleware
 */
export declare class ParserMiddleware extends MiddlewareAbstract {
    protected _init(router: express.Router, options: ParserMiddlewareOptions): void;
}
