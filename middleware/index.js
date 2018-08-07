"use strict";

const { getStackHandler } = require("./abstract");
const { ParserMiddleware } = require("./parser");
const { ComponentMiddleware } = require("./component");
const { WebhookClient, WebhookEvent } = require("./webhook");

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
 * Init middleware function. Configure bot middleware to the app router stack.
 * This is similar to the {@link init} function and can be called with either an
 * express app, or router to initialize message handling middleware.
 * @function module:Middleware.init
 * @param {(external:ExpressRouter|external.ExpressApplication)} layer - Application layer to initialize
 * @param {Object} [options={}] - Middleware configuration options.
 * @param {ParserOptions} [options.parser] - Body parser middleware options.
 * @param {ComponentMiddlewareOptions} [options.component] - Custom component middleware options.
 * @param {WebhookMiddlewareOptions} [options.webhook] - Webhook middleware options as router.
 * @return {(external:ExpressRouter|external.ExpressApplication)} - Application layer with middleware applied
 * @private
 * @example
 * const OracleBot = require('@oracle/bots-node-sdk');
 * const express = require('express');
 * const app = express();
 * 
 * OracleBot.Middleware.init(app); // adds necessary body-parser to app middleware.
 * app.use('/components', OracleBot.Middleware.customComponent({
 *   register: ['./components'],
 * }));
 */
function init(layer, options = {}) {
  // create iterable map
  const mwMap = new Map([
    ['component', ComponentMiddleware],
  ]);
  let mwStack = [];

  // apply body-parser for every type unless false
  if (options.parser !== false) {
    mwStack.push(ParserMiddleware.extend(layer, options.parser));
  }
  // iterate and apply the middleware layers
  // middleware without options is ignored
  Object.keys(options).forEach(key => {
    if (mwMap.has(key)) {
      mwStack.push(mwMap.get(key).extend(layer, options[key]));
    }
  });
  return getStackHandler.apply(null, mwStack);
  // return layer;
}

/**
 * Create router middleware for custom component request handling.
 * @function module:Middleware.customComponent
 * @param {Object} options - Middleware configuration options.
 * @param {string} [options.cwd=process.cwd()] - Working directory from which any component paths are relative.
 * @param {(string[]|Object[]|Function[])} options.register - Series of paths to components or directories, Objects with name=>component pairs, Objects representing a component, or Component class ctor Functions.
 * @param {*} [options.mixins] - Any mixin properties for ComponentInvocation
 * @param {boolean|ParserOptions} [options.parser={}] - Body parser middleware options. If false, parser will be ignored.
 * @return {ExpressRequestHandler} - Request handler for custom component services.
 * @example
 * const OracleBot = require('@oracle/bots-node-sdk');
 * const express = require('express');
 *
 * const app = express();
 * app.use('/components', OracleBot.Middleware.customComponent({
 *   cwd: __dirname, // root of application source
 *   register: [ // provide components and paths to register
 *     './path/to/a/directory',
 *     './path/to/a/component',
 *     require('./path/to/another/component'),
 *     './path/to/other/components',
 *   ]
 * }));
 */
function customComponent(options = {}) {
  return init(null, {
    component: options,
    parser: options.parser,
  });
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
  console.warn('Deprecated webhookReceiver. Please use WebhookClient.receiver() instead.');
  return new WebhookClient({ channel: secret })
    .receiver(callback);
}

/**
 * Configurable middleware for custom bot request handling.
 * This module requires {@link https://www.npmjs.com/package/express|express}.
 * @module Middleware
 */
module.exports = {
  init, // for tests
  // direct middleware methods
  customComponent,
  webhookReceiver, // deprecated
  WebhookClient, WebhookEvent,
};
