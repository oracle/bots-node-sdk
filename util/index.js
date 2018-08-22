'use strict';

const messageModelUtil = require('./messageModelUtil');
const webhookUtil = require('./webhookUtil');
const textUtil = require('./textUtil');
/**
 * SDK utilities module including a variety of submodules and methods.
 * @module Util
 * @see {@link module:Util/Text}
 * @see {@link module:Util/Webhook}
 * @see {@link module:Util/MessageModel}
 * @example
 * import { Util } from '@oracle/bots-node-sdk';
 * // or
 * import * as Util from '@oracle/bots-node-sdk/util';
 */
module.exports = {
  // message model
  messageModelUtil,
  MessageModel: messageModelUtil, // rename for require(...).Util.MessageModel
  // webhook
  webhookUtil,
  Webhook: webhookUtil, // rename for require(...).Util.Webhook
  // text
  textUtil,
  Text: textUtil, // rename for require(...).Util.Text
};
