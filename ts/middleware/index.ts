import { express, ServiceInstance } from './abstract';
import { ComponentMiddleware, ComponentMiddlewareOptions } from './component';
import { ParserMiddlewareOptions, ParserMiddleware } from './parser';
import {
  WebhookClient, WebhookEvent, WebhookClientOptions,
  WebhookChannelOption, WebhookRecieverCallback } from './webhook';

export { WebhookClient, WebhookEvent, WebhookClientOptions };

const logger = console;

/**
 * custom component middleware. Add bot custom component middleware to the app router stack.
 * @param service Application or router to bind custom component services
 * @param options Custom component router options
 *
 * ```javascript
 * import * as OracleBot from '@oracle/bots-node-sdk';
 * import * as express from 'express';
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
 * ```
 */
export function customComponent(
  service: ServiceInstance,
  options: ComponentMiddlewareOptions & { parser?: ParserMiddlewareOptions } = <any>{}
): ServiceInstance {
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
export function webhookReceiver(secret: WebhookChannelOption, callback: WebhookRecieverCallback): express.RequestHandler {
  logger.warn('Deprecated webhookReceiver. Please use WebhookClient.receiver() instead.');
  return new WebhookClient({
    channel: secret,
  }).receiver(callback);
}

