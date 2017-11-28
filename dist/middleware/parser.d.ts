/// <reference types="node" />
/// <reference types="express" />
import { express, MiddlewareAbstract } from './abstract';
/**
 * concentrated parser middleware options
 */
export interface IParserMiddlewareOptions {
    urlencoded?: boolean;
    json?: boolean;
    limit?: string;
}
/**
 * extended request object with raw properties
 */
export interface IParsedRequest extends express.Request {
    rawBody: Buffer;
    encoding: string;
}
/**
 * Body parser middleware
 */
export declare class ParserMiddleware extends MiddlewareAbstract {
    protected _init(router: express.Router, options: IParserMiddlewareOptions): void;
}
