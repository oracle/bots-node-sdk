/**
 * typeof function alias.
 */
export const Type = Function;

/**
 * Check if a reference variable is Type.
 * @param ref {any} - object reference to test
 * @returns boolean
 */
export function isType(ref: any): ref is Type<any> {
  return typeof ref === 'function';
}

/**
 * static Type interface
 */
export interface Type<T> extends Function { new (...args: any[]): T; }

/**
 * Conversation primative type string option
 */
export type Primitive = 'int' | 'float' | 'double' | 'boolean' | 'string' | 'map' | 'list';

/**
 * Standard async callback signature
 */
export interface InvocationCallback {
  (err?: Error, result?: any): void;
}

/**
 * Standard logging interface
 */
export interface Logger {
  debug(...args: any[]): void;
  error(...args: any[]): void;
  info(...args: any[]): void;
  trace(...args: any[]): void;
  warn(...args: any[]): void;
  fatal?(...args: any[]): void;
}
