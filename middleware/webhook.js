'use strict';

const { webhookUtil } = require('../util');
const { MessageModel } = require('../lib');
const { CONSTANTS } = require('../common/constants');
const { STATUS_CODE } = require('./codes');

/**
 * Options to configure a webhook client endpoint where messages are forwarded
 * to the bot on a webhook channel.
 * @typedef WebhookClientOptions
 * @alias WebhookClientOptions
 * @memberof module:Middleware.WebhookClient
 * @property {WebhookChannel | WebhookChannelCallback} [channel] - Webhook channel configuration or callback.
 */

/**
 * Configuration details for sending messages to bots on a webhook channel.
 * @typedef {Object} WebhookChannel
 * @alias WebhookChannel
 * @memberof module:Middleware.WebhookClient
 * @property {string} url - Webhook url issued by bots platform channel
 * @property {string} secret - Message signature secret key used to create <code>X-Hub-Signature</code>
 */

/**
 * Callback used by webhook client to obtain channel configuration information
 * for a given request.
 * @callback WebhookChannelCallback
 * @alias WebhookChannelCallback
 * @memberof module:Middleware.WebhookClient
 * @param {external:ExpressRequest} [req] - The request object originally sent to the endpoint
 * @return {WebhookChannel|Promise<WebhookChannel>}
 * @example
 * const { WebhookClient, WebhookEvent } = require('@oracle/bots-node-sdk').Middleware;
 * 
 * function getChannelForReq(req) {
 *   const client = req.params.client;
 *   return {
 *     url: 'https://...',  // Oracle bot webhook url specific to client
 *     secret: '...',       // webhook channel secret key
 *   }
 * }
 * 
 * const webhook = new WebhookClient({
 *   channel: getChannelForReq,
 * });
 * 
 * app.post('/bot/messages', webhook.receiver());
 * webhook.on(WebhookEvent.MESSAGE_RECEIVED, message => {
 *   const { userId, messagePayload } = message;
 *   // format and send to user.
 * });
 */

/**
 * WebhookEvent enum for WebhookClient event subscriptions
 * @typedef WebhookEvent
 * @alias WebhookEvent
 * @memberof module:Middleware.WebhookClient
 * @example
 * const { WebhookClient, WebhookEvent } = require('@oracle/bots-node-sdk').Middleware;
 *
 * const webhook = new WebhookClient({
 *   channel: // ...
 * });
 * //... 
 * webhook.on(WebhookEvent.ERROR, error => {
 *   // webhook error
 *   console.error(error);
 * });
 * webhook.on(WebhookEvent.MESSAGE_RECEIVED, message => {
 *   // message received from bot. 
 *   // Format and send to user...
 * });
 * webhook.on(WebhookEvent.MESSAGE_SENT, message => {
 *   // message was sent to bot.
 * });
 */
var WebhookEvent = {};
WebhookEvent[WebhookEvent["ERROR"] = 1] = "ERROR";
WebhookEvent[WebhookEvent["MESSAGE_SENT"] = 2] = "MESSAGE_SENT";
WebhookEvent[WebhookEvent["MESSAGE_RECEIVED"] = 3] = "MESSAGE_RECEIVED";

/**
 * Callback handler for WebhookClient event emitter.
 * @callback WebhookEventHandler
 * @alias WebhookEventHandler
 * @memberof module:Middleware.WebhookClient
 * @param {*} detail - Event detail payload.
 * @return {void}
 */

/**
 * Callback function upon successful webhook validation. Further validations may
 * be performed, and it is required to send the response for the webhook request.
 * as <code>res.send</code>, <code>res.json</code>, etc. Note that this response is
 * NOT a message back to the bot.
 * @callback WebhookReceiverMiddleware
 * @alias WebhookReceiverMiddleware
 * @memberof module:Middleware.WebhookClient
 * @param {external:ExpressRequest} req - Request with validated req.body
 * @param {external:ExpressResponse} res - Response to bots webhook request
 * @param {function} next - Express NextFunction
 * @return {void}
 */

/**
 * Webhook class for custom messaging implementations.
 * @memberof module:Middleware
 * @see https://docs.oracle.com/en/cloud/paas/mobile-autonomous-cloud/use-chatbot/bot-channels.html
 * @example <caption>Simple client for sending and receivinng messages.</caption>
 * const OracleBot = require('@oracle/bots-node-sdk');
 * const express = require('express');
 * const app = express();
 * OracleBot.init(app); // init main application layer
 * 
 * // define webhook channel configuration.
 * // can also be function (req => WebhookChannel | Promise<WebhookChannel>)
 * const channel = {
 *   url: process.env.BOT_WEBHOOK_URL,
 *   secret: process.env.BOT_WEBHOOK_SECRET
 * };
 * const webhook = new OracleBot.Middleware.WebhookClient({ channel });
 * 
 * // receive messages from bot and forward to user
 * app.post('/webhook/receiver', webhook.receiver((req, res) => {
 *   const { userId, messagePayload } = req.body;
 *   // Message was received and validated from bot. Forward to user accordingly...
 * }))
 * 
 * // receive messages from a client webhook and forward to bot
 * app.post('/webhook/:client/message', (req, res) => {
 *   let message = {};
 *   // assign userId, messagePayload, profile, etc... on message and send
 *   webhook.send(message)
 *    .then(() => res.send('ok'), e => res.status(400).send())
 * });
 */
