declare const _default: {
    messageToBot: (channelUrl: any, channelSecretKey: any, userId: any, inMsg: any, callback: any) => void;
    messageToBotWithProperties: (channelUrl: any, channelSecretKey: any, userId: any, inMsg: any, additionalProperties: any, callback: any) => void;
    verifyMessageFromBot: (signature: any, msgBody: any, encoding: any, secretKey: any) => boolean;
    bodyParserRawMessageVerify: (req: any, res: any, buf: any, encoding: any) => void;
};
export = _default;
