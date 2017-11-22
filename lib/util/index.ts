import messageModelUtil = require('./messageModelUtil');
import webhookUtil = require('./webhookUtil');

/**
 * wrapper for the various utilility objects
 */
export namespace Util {
  export const MessageModel = messageModelUtil;
  export const Webhook = webhookUtil;
}
