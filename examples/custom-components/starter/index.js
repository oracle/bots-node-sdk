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
const fs = require("fs");
const path = require("path");
let port = process.env.BOTS_CC_PORT || 3000; 
let servicePathPrefix = process.env.BOTS_CC_PATH || '/components';

/**
 * Validate the component package in cc_package directory
 */
try {
  let pkgJsonPath = path.join(__dirname, 'cc_package', 'package.json');
  var pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath));
  let mainExp = require(path.join(__dirname, 'cc_package'));
  if (!mainExp.components) {
    throw new Error("Invalid project.  cc_package does not export components");
  }
  if (Array.isArray(mainExp.components)) {
    if (mainExp.components.length < 1) {
      throw new Error("Invalid project.  cc_package should export 1 or more components");
    }
  } else if (typeof mainExp.components === 'object')  {
    if (Object.keys(mainExp.components).length === 0) {
      throw new Error("Invalid project.  cc_package should export 1 or more components");
    }
  } else if (typeof mainExp.components !== 'string'){
    throw new Error("Invalid project.  cc_package should export components as an array or object");
  }
  let sdkVersionSpec = (pkgJson.devDependencies ? pkgJson.devDependencies["@oracle/bots-node-sdk"] : null);
  if (!sdkVersionSpec) {
    sdkVersionSpec = (pkgJson.peerDependencies ? pkgJson.peerDependencies["@oracle/bots-node-sdk"] : null);
  }
  if (!sdkVersionSpec) {
    console.warn("Component package does not list bots-node-sdk as dev or peer dependency.  It may not be portable to other runtime environments.")
  }
} catch (e) {
  console.error(e);
  console.error("Invalid cc_package/package.json");
  throw e;
}

/**
 * The custom component service is initialized in service.js
 */
const express = require('express');
const app = express();
const service = require('./service');
service(app, servicePathPrefix);

const server = app.listen(port, () => {
  console.log(`${pkgJson.name} service online with url prefix of '${servicePathPrefix}' and port ${port}`);
});

module.exports = server;

