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
 * @param {external:ExpressRequest} req - Webhook message validation error
 * @param {external:ExpressResponse} res - Validated message from bot
 * @param {function} next - Express NextFunction
 * @return {void}
 */

/**
 * Webhook middleware configuration options.
 * @typedef WebhookMiddlewareOptions
 * @property {string | RegExp | Array.<string | RegExp>} [path='/'] - Route pattern to receive bot message.
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
   * @param {*} router 
   * @param {*} options 
   */
  _init(router, options) {
    if (router) {
      // add message receiver
      router.post(options.path || '/', this.receiver());
    }
  }

  /**
   * Webhook receiver middleware. Allows direct usage via {@link module:Middleware.webhookRecevier}
   * @return ExpressRequestHandler
   */
  receiver() {
    return (req, res, next) => {
      this.validationHandler()(req, res, err => {
        if (err) {
          // response to webhook with error
          // TODO: standardize for bots platform logs
          this._logger.error(err);
          res.json({ok: false, error: err.message}); // status code is already set.
        } else {
          // proceed to message handler
          this.messageHandler()(req, res, next);
        }
      });
    }
  }

  /**
   * webhook request validation. supported either as middleware layer, or 
   * receiver callback
   */
  validationHandler() {
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
  messageHandler() {
    return (req, res, next) => {
      const { callback } = this.options;
      // return callback && callback(err, !err && req.body);
      return callback && callback(req, res, next);
    }
  }
}

module.exports = {
  WebhookMiddleware,
}
