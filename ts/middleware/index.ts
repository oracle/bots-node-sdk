import { IStaticMiddlwareAbstract, express } from './abstract';
import { ComponentMiddleware, IComponentMiddlewareOptions } from './component';
import { IParserMiddlewareOptions, ParserMiddleware } from './parser';
import {
  WebhookClient, WebhookEvent, IWebhookClientOptions,
  IWebhookChannelOption, IWebhookRecieverCallback } from './webhook';

export {WebhookClient, WebhookEvent, IWebhookClientOptions};

/**
 * MiddlewareOptions. Define options/configuration for Bot middleware.
 */
export interface IMiddewareOptions {
  /** body-parser middleware options */
  parser?: IParserMiddlewareOptions;
  /** custom-component middleware options */
  component?: IComponentMiddlewareOptions;
};

/**
 * init middleware function. Add bot middleware to the app router stack.
 * @param layer - the layer to apply middleware onto.
 * @param options  options to configure the middleware.
 * @return express.Router
 * @todo add webhook middleware
 */
export function init(layer: express.Router | express.Application, options: IMiddewareOptions = {}) {
  // create iterable map
  const mwMap = new Map<keyof IMiddewareOptions, IStaticMiddlwareAbstract>([
    ['component', ComponentMiddleware],
  ]);
  // apply body-parser for every type unless false
  if (options.parser !== false) {
    ParserMiddleware.extend(layer, options.parser);
  }
  // iterate and apply the middleware layers
  // middleware without options is ignored
  Object.keys(options).forEach((key: keyof IMiddewareOptions) => {
    if (mwMap.has(key)) {
      mwMap.get(key).extend(layer, options[key]);
    }
  });
  return layer;
}

/**
 * custom component middleware. Add bot custom component middleware to the app router stack.
 * @param options - Custom component router options
 *
 * ```javascript
 * import * as OracleBot from '@oracle/bots-node-sdk';
 * import * as express from 'express';
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
 * ```
 */
export function customComponent(options: IComponentMiddlewareOptions & { parser?: IParserMiddlewareOptions } = <any>{}): express.Router {
  const router = express.Router();
  return init(router, {
    component: options,
    parser: options.parser || {},
  });
}

/**
 * Webhook middleware for receiving bot messages on a webhook channel.
 * Note that it's essential to call {@link init|OracleBot.init(app)} to
 * properly set body-parser middleware options upstream of the webhook receiver.
 * @deprecated - See {@link WebhookClient|WebhookClient.receiver()}
 * @param channel - Channel configuration for bot message validation
 * @param callback - Callback upon successful webhook message
 *
 * ```javascript
 * import * as OracleBot from '@oracle/bots-node-sdk';
 * import * as express from 'express';
 * const app = express();
 * OracleBot.init(app); // must be applied upstream of the receiver for proper parsing.
 *
 * const secret: string = process.env.WEBHOOK_SECRET;
 * const webhook = { // can also be callback (req => string | Promise<string>)
 *   url: process.env.BOT_WEBHOOK_URL,
 *   secret: process.env.BOT_WEBHOOK_SECRET,
 * };
 * app.post('/webhook/message', OracleBot.Middleware.webhookReceiver(secret, (req, res, next) => {
 *   const message: any = req.body;
 *   // Forward verified message to client...
 *   res.send();
 * }));
 * ```
 */
export function webhookReceiver(channel: IWebhookChannelOption, callback: IWebhookRecieverCallback): express.RequestHandler {
  console.warn('Deprecated webhookReceiver. Please use WebhookClient.receiver() instead.');
  return new WebhookClient({
    channel
  }).receiver(callback);
}

/**
 * Client middleware for receiving arbitrary client messages inbound for Bots.
 * This middleware is designed as a convenience for situations where a chat
 * client posts outbound messages to a service where the message must be
 * formatted and forwarded as a incoming message to the bot. Response to the client
 * request should be made inside the handler - `res.send('ok')`
 * @param channel - Webhook channel configuration or callback
 * @param handler - Handler function to receive client messages and format/send to Bots via callback.
 *
 * ```javascript
 * const OracleBot = require('@oracle/bots-node-sdk');
 * const express = require('express');
 * const app = express();
 * OracleBot.init(app); // init body parser
 *
 * // define webhook channel configuration.
 * // can also be function (req => IWebhookChannelConfig | Promise<IWebhookChannelConfig>)
 * const webhook = {
 *   url: process.env.BOT_WEBHOOK_URL,
 *   secret: process.env.BOT_WEBHOOK_SECRET,
 * };
 * app.post('/webhook/:client/message', OracleBot.Middleware.webhookClient(webhook, (req, res, callback) => {
 *   let message = {} as IMessage;
 *   // assign userId, messagePayload, userProfile, etc... on message
 *   callback(null, message); // send formatted message to bot inbound webhook url
 * }));
 * ```
 */
// export function webhookClient(
//   channel: IWebhookChannelConfig | IWebhookChannelConfigCallback,
//   handler: IWebhookClientHandlerCallback): express.RequestHandler {
//   return new WebhookMiddleware(null, {
//     client: { channel, handler }
//   }).client();
// }
