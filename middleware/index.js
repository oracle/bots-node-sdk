'use strict';

const { ParserMiddleware } = require("./parser");
const { ComponentMiddleware } = require("./component");
const { WebhookClient, WebhookEvent } = require("./webhook");
const logger = console;

/**
 * @external ExpressRouter
 * @see {@link https://expressjs.com/en/4x/api.html#router}
 */

/**
 * @external ExpressRequest
 * @see {@link https://expressjs.com/en/4x/api.html#req}
 */

/**
 * @external ExpressResponse
 * @see {@link https://expressjs.com/en/4x/api.html#res}
 */

/**
 * Secret key request callback used in webhook message validation.
 * @callback ExpressRequestHandler
 * @alias ExpressRequestHandler
 * @memberof module:Middleware
 * @param {external:ExpressRequest} req - Express request object
 * @param {external:ExpressResponse} res - Express response object
 * @param {Function} [next] - Express middleware next function
 * @example
 * const app = express();
 * app.get('/', (req, res, next) => {})
 */

/**
 * Create router middleware for custom component request handling.
 * @function module:Middleware.customComponent
 * @param {external.ExpressApplication} service - Application or router to attach custom component endpoints.
 * @param {Object} options - Middleware configuration options.
 * @param {string} [options.baseUrl='/'] - Base url for custom component endpoints
 * @param {string} [options.cwd=process.cwd()] - Working directory from which any component paths are relative.
 * @param {(string[]|Object[]|Function[])} options.register - Series of paths to components or directories, Objects with name=>component pairs, Objects representing a component, or Component class ctor Functions.
 * @param {*} [options.mixins] - Any mixin properties for CustomComponentContext
 * @param {boolean|ParserOptions} [options.parser={}] - Body parser middleware options. If false, parser will be ignored.
 * @return {external.ExpressApplication} - Application with service endpoints.
 * @example
 * const OracleBot = require('@oracle/bots-node-sdk');
 * const express = require('express');
 *
 * const app = express();
 * OracleBot.Middleware.customComponent(app, {
 *   baseUrl: '/components', // base url to attach endpoints
 *   cwd: __dirname, // root of application source
 *   register: [ // provide components and paths to register
 *     './path/to/a/directory',
 *     './path/to/a/component',
 *     require('./path/to/another/component'),
 *     './path/to/other/components',
 *   ]
 * });
 */
function customComponent(service, options = {}) {
  if (options.parser !== false) {
    ParserMiddleware.extend(service, options.parser);
  }
  ComponentMiddleware.extend(service, options);
  return service;
}

/**
 * Webhook middleware for receiving bot messages on a webhook channel.
 * Note that it's essential to call {@link init|OracleBot.init(app)} to 
 * properly set body-parser middleware options upstream of the webhook receiver.
 * @function module:Middleware.webhookReceiver
 * @param {string|SecretKeyCallback} secret - Secret key for bot message validation
 * @param {WebhookReceiverCallback} callback - Callback upon successful webhook message
 * @deprecated in favor of {@link module:Middleware.WebhookClient|WebhookClient.receiver()}
 * @example
 * const OracleBot = require('@oracle/bots-node-sdk');
 * const express = require('express');
 * const app = express();
 * OracleBot.init(app); // must be applied upstream of the receiver for proper parsing.
 * 
 * const secret = process.env.BOT_WEBHOOK_SECRET; // can also be callback (req => string | Promise<string>)
 * app.post('/webhook/message', OracleBot.Middleware.webhookReceiver(secret, (req, res, next) => {
 *   const message = req.body;
 *   // Forward verified message to client...
 *   res.send(); // complete request
 * }));
 */
function webhookReceiver(secret, callback) {
  logger.warn('Deprecated webhookReceiver. Please use WebhookClient.receiver() instead.');
  return new WebhookClient({ channel: secret })
    .receiver(callback);
}

/**
 * Configurable middleware for custom bot request handling.
 * This module requires {@link https://www.npmjs.com/package/express|express}.
 * @module Middleware
 */
module.exports = {
  customComponent,
  webhookReceiver, // deprecated
  WebhookClient, WebhookEvent,
};
