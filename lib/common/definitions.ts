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
export interface Callback {
  (err?: Error, result?: any): void;
}
