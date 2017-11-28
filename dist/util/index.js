"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const messageModelUtil = require("./messageModelUtil");
const webhookUtil = require("./webhookUtil");
/**
 * Util module encapsulating various utility methods, classes, etc.
 *
 * ```javascript
 * import * as OracleBot from '@oracle/bot-js-sdk';
 *
 * OracleBot.Util.MessageModel.cardToText(...args);
 * ```
 */
var Util;
(function (Util) {
    Util.MessageModel = messageModelUtil;
    Util.Webhook = webhookUtil;
})(Util = exports.Util || (exports.Util = {}));
//# sourceMappingURL=index.js.map