const OracleBot = require("@oracle/bots-node-sdk");
const path = require("path");

/**
 * Set up custom component service
 * @param {object} app - express app or router
 * @param {string} urlPath - url path prefix for custom component service
 * @param {object} config - additional config parameters
 */
module.exports = (app, urlPath, config) => {
  var logger = (config && config.logger ? config.logger : console);

  try {
    let pkgDirPath = path.join(__dirname, "cc_package");
    var cc_package = require(pkgDirPath);

    // initialize the application with OracleBot
    OracleBot.init(app, {
      logger: logger
    });
    OracleBot.Middleware.customComponent(app, {
      baseUrl: urlPath,
      cwd: cc_package.cwd || pkgDirPath,
      register: cc_package.components
    });

    logger.info('Express server: component server created at context path=' + urlPath);

  } catch (e) {
    logger.error(e);
    throw e;
  }
};
