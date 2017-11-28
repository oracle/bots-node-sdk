import messageModelUtil = require('./messageModelUtil');
import webhookUtil = require('./webhookUtil');

/**
 * Util module encapsulating various utility methods, classes, etc.
 *
 * ```javascript
 * import * as OracleBot from '@oracle/bot-js-sdk';
 *
 * OracleBot.Util.MessageModel.cardToText(...args);
 * ```
 */
export module Util {
  export const MessageModel = messageModelUtil;
  export const Webhook = webhookUtil;
}
