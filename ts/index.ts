/**
 * Copyright © 2018, Oracle and/or its affiliates. All rights reserved.
 *
 * The Universal Permissive License (UPL), Version 1.0
 */
/**
 * This file is the top level entrypoint to this project.
 * Each of the wildcard exports below exposes the corresponding module's namespace
 * from the associative '{name}.ts' file. As a result, consumers can access each
 * namespace as a key in the root module.
 *
 * ```javascript
 * const OracleBot = require('@oracle/bots-node-sdk');
 * OracleBot.Middleware //...
 * OracleBot.Util //...
 * // etc...
 * ```
 */
export * from './init';
export * from './config';
export * from './middleware';
export * from './lib';
export * from './util';
