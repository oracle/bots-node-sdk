"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const provider_1 = require("../common/provider");
var Config;
(function (Config) {
    /**
     * declare logging instance
     * @param logger - logging utility
     */
    function setLogger(logger) {
        provider_1.CommonProvider.register({
            key: provider_1.PROVIDER_KEY_LOGGER,
            use: logger
        });
    }
    Config.setLogger = setLogger;
})(Config = exports.Config || (exports.Config = {}));
//# sourceMappingURL=index.js.map