import { IApproximateTextMatch } from './textUtil';
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
export declare namespace Util {
    /**
     * MessageModel is a set of utility functions to help deriving string or speech representation
     * of a CMM (Conversation Message Model) message.  This is used primarily to output text or speech to
     * voice and text-based channels like Alexa and SMS.
     */
    const MessageModel: {
        cardToText: (card: any, cardPrefix: any) => string;
        convertRespToText: (convMsg: any) => string;
    };
    /**
     * Webhook is a set of utility functions for bot integration via webhook channel.
     */
    const Webhook: {
        messageToBot: (channelUrl: any, channelSecretKey: any, userId: any, inMsg: any, callback: any) => void;
        messageToBotWithProperties: (channelUrl: any, channelSecretKey: any, userId: any, inMsg: any, additionalProperties: any, callback: any) => void;
        bodyParserRawMessageVerify: (req: any, res: any, buf: any, encoding: any) => void;
        verifyMessageFromBot: (signature: any, msgBody: any, encoding: any, secretKey: any) => boolean;
    };
    /**
     * Text is a set of text-based utiltiies for bot integration.
     */
    const Text: {
        approxTextMatch: (item: string, list: string[], lowerCase: boolean, removeSpace: boolean, threshold: number) => IApproximateTextMatch;
    };
}
