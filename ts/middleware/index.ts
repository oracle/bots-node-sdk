import { IStaticMiddlwareAbstract, express } from './abstract';
import { ComponentMiddleware, IComponentMiddlewareOptions } from './component';
import { IParserMiddlewareOptions, ParserMiddleware } from './parser';
import { IWebhookMiddlewareOptions, IWebhookRecieverCallback, IWebhookSecretCallback, WebhookMiddleware } from './webhook';

/**
 * MiddlewareOptions. Define options/configuration for Bot middleware.
 */
export interface IMiddewareOptions {
  /** body-parser middleware options */
  parser?: IParserMiddlewareOptions;
  /** custom-component middleware options */
  component?: IComponentMiddlewareOptions;
  /** custom-component middleware options */
  webhook?: IWebhookMiddlewareOptions;
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
    ['webhook', WebhookMiddleware],
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
 * @param  secret - Secret key for bot message validation
 * @param callback - Callback upon successful webhook message
 * ```javascript
 * import * as OracleBot from '@oracle/bots-node-sdk';
 * import * as express from 'express';
 * const app = express();
 * OracleBot.init(app); // must be applied upstream of the receiver for proper parsing.
 *
 * const secret: string = process.env.WEBHOOK_SECRET; // can also be callback (req => string | Promise<string>)
 * app.post('/webhook/message', OracleBot.Middleware.webhookReceiver(secret, (req, res, next) => {
 *   const message: any = req.body;
 *   // Forward verified message to client...
 *   res.send();
 * }));
 */
export function webhookReceiver(secret: string|IWebhookSecretCallback, callback: IWebhookRecieverCallback): express.RequestHandler {
  return new WebhookMiddleware(null, {
    secret,
    callback,
  }).receiver();
}

/**
 * Create a router for webhook messaging. A webhook {@link module:Middleware.webhookReceiver|receiver}
 * is automatically added to the router stack at the specified `path`. Note that
 * if body-parser is applied to the app, then {@link init|OracleBot.init(app)}
 * must also be called.
 * @param options - Middleware configuration options.
 * ```javascript
 * import * as OracleBot from '@oracle/bots-node-sdk';
 * import * as express from 'express';
 * const app = express();
 *
 * // define a new express.Router for webhook messages.
 * const router = OracleBot.Middleware.webhookRouter({
 *   path: '/webhook/messages',
 *   secret: (req) => {
 *     // resolve the secret key string|Promise<string>
 *   },
 *   callback: (req, res, next) => {
 *     // format message and send to client, socket, etc...
 *     res.send();
 *   }
 * });
 *
 * // add any other routes as necessary (for example from the chat client).
 * router.post('/user/messages', (req, res, next) => { ... })
 * app.use(router);
 * ```
 */
export function webhookRouter(options: IWebhookMiddlewareOptions & { parser?: IParserMiddlewareOptions } = <any>{}) {
  const router = express.Router();
  return init(router, {
    webhook: options,
    parser: options.parser,
  });
}
