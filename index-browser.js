'use strict';
/**
 * Copyright © 2018, Oracle and/or its affiliates. All rights reserved.
 *
 * The Universal Permissive License (UPL), Version 1.0
 */
const MessageModel = require('./lib/message/messageModelBrowser').MessageModel;
/**
 * This is the top level entrypoint to this package when run in browser.  Only MessageModel (using <code>joi-browser</code>)
 * is returned.
 *
 * ```javascript
 * const {MessageModel} = require('@oracle/bots-node-sdk');
 * ```
 */
module.exports = {
  MessageModel: MessageModel
};
