/* eslint-disable no-prototype-builtins */
'use strict';
function __export(m) {
  for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}

// configure logger for testing
const { Config } = require("../index");
const logger = ['log', 'debug', 'warn', 'error', 'fatal', 'trace', 'info']
  .reduce((obj, method) => {
    obj[method] = () => {};
    return obj;
  }, {});
Config.setLogger(logger);

// export main dist entrypoint
__export(require("../index"));
// export separate entrypoint artifacts
__export(require("../lib/"));
__export(require("../middleware/"));
__export(require("../config/"));
__export(require("../util/"));