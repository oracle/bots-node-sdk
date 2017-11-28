"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
// main provider for common object references.
const log4js = require("log4js");
const Joi = require("joi");
const provider_1 = require("./common/provider");
exports.Foo = provider_1.CommonProvider;
provider_1.CommonProvider.register([
    { key: provider_1.PROVIDER_KEY_JOI, use: Joi },
    { key: provider_1.PROVIDER_KEY_LOGGER, use: log4js.getLogger() },
]);
// main exports
__export(require("./middleware"));
__export(require("./modules"));
__export(require("./util"));
//# sourceMappingURL=index.js.map