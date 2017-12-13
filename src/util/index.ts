import { cardToText, convertRespToText } from './messageModelUtil';
import { approxTextMatch, IApproximateTextMatch } from './textUtil';
import {
  messageToBot,
  messageToBotWithProperties,
  bodyParserRawMessageVerify, // TODO: deprecate as it's already in mw
  verifyMessageFromBot,
} from './webhookUtil';

/**
 * Util module encapsulating various utility methods, classes, etc.
 *
 * ```javascript
 * import { Util } from '@oracle/bots-js-sdk';
 *
 * // OR
 *
 * const Util = require('@oracle/bots-js=sdk').Util;
 * ```
 */
export namespace Util {
  /**
   * MessageModel is a set of utility functions to help deriving string or speech representation
   * of a CMM (Conversation Message Model) message.  This is used primarily to output text or speech to
   * voice and text-based channels like Alexa and SMS.
   */
  export const MessageModel = {
    cardToText,
    convertRespToText,
  };

  /**
   * Webhook is a set of utility functions for bot integration via webhook channel.
   */
  export const Webhook = {
    messageToBot,
    messageToBotWithProperties,
    bodyParserRawMessageVerify,
    verifyMessageFromBot,
  };

  /**
   * Text is a set of text-based utiltiies for bot integration.
   */
  export const Text = {
    approxTextMatch,
  };

}