class WebhookClient {
  /**
   * @constructor
   * @param {WebhookClientOptions} [options]
   */
  constructor(options) {
    this._subscriptions = new Map();
    this._options = options || {};
    // prepare event subscription map
    Object.keys(WebhookEvent)
      .filter(key => ~~key) // non-zero integer only
      .forEach((eventType) => {
        this._subscriptions.set(`${eventType}`, new Set());
      });
  }

  /**
   * get event subscriptions
   * @param {WebhookEvent} event 
   * @private
   */
  _getSubscriptions(event) {
    const subs = this._subscriptions.get(`${event}`);
    if (!subs) {
      throw new Error(`Unrecognized webhook event type, '${event}'`);
    }
    return subs;
  }

  /**
   * dispatch event to subscribers
   * @param {WebhookEvent} event 
   * @param {*} args
   * @private
   */
  _dispatch(event, args) {
    this._getSubscriptions(event)
      .forEach(handler => handler.apply(handler, [].concat(args)));
  }

  /**
   * get channel configuration
   * @param {external:ExpressRequest} [req]
   * @private
   */
  _getChannelConfig(req) {
    const { channel } = this._options;
    return Promise.resolve(typeof channel === 'function' ? channel(req) : channel)
      .then(config => {
        // ensure backwards compatibility with webhookReceiver configuration (secret only callback)
        return typeof config === 'object' ? config : {
          url: null,
          secret: config,
        };
      });
  }

  /**
   * Subscribe to WebhookClient events
   * @param {WebhookEvent} event - Event type to subscribe
   * @param {WebhookEventHandler} handler - Event handler
   * @return {WebhookClient}
   */
  on(event, handler) {
    this._getSubscriptions(event).add(handler);
    return this;
  }

  /**
   * Send client message to bot
   * @see https://docs.oracle.com/en/cloud/paas/mobile-autonomous-cloud/use-chatbot/bot-channels.html
   * @param {object} message - Complete payload to send
   * @param {WebhookChannel} [channel] - Webhook channel configuration to use (if different than that in the instance options)
   */
  send(message, channel) {
    return Promise.resolve(channel || this._getChannelConfig())
      .then(webhook => new Promise((resolve, reject) => {
        if (message) {
          try {
            const { url, secret } = webhook;
            const { userId, messagePayload } = message, extras = Object.assign({}, message);
            webhookUtil.messageToBotWithProperties(url, secret, userId, messagePayload, extras, error => error ? reject(error) : resolve(true));
          } catch (e) {
            reject(e);
          }
        } else {
          resolve();
        }
      }))
      .then(sent => sent && this._dispatch(WebhookEvent.MESSAGE_SENT, message))
      .catch(e => {
        // dispatch errors
        this._dispatch(WebhookEvent.ERROR, e);
        return Promise.reject(e);
      });
  }

  /**
   * Receiver middleware to handle messages incoming from bot. If used without
   * callback, messages will be dispatched to any subscribers to the
   * <code>WebhookEvent.MESSAGE_RECEIVED</code> event.
   * @param {WebhookReceiverCallback} [callback] - Optional callback for received messages from bot.
   * @return {WebhookReceiverMiddleware}
   */
  receiver(callback) {
    return (req, res, next) => {
      // Validate message from bot
      this._receiverValidationHandler()(req, res, err => {
        // respond to the webhook request.
        if (err) {
          this._dispatch(WebhookEvent.ERROR, err);
          // TODO: standardize response for bots platform
          res.json({ ok: false, error: err.message }); // status code is already set.
        } else {
          // fire callback or dispatch to bot response subscribers
          if (callback) {
            callback(req, res, next);
          } else {
            this._dispatch(WebhookEvent.MESSAGE_RECEIVED, req.body);
            res.json({ ok: true });
          }
        }
      });
    };
  }

  /**
   * webhook request validation. supported either as middleware layer, or
   * receiver callback
   * @private
   */
  _receiverValidationHandler() {
    return (req, res, cb) => {
      return this._getChannelConfig(req)
        .then(channel => {
          if (channel) {
            const body = req[CONSTANTS.PARSER_RAW_BODY]; // get original raw body
            const encoding = req[CONSTANTS.PARSER_RAW_ENCODING]; // get original encoding
            const signature = req.get(CONSTANTS.WEBHOOK_HEADER); // read signature header
            if (!signature) {
              res.status(STATUS_CODE.BAD_REQUEST);
              return Promise.reject(new Error(`${CONSTANTS.WEBHOOK_HEADER} signature not found`));
            }
            const valid = webhookUtil.verifyMessageFromBot(signature, body, encoding, channel.secret);
            if (!valid) {
              res.status(STATUS_CODE.FORBIDDEN);
              return Promise.reject(new Error('Signature Verification Failed'));
            }
          } else {
            res.status(STATUS_CODE.BAD_REQUEST);
            return Promise.reject(new Error('Missing Webhook Channel SecretKey'));
          }
          return;
        })
        .then(cb) // passing callback
        .catch(cb); // cb with failure
    };
  }

  /**
   * Returns the MessageModel class for creating or validating messages to or from bots.
   *
   * @return {MessageModel} The MessageModel class
   */
  MessageModel() {
    return MessageModel;
  }
}

module.exports = {
  WebhookEvent,
  WebhookClient,
}
