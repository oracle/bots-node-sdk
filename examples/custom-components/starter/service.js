const OracleBot = require('@oracle/bots-node-sdk');
const path = require('path');

/**
 * Set up custom component service
 * @param {object} app - express app or router
 * @param {string} urlPath - url path prefix for custom component service
 * @param {object} config - additional config parameters
 */
module.exports = (app, urlPath, config) => {
  const logger = (config && config.logger ? config.logger : console);

  try {
    const ccPath = path.resolve('./cc_package');
    const ccPkg = require(ccPath);

    // initialize the application with OracleBot
    OracleBot.init(app, {
      logger: logger
    });
    OracleBot.Middleware.customComponent(app, {
      baseUrl: urlPath,
      cwd: ccPkg.cwd || ccPath,
      register: ccPkg.components
    });

    logger.info('Component service created at context path=' + urlPath);

  } catch (e) {
    logger.error(e.message);
    throw e;
  }
};
