/**
 * This file is the top level entrypoint to this project.
 * Each of the wildcard exports below exposes the corresponding module's namespace
 * from the associative '{name}.ts' file. As a result, consumers can access each 
 * namespace as a key in the root module.
 *
 * ```javascript
 * const OracleBot = require('@oracle/bots-js-sdk');
 * OracleBot.Middleware //...
 * OracleBot.Util //...
 * // etc...
 * ```
 */
export * from './config';
export * from './middleware';
export * from './lib';
export * from './util';
