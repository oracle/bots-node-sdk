"use strict";

const { CommonProvider, PROVIDER_KEY_LOGGER } = require("../common/provider");

/**
 * establish logging instance
 * @param logger - logging utility
 */
function setLogger(logger) {
  CommonProvider.register({
    key: PROVIDER_KEY_LOGGER,
    use: logger
  });
}

module.exports = {
  setLogger
};