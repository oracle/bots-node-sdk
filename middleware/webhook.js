"use strict";

const { MiddlewareAbstract } = require('./abstract');
const { webhookUtil } = require('../util');
const { CONSTANTS } = require('../common/constants');

/**
 * Secret key request callback used in webhook message validation.
 * @callback SecretKeyCallback
 * @param {external:ExpressRequest} req - Request object
 * @return {string|Promise<string>} - Secret key to validate message or promise
 * @example
 * function getSecretKey(req) {
 *   return new Promise(resolve => {
 *     let key;
 *     // ...
 *     resolve(key);
 *   });
 * }
 * const receiver = OracleBot.Middleware.webhookReceiver(getSecretKey, (req, res, next) => {
 *   // ...
 *   res.send();
 * });
 */

/**
 * Callback function upon successful webhook validation. Further validations may
 * be performed, and it is required to send the response for the webhook request.
 * as `res.send`, `res.json`, etc. Note that this response is NOT a message back to
 * the bot.
 * @callback WebhookReceiverCallback
 * @param {external:ExpressRequest} req - Request with validated req.body
 * @param {external:ExpressResponse} res - Response to bots webhook request
 * @param {function} next - Express NextFunction
 * @return {void}
 */

/**
 * Configuration details for sending messages to bots on a webhook channel.
 * @typedef {Object} WebhookChannel
 * @property {string} url - Webhook url issued by bots platform channel
 * @property {string} secret - Message signature secret key used to create X-Hub-Signature
 */

/**
 * Callback used by webhook client to obtain channel configuration information
 * for a given request.
 * @callback WebhookChannelConfigCallback
 * @param {external:ExpressRequest} req - The request object originally sent to the endpoint
 * @return {WebhookChannel|Promise<WebhookChannel>}
 * @example
 * function getConfigForClient(client) {
 *   return {
 *     url: 'https://...',  // Oracle bot webhook url specific to client
 *     secret: 'xxx',          // webhook channel secret key
 *   }
 * }
 *
 * app.post('/webhook/:client/messages', OracleBot.Middleware.webhookClient({
 *   config: (req) => getConfigForClient(req.params.client),
 *   handler: (req, res, callback) => { ... },
 * }));
 */

/**
 * Callback function with inbound webhook messages
 * @see {@link https://docs.oracle.com/en/cloud/paas/mobile-suite/develop/bot-channels.html#GUID-09EC7BCE-70D1-4FE5-B730-0EBAF78363CF}
 * @callback WebhookMessageCallback
 * @param {object|object[]} messages - Message object(s) to send to BOT.
 */

/**
 * Webhook client message handler to format a client message for Oracle Bots.
 * @callback WebhookClientHandlerCallback
 * @param {external:ExpressRequest} req - Express request with client message payload on req.body
 * @param {external:ExpressResponse} res - Express response to complete the request with appropriate statusCode, etc.
 * @param {WebhookMessageCallback} callback - Callback to invoke with Oracle Bot formatted message(s).
 * @return {void}
 * @example
 * app.post('/webhook/client', OracleBot.MiddleWare.webhookClient(config, {
 *   validator: (req, res, next) => next(),
 *   handler: (req, res, cb) => {
 *     let message = {};
 *     // assign userId, messagePayload, etc... on message
 *     cb(message); // send to bot
 *   }
 * });
 */

/**
 * Options to configure a webhook client endpoint where messages are forwarded
 * to the bot on a webhook channel.
 * @typedef WebhookClientOptions
 * @property {string | RegExp | Array.<string | RegExp>} path - Route pattern to handle client (incoming) message.
 * @property {WebhookChannel | WebhookChannelConfigCallback} channel - Webhook channel configuration or callback.
 * @property {WebhookClientHandlerCallback} handler - Handler function to receive client messages and format for Bots with message callback.
 * @property {ExpressRequestHandler} [validator] - Optional client message validator. Callback with next(error) if invalid.
 */

/**
 * Webhook middleware configuration options.
 * @typedef WebhookMiddlewareOptions
 * @property {string | RegExp | Array.<string | RegExp>} [path='/'] - Route pattern to receive bot (outgoing) message.
 * @property {string|SecretKeyCallback} secret - Secret key for bot message validation.
 * @property {WebhookReceiverCallback} callback - Webhook receiver callback for validated bot message.
 */

/**
 * WebhookMiddleware. This middleware can be initialized with or without a 
 * router layer. If router is provided, then the receiver will automatically
 * be applied at the path specified in options.
 * @extends MiddlewareAbstract
 * @property {WebhookMiddlewareOptions} options 
 * @private
 */
