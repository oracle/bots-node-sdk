'use strict';

const { CommonProvider, PROVIDER_KEY_LOGGER } = require("../common/provider");

/**
 * Establish logging instance.  By default, console logger is used.
 * @memberof module:Config
 * @alias setLogger
 * @param logger - logging utility
 * @example
 * import { Config } from '@oracle/bots-node-sdk';
 * const log4js = require('log4js');
 * Config.setLogger(log4js.getLogger());
 */
function setLogger(logger) {
  CommonProvider.register({
    key: PROVIDER_KEY_LOGGER,
    use: logger
  });
}

/**
 * SDK 'Config' module exposing optional configuration methods.
 * @module Config
 * @example
 * import { Config } from '@oracle/bots-node-sdk';
 * // or
 * import * as Config from '@oracle/bots-node-sdk/config';
 */
module.exports = {
  setLogger
};