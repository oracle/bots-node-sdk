"use strict";
const MessageModel = require('./lib/message/messageModelBrowser').MessageModel;
const messageModelUtil = require('./util/');
/**
 * This is the top level entrypoint to this package when run in browser.  Only MessageModel (using joi-browser)
 * and Util are returned.
 *
 * ```javascript
 * const {MessageModel} = require('@oracle/bots-node-sdk');
 * const {webhookUtil} = require("@oracle/bots-node-sdk").Util;
 * ```
 */
module.exports = {
  MessageModel: MessageModel,
  Util: {
    messageModelUtil: messageModelUtil
  }
};
