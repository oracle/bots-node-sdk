"use strict";
function __export(m) {
  for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}

// configure logger for testing
const log4js = require('log4js');
const { Config } = require("../index");
(log4js['setGlobalLogLevel'] || (() => { }))('OFF');
Config.setLogger(log4js.getLogger());

// export main dist entrypoint
__export(require("../index"));
// export separate entrypoint artifacts
__export(require("../lib/"));
__export(require("../middleware/"));
__export(require("../config/"));
__export(require("../util/"));
