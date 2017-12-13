"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const messageModelUtil_1 = require("./messageModelUtil");
const textUtil_1 = require("./textUtil");
const webhookUtil_1 = require("./webhookUtil");
/**
 * Util module encapsulating various utility methods, classes, etc.
 *
 * ```javascript
 * import { Util } from '@oracle/bots-js-sdk';
 * ```
 */
var Util;
(function (Util) {
    /**
     * MessageModel is a set of utility functions to help deriving string or speech representation
     * of a CMM (Conversation Message Model) message.  This is used primarily to output text or speech to
     * voice and text-based channels like Alexa and SMS.
     * ```javascript
     * Util.MessageModel
     * ```
     */
    Util.MessageModel = {
        cardToText: messageModelUtil_1.cardToText,
        convertRespToText: messageModelUtil_1.convertRespToText,
    };
    /**
     * Webhook is a set of utility functions for bot integration via webhook channel.
     * ```javascript
     * Util.Webhook
     * ```
     */
    Util.Webhook = {
        messageToBot: webhookUtil_1.messageToBot,
        messageToBotWithProperties: webhookUtil_1.messageToBotWithProperties,
        bodyParserRawMessageVerify: webhookUtil_1.bodyParserRawMessageVerify,
        verifyMessageFromBot: webhookUtil_1.verifyMessageFromBot,
    };
    /**
     * Text is a set of text-based utiltiies for bot integration.
     * ```javascript
     * Util.Text
     * ```
     */
    Util.Text = {
        approxTextMatch: textUtil_1.approxTextMatch,
    };
})(Util = exports.Util || (exports.Util = {}));
//# sourceMappingURL=index.js.map