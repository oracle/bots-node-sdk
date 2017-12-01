"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
// main provider for common object references.
const Joi = require("joi");
const provider_1 = require("./common/provider");
// main exports
__export(require("./config"));
__export(require("./middleware"));
__export(require("./modules"));
__export(require("./util"));
// TODO - Move to a Config module.
provider_1.CommonProvider.register([
    { key: provider_1.PROVIDER_KEY_JOI, use: Joi }
]);
//# sourceMappingURL=index.js.map