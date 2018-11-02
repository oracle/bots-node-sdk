const path = require('path');
const OracleBot = require('@oracle/bots-node-sdk');

/**
 * Set up custom component service
 * @param {object} app - express app or router
 * @param {string} urlPath - url path prefix for custom component service
 * @param {object} config - additional config parameters
 */
module.exports = (app, urlPath, config) => {
  const logger = (config && config.logger ? config.logger : console);
  
  // load custom component package in ./custom directory
  const ccPath = path.resolve('./custom');
  const ccPkg = require(ccPath);

  // initialize the runtime with OracleBot
  OracleBot.init(app, {
    logger: logger
  });
  OracleBot.Middleware.customComponent(app, {
    baseUrl: urlPath,
    cwd: ccPkg.cwd || ccPath,
    register: ccPkg.components
  });

  logger.info('Component service created at context path=' + urlPath);
};
