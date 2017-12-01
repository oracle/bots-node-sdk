"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
// configure logger for testing
const log4js = require("log4js");
const index_1 = require("../index");
(log4js['setGlobalLogLevel'] || (() => { }))('OFF');
index_1.Config.setLogger(log4js.getLogger());
// export main dist entrypoint
__export(require("../index"));
//# sourceMappingURL=main.js.map