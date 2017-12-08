/**
 * Util module encapsulating various utility methods, classes, etc.
 *
 * ```javascript
 * import * as OracleBot from '@oracle/bots-js-sdk';
 *
 * OracleBot.Util.MessageModel.cardToText(...args);
 * ```
 */
export declare module Util {
    const MessageModel: {
        convertRespToText: (convMsg: any) => string;
        cardToText: (card: any, cardPrefix: any) => string;
    };
    const Webhook: {
        messageToBot: (channelUrl: any, channelSecretKey: any, userId: any, inMsg: any, callback: any) => void;
        messageToBotWithProperties: (channelUrl: any, channelSecretKey: any, userId: any, inMsg: any, additionalProperties: any, callback: any) => void;
        verifyMessageFromBot: (signature: any, msgBody: any, encoding: any, secretKey: any) => boolean;
        bodyParserRawMessageVerify: (req: any, res: any, buf: any, encoding: any) => void;
    };
}
