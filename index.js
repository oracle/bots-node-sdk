'use strict';
/**
 * Copyright © 2018, Oracle and/or its affiliates. All rights reserved.
 *
 * The Universal Permissive License (UPL), Version 1.0
 */

const init = require('./init/');
const Middleware = require('./middleware/');
const Lib = require('./lib/');
const Util = require('./util/');
const Config = require('./config/');

/**
 * This is the top level entrypoint to this package.
 * Each of the exports below exposes the corresponding module's namespace
 * from the associative '{name}/index.js' file. As a result, consumers can access
 * each namespace as a key in the root module.
 *
 * ```javascript
 * const OracleBot = require('@oracle/bots-node-sdk');
 * OracleBot.Middleware //...
 * OracleBot.Util //...
 * // etc...
 * ```
 */
module.exports = {
  init,
  Middleware,
  Lib,
  Util,
  Config,
};