class WebhookMiddleware extends MiddlewareAbstract {
  /**
   * main initialization
   * @param {external:ExpressRouter} router 
   * @param {WebhookMiddlewareOptions} options 
   */
  _init(router, options) {
    if (router) {
      // add "outgoing" message receiver
      router.post(options.path || '/', this.receiver());

      // add "incoming" client handler
      if (options.client && options.client.path) {
        router.post(options.client.path, this.client());
      }
    }
  }

  /**
   * Webhook receiver middleware. Allows direct usage via {@link module:Middleware.webhookRecevier}
   * @return ExpressRequestHandler
   */
  receiver() {
    return (req, res, next) => {
      this.receiverValidationHandler()(req, res, err => {
        if (err) {
          // response to webhook with error
          // TODO: standardize for bots platform logs
          this._logger.error(err);
          res.json({ok: false, error: err.message}); // status code is already set.
        } else {
          // proceed to message handler
          this.receiverValidationHandler()(req, res, next);
        }
      });
    }
  }

  /**
   * webhook request validation. supported either as middleware layer, or 
   * receiver callback
   */
  receiverValidationHandler() {
    return (req, res, next) => {
      const { secret } = this.options;
      return Promise.resolve(typeof secret === 'function' ? secret(req) : secret)
        .then(key => {
          if (key) {
            const body = req[CONSTANTS.PARSER_RAW_BODY]; // get original raw body
            const encoding = req[CONSTANTS.PARSER_RAW_ENCODING]; // get original encoding
            const signature = req.get(CONSTANTS.WEBHOOK_HEADER); // read signature header
            if (!signature) {
              res.status(400);
              return Promise.reject(new Error(`${CONSTANTS.WEBHOOK_HEADER} signature not found`));
            }
            const valid = webhookUtil.verifyMessageFromBot(signature, body, encoding, key);
            if (!valid) {
              res.status(403);
              return Promise.reject(new Error('Signature Verification Failed'));
            }
          } else {
            res.status(400);
            return Promise.reject(new Error('Missing Webhook Channel SecretKey'));
          }
          return;
        })
        .then(next) // passing callback
        .catch(next); // cb with failure
    }
  }

  /**
   * invoke callback with validated message payload
   */
  receiverMessageHandler() {
    return (req, res, next) => {
      const { callback } = this.options;
      // return callback && callback(err, !err && req.body);
      return callback && callback(req, res, next);
    }
  }

  /**
   * Webhook client middleware
   */
  client() {
    return (req, res, next) => {
      // arbitrarily validate client message based on user-provided configuration
      this.clientValidationHandler()(req, res, err => {
        if (err) {
          this._logger.error(err);
          next(err);
        }
        else {
          // proceed to message handler
          this.clientMessageHandler()(req, res, next);
        }
      });
    };
  }

  /**
   * Client message validation. This is generally specific to the client API
   * specifications. If no validator is configured, then next is called directly.
   */
  clientValidationHandler() {
    return (req, res, next) => {
      const { client: { validator } } = this.options;
      return validator ? validator(req, res, next) : next();
    };
  }

  /**
   * get client message formatted for bot and send.
   */
  clientMessageHandler() {
    return (req, res, next) => {
      const { client: { handler, channel } } = this.options;
      // invoke message handler as promise
      return new Promise(resolver => handler(req, res, resolver))
        .then(result => [].concat(result)) // use array of messages
        .then(messages => {
          // get webhook channel config & send messages
          return Promise.resolve(typeof channel === 'function' ? channel(req) : channel)
            .then(webhook => this.sendInSeries(webhook, messages));
        })
        .then(() => !res.headersSent && res.status(200).send()) // ensure response sent
        .catch(next); // handle uncaught errors
    };
  }

  /**
   * send messages in series
   * @param channel
   * @param messages
   */
  sendInSeries(channel, messages) {
    const message = messages.shift();
    return this.sendMessage(channel, message)
      .then(() => messages.length ? this.sendInSeries(channel, messages) : null);
  }

  /**
   * send message to the webhook channel
   * @param channel - channel configuration
   * @param message - message to be sent
   */
  sendMessage(channel, message) {
    return new Promise((resolve, reject) => {
      if (message) {
        const { url, secret } = channel;
        const { userId, messagePayload } = message, extras = Object.assign({}, message);
        webhookUtil.messageToBotWithProperties(url, secret, userId, messagePayload, extras, error => error ? reject(error) : resolve());
      }
      else {
        resolve();
      }
    });
  }
}

module.exports = {
  WebhookMiddleware,
}
