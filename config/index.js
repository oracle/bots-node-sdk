"use strict";

const { CommonProvider, PROVIDER_KEY_LOGGER } = require("../common/provider");

/**
 * establish logging instance
 * @function module:Config.setLogger
 * @param logger - logging utility
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