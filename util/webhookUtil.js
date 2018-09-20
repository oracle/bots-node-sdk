'use strict';

const crypto = require("crypto");
const { CONSTANTS } = require("../common/constants");
const { httpClient } = require("../common/http");

const logger = console;

/**
 * utility function to perform webhook signature verification
 * @function module:Util/Webhook.verifyMessageFormat
 * @return {boolean} true if the webhook message received from Bots is verified successfully.
 * @param {string} signature - signature included in the bot message, to be compared to calculated signature.
 * @param {Buffer} msgBody - raw message body of the bot message.
 * @param {string} encoding - encoding of the raw message body.
 * @param {string} secretKey - secretKey used to calculate message signature
 * @example
 * if (webhookUtil.verifyMessageFromBot(req.get('X-Hub-Signature'), req.rawBody, req.encoding, channelSecretKey)) {
 *   res.sendStatus(200);
 * } else {
 *   res.sendStatus(403);
 * }
 */
function verifyMessageFromBot(signature, msgBody, encoding, secretKey) {
  if (!signature || !msgBody || !secretKey) {
    return false;
  }
  const calculatedSig = buildSignatureHeader(msgBody, secretKey, encoding);
  if (signature !== calculatedSig) {
    return false;
  }
  return true;
}

/**
 * utility function for use with expressjs route in handling the raw message body of the webhook message received from bot.
 * Instead of just letting bodyParser.json to parse the raw message to JSON, the rawMessage and its encoding is saved as properties
 * 'rawBody' and 'encoding' for use in signature verification in method verifyMessageFormat.
 * @function module:Util/Webhook.bodyParserRawMessageVerify
 * @param {object} req - expressjs req for the POST route.
 * @param {object} res - expressjs res for the POST route.
 * @param {Buffer} buf - the raw message body.
 * @param {string} encoding - encoding of the raw message body.
 * @example
 *  app.post('/webhook/messages', 
 *    bodyParser.json({
 *      verify: webhookUtil.bodyParserRawMessageVerify
 *    }), 
 *    function (req, res) {
 *      // request body is now available in req.rawBody, req.encoding is also set
 *    }
 *  );
 */
function bodyParserRawMessageVerify(req, res, buf, encoding) {
  if (req) {
    req[CONSTANTS.PARSER_RAW_BODY] = buf;
    req[CONSTANTS.PARSER_RAW_ENCODING] = encoding;
  }
}

/**
 * create the payload signature header.
 * @function module:Util/Webhook.buildSignatureHeader
 * @param {Buffer} buf - Raw payload as a Buffer, such as `Buffer.from(JSON.stringify(payload), 'utf8')`
 * @param {string} secret - secret key of the channel for computing signature
 * @param {string} [encoding] - secret key of the channel for computing signature
 */
function buildSignatureHeader(buf, secret, encoding) {
  return 'sha256=' + buildSignature(buf, secret, encoding);
}

function buildSignature(buf, secret, encoding) {
  const hmac = crypto.createHmac('sha256', Buffer.from(secret || '', encoding || 'utf8'));
  if (buf) {
    hmac.update(buf);
  }
  return hmac.digest('hex');
}

/**
 * utility function to send message to bot webhook channel, generating the right message with signature
 * @function module:Util/Webhook.messageToBot
 * @param {string} channelUrl - send the message to this channel url
 * @param {string} channelSecretKey - secret key of the channel for computing message signature.
 * @param {string} userId - userId is the sender of the message.
 * @param {object|string} inMsg - message to be sent to bot
 * @param {function} callback - callback function to be invoked after message is sent
 * @deprecated use {@link module:Util/Webhook.messageToBotWithProperties} instead
 */
function messageToBot(channelUrl, channelSecretKey, userId, inMsg, callback) {
  logger.warn("messageToBot() is deprecated in favor of messageToBotWithProperties()"); 
  messageToBotWithProperties(channelUrl, channelSecretKey, userId, inMsg, null, callback);
}

/**
 * utility function to send message to bot webhook channel, generating the right message with signature.  This function also allows additional
 * properties to be sent along to the bot.  A common use case is to add a profile property.
 * @function module:Util/Webhook.messageToBotWithProperties
 * @param {string} channelUrl - send the message to this channel url
 * @param {string} channelSecretKey - secret key of the channel for computing message signature.
 * @param {string} userId - userId is the sender of the message.
 * @param {object|string} inMsg - message to be sent to bot
 * @param {object} [additionalProperties] - additional properties like profile can be added
 * @param {function} callback - callback function to be invoked after message is sent
 * @example
 * webhookUtil.messageToBotWithProperties(
 *   channelUrl, 
 *   channelSecretKey, 
 *   userId, 
 *   messagePayload, 
 *   {
 *     "profile": {
 *       "firstName": 'John',
 *       "lastName": 'Smith'
 *       "age": 22,
 *       "clientType": 'Alexa'
 *     }
 *   },
 *   function (err) {
 *     if (err) {
 *       logger.warn("Failed sending message to Bot");
 *     }
 *   }
 * );
 */
function messageToBotWithProperties(channelUrl, channelSecretKey, userId, inMsg, additionalProperties, callback) {
  if (!channelUrl) {
    callback(new Error('Channel URL is required'));
    return;
  }
  if (!channelSecretKey) {
    callback(new Error('Channel Secret Key is required'));
    return;
  }
  if (!userId) {
    callback(new Error('userId is required'));
    return;
  }
  var outMsg = {
    userId: userId,
  };
  outMsg.messagePayload = inMsg;
  if (additionalProperties) {
    outMsg = Object.assign(outMsg, additionalProperties);
  }

  const body = Buffer.from(JSON.stringify(outMsg), 'utf8');
  const headers = {};
  headers['Content-Type'] = 'application/json; charset=utf-8';
  headers[CONSTANTS.WEBHOOK_HEADER] = buildSignatureHeader(body, channelSecretKey);

  // use http client to post webhook message
  const request = httpClient();
  request(channelUrl, {
    method: 'POST',
    body,
    headers,
    timeout: 60000,
    redirect: 'follow',
  }).then(() => callback())
    .catch(err => callback(new Error(err.message)));
}

/**
 * The webhookUtil is a set of utility functions for bot integration via webhook channel.
 * While most use cases are accommodated through the {@link module.Middleware.WebhookClient|WebhookClient}
 * instance methods and options, direct use of these methods is also possible.
 * @module Util/Webhook
 */
module.exports = {
  messageToBot,
  messageToBotWithProperties,
  verifyMessageFromBot,
  bodyParserRawMessageVerify,
  buildSignatureHeader,
};
