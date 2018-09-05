/**
 * @external ExpressApplication
 * @see {@link https://expressjs.com/en/4x/api.html#app}
 */

/**
 * Custom logger interface if using a custom logging utility.
 * @typedef {Object} CustomLogger
 * @memberof module:Config
 * @alias CustomLogger
 * @alias CustomLogger
 * @property {Function} trace - trace method
 * @property {Function} debug - debug method
 * @property {Function} info - info method
 * @property {Function} warn - warn method
 * @property {Function} error - error method
 * @property {Function} fatal - fatal method
 */

/**
 * Primary bot application initialization function used to prepare the application
 * for bot message handling. Unless the parser option is explicitly false, this
 * function requires {@link https://www.npmjs.com/package/express|express}
 * and {@link https://www.npmjs.com/package/body-parser|body-parser}.
 * @function init
 * @param {external:ExpressApplication} app - Express application reference.
 * @param {Object} [options] - Configuration options.
 * @param {CustomLogger} [options.logger=console] - Specify alternate logging utility
 * @param {ParserOptions} [options.parser] - Body parser middleware options.
 * @return {external:ExpressApplication} - Initialized application
 * @example
 * const express = require('express');
 * const OracleBot = require('@oracle/bots-node-sdk');
 *
 * const app = express();
 * OracleBot.init(app, {
 *   // options...
 * });
 */
const init = (app, options = {}) => {
  // provide custom logger
  if (options.logger) {
    const { setLogger } = require('../config/');
    setLogger(options.logger);
  }
  // init body-parser middleware
  if (options.parser || options.parser == null) {
    const { ParserMiddleware } = require('../middleware/parser');
    ParserMiddleware.extend(app, options.parser);
  }

  return app;
};

module.exports = init;
