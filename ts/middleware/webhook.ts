import { CONSTANTS } from '../common/constants';
import { webhookUtil } from '../util/';
import { MiddlewareAbstract, express } from './abstract';
import { IMessage } from '../lib/message';

/**
 * Secret key request callback used in webhook message validation.
 */
export interface IWebhookSecretCallback {
  /** Secret key to validate message or promise */
  (req: express.Request): string | Promise<string>;
}

/**
 * Configuration details for sending messages to bots on a webhook channel.
 */
export interface IWebhookChannel {
  /** webhook url issued by bots platform channel */
  url: string;
  /** message signature secret key used to create X-Hub-Signature */
  secret: string;
}

/**
 * Callback used by webhook client to obtain channel configuration information
 * for a given request.
 * @example
 * function getChannelForReq(req) {
 *   const client = req.params.client;
 *   return {
 *     url: 'https://...',  // Oracle bot webhook url specific to client
 *     secret: '',          // webhook channel secret key
 *   }
 * };
 *
 * app.post('/webhook/:client/messages', OracleBot.Middleware.webhookClient(getChannelForReq, (req, res, callback) => {
 *   // ...
 * }))
 */
export interface IWebhookChannelConfigCallback {
  (req: express.Request): IWebhookChannel | Promise<IWebhookChannel>;
}

/**
 * Webhook client message handler to format a client message for Oracle Bots.
 */
export interface IWebhookClientHandlerCallback {
  (req: express.Request, res: express.Response, callback: (err?: Error | null, message?: IMessage) => void): void;
}

/**
 * Options to configure a webhook client endpoint where messages are forwarded
 * to the bot on a webhook channel.
 */
export interface IWebhookClientOptions {
  /** express route pattern */
  path?: string | RegExp | (string|RegExp)[];
  /** object or async callback to specify the webhook channel configuration details */
  channel: IWebhookChannel | IWebhookChannelConfigCallback;
  // /** optional request handler to validate a client message before sending to bot */
  // validator?: express.RequestHandler;
  /** request handler to receive client messages and format for Bots */
  handler: IWebhookClientHandlerCallback;
}

/**
 * Webhook message receiver callback. Called when a message is sent by bot to
 * the webhook endpoint.
 */
export interface IWebhookRecieverCallback extends express.RequestHandler {
  /** Error if the webhook message fails validation, and message when valid */
  // (error: Error | null, message?: object): void;
  req: express.Request & {
    /** req.body as verified bot message */
    body: IMessage;
  }
}

/**
 * Options for webhook middleware setup.
 */
export interface IWebhookMiddlewareOptions {
  /** Route pattern to receive bot message */
  path?: string | RegExp | (string|RegExp)[];
  secret: string | IWebhookSecretCallback;
  callback: IWebhookRecieverCallback;
  /** Client message handler options for passing client messages to bot */
  client?: IWebhookClientOptions;
}

/**
 * WebhookMiddleware. This middleware can be initialized with or without a
 * router layer. If router is provided, then the receiver will automatically
 * be applied at the path specified in options.
 */
export class WebhookMiddleware extends MiddlewareAbstract {
  protected options: IWebhookMiddlewareOptions;
  /**
   * main initialization
   */
  _init(router: express.Router | express.Application, options: IWebhookMiddlewareOptions) {
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
   * Webhook receiver middleware. Allows direct usage via `Middleware.webhookReceiver`
   */
  public receiver(): express.RequestHandler {
    return (req, res, next) => {
      this._receiverValidationHandler()(req, res, err => {
        // respond to the webhook request.
        if (err) {
          this._logger.error(err);
          // TODO: standardize response for bots platform
          res.json({ok: false, error: err.message}); // status code is already set.
        } else {
          // proceed to message handler
          this._receiverMessageHandler()(req, res, next);
        }
      });
    }
  }

  /**
   * webhook request validation. supported either as middleware layer, or
   * receiver callback
   */
  private _receiverValidationHandler(): express.RequestHandler {
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
  private _receiverMessageHandler(err?: Error): express.RequestHandler {
    return (req, res, next) => {
      const { callback } = this.options;
      // return callback && callback(err, !err && req.body);
      return callback && callback(req, res, next);
    }
  }

  /**
   * Webhook client middleware
   */
  public client(): express.RequestHandler {
    return this._clientMessageHandler();
  }

  /**
   * get client message formatted for bot and send.
   */
  private _clientMessageHandler(): express.RequestHandler {
    return (req, res, next) => {
      const { client: { handler, channel } } = this.options;
      // invoke message handler as promise
      return new Promise<IMessage|IMessage[]>((resolve, reject) => {
        handler(req, res, (err, message) => err ? reject(err) : resolve(message));
      })
      .then(result => [].concat(result) as IMessage[]) // use array of messages
      .then(messages => {
        // TODO: validate messages
        // get webhook channel config & send messages
        return Promise.resolve(typeof channel === 'function' ? channel(req) : channel)
          .then(config => this._sendInSeries(config, messages));
      })
      .then(() => !res.headersSent && res.status(200).send()) // ensure response sent
      .catch(err => { // handle errors
        this._logger.error(err);
        if (!res.headersSent) {
          res.status(500);
          next(err);
        }
      });
    }
  }

  /**
   * send messages in series
   * @param channel
   * @param messages
   */
  private _sendInSeries(channel: IWebhookChannel, messages: IMessage[]): Promise<void> {
    const message = messages.shift();
    return this._sendMessage(channel, message)
      // if more messages, chain in series
      .then(() => messages.length ? this._sendInSeries(channel, messages) : null);
  }

  /**
   * send message to the webhook channel
   * @param channel - channel configuration
   * @param message - message to be sent
   */
  private _sendMessage(channel: IWebhookChannel, message: IMessage): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (message) {
        try {
          const { url, secret } = channel;
          const { userId, messagePayload, ...extras } = message;
          webhookUtil.messageToBotWithProperties(url, secret, userId,
            messagePayload,
            extras,
            error => error ? reject(error) : resolve()
          );
        } catch (e) { reject(e); }
      } else {
        resolve();
      }
    });
  }
}
