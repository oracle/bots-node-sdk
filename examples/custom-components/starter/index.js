'use strict';

/**
 * custom component service that leverages a custom component package
 * 
 * The following environment variables are used if set:
 *      BOTS_CC_PORT    - port number the service listens to
 *      BOTS_CC_PATH    - url prefix of the service, for example '/custom-components'
 * 
 * This setup assumes that the custom component code is in format of a 'custom component package'.  The custom
 * component code is in the package directory.
 * 
 */
const fs = require('fs');
const path = require('path');
const logger = console;

/**
 * Validate the component package in cc_package directory
 */
let ccPkgJson;
try {
  const ccPkg = path.resolve('./cc_package');
  if (!fs.existsSync(ccPkg)) {
    throw new Error('cc_package does not exist');
  }
  const pkgJsonPath = path.join(ccPkg, 'package.json');
  if (!fs.existsSync(pkgJsonPath)) {
    throw new Error('cc_package must contain a package.json file');
  }
  ccPkgJson = JSON.parse(fs.readFileSync(pkgJsonPath));

  const mainExp = require(ccPkg);
  if (!mainExp.components) {
    throw new Error('cc_package does not export components');
  }
  if (Array.isArray(mainExp.components)) {
    if (mainExp.components.length < 1) {
      throw new Error('cc_package should export 1 or more components');
    }
  } else if (typeof mainExp.components === 'object')  {
    if (Object.keys(mainExp.components).length === 0) {
      throw new Error('cc_package should export 1 or more components');
    }
  } else if (typeof mainExp.components !== 'string'){
    throw new Error('cc_package should export components as an array or object');
  }
  let sdkVersionSpec = (ccPkgJson.devDependencies ? ccPkgJson.devDependencies['@oracle/bots-node-sdk'] : null);
  if (!sdkVersionSpec) {
    sdkVersionSpec = (ccPkgJson.peerDependencies ? ccPkgJson.peerDependencies['@oracle/bots-node-sdk'] : null);
  }
  if (!sdkVersionSpec) {
    logger.warn('Component package does not list bots-node-sdk as dev or peer dependency. It may not be portable to other runtime environments.');
  }
} catch (e) {
  logger.error('Invalid project. ' + e.message);
  throw e;
}

const defaultPort = 3000;
const port = process.env.BOTS_CC_PORT || defaultPort;
const servicePathPrefix = process.env.BOTS_CC_PATH || '/components';

/**
 * The custom component service is initialized in service.js
 */
const express = require('express');
const app = express();
const service = require('./service');
service(app, servicePathPrefix);

const server = app.listen(port, () => {
  logger.info(`${ccPkgJson.name} service online with url prefix of '${servicePathPrefix}' and port ${port}`);
});

module.exports = server;

