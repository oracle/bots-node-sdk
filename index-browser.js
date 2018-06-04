"use strict";
const MessageModel = require('./lib/message/messageModelBrowser').MessageModel;

/**
 * This is the top level entrypoint to this package when run in browser.  Only MessageModel (using joi-browser)
 * is returned.
 *
 * ```javascript
 * const {MessageModel} = require('@oracle/bots-node-sdk');
 * ```
 */
module.exports = {
  MessageModel
};
