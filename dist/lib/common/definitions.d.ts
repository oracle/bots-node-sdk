/**
 * typeof function alias.
 */
export declare const Type: FunctionConstructor;
/**
 * Check if a reference variable is Type.
 * @param ref {any} - object reference to test
 * @returns boolean
 */
export declare function isType(ref: any): ref is Type<any>;
/**
 * static Type interface
 */
export interface Type<T> extends Function {
    new (...args: any[]): T;
}
/**
 * Conversation primative type string option
 */
export declare type Primitive = 'int' | 'float' | 'double' | 'boolean' | 'string' | 'map' | 'list';
/**
 * Standard async callback signature
 */
export interface Callback {
    (err?: Error, result?: any): void;
}
/**
 * Standard logging interface
 */
export interface Logger {
    debug(...args: any[]): void;
    error(...args: any[]): void;
    info(...args: any[]): void;
    log(...args: any[]): void;
    trace(...args: any[]): void;
    warn(...args: any[]): void;
}
