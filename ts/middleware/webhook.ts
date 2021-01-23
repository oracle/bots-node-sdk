import { CONSTANTS } from '../common/constants';
import { webhookUtil } from '../util/';
import { express } from './abstract';
import { Message, MessageModel } from '../lib/message';
import { STATUS_CODE } from './codes';


/**
 * Configuration details for sending messages to bots on a webhook channel.
 */
export interface WebhookChannel {
  /** webhook url issued by bots platform channel */
  url: string;
  /** message signature secret key used to create X-Hub-Signature */
  secret: string;
}

/**
 * Callback used by webhook client to obtain channel configuration information.
 * The req object is the first argument when called within the receiver.
 * for a given request.
 */
export interface WebhookChannelCallback {
  (req?: express.Request): WebhookChannel | Promise<WebhookChannel>;
}

/**
 * Option for webhook channel configuration.
 */
export type WebhookChannelOption = WebhookChannel | WebhookChannelCallback;

/**
 * Options to configure a webhook client endpoint where messages are forwarded
 * to the bot on a webhook channel.
 */
export interface WebhookClientOptions {
  /** object or async callback to specify the webhook channel configuration details */
  channel?: WebhookChannelOption;
}

/**
 * Webhook message receiver callback. Called when a message is sent by bot to
 * the webhook endpoint.
 */
export interface WebhookRecieverCallback extends express.RequestHandler {
  /** Error if the webhook message fails validation, and message when valid */
  (req: express.Request & {
    /** req.body as verified bot message */
    body: Message;
  }, res: express.Response, next: express.NextFunction): void;
}

export enum WebhookEvent {
  /** Error event */
  ERROR = 1, // begin with positive integer
  /** Event dispatched when message is sent to bot */
  MESSAGE_SENT,
  /** Event dispatched when message is received from bot */
  MESSAGE_RECEIVED,
}

export interface WebhookEventCallback {
  (...args: any[]): void;
}

export class WebhookClient {
  private _subscriptions = new Map<WebhookEvent, Set<WebhookEventCallback>>();
  private _options: WebhookClientOptions;

  constructor(options?: WebhookClientOptions) {
    this._options = options || {};
    // prepare event subscription map
    Object.keys(WebhookEvent)
      .filter(key => ~~key) // non-zero integer only
      .forEach((eventType: any) => {
        this._subscriptions.set(<any>`${eventType}`, new Set<WebhookEventCallback>())
      });
  }

  private _getSubscriptions(event: WebhookEvent): Set<any> {
    const subs = this._subscriptions.get(<any>`${event}`);
    if (!subs) {
      throw new Error(`Invalid webhook event type, '${event}'`);
    }
    return subs;
  }

  private _dispatch(event: WebhookEvent, args: any): void {
    this._getSubscriptions(event)
      .forEach(handler => handler.apply(handler, [].concat(args)));
  }

  private _getChannelConfig(req?: express.Request): Promise<WebhookChannel> {
    const { channel } = this._options;
    return Promise.resolve(typeof channel === 'function' ? channel(req) : channel)
      .then(config => {
        // ensure backwards compatibility with webhookReceiver configuration (secret only callback)
        return typeof config === 'object' ?  config : {
          url: null,
          secret: config
        };
      });
  }

  /**
   * Subscribe to bot client events
   * @param event - Event type to subscribe
   * @param handler - Corresponding event type handler.
   */
  public on(event: WebhookEvent.ERROR, handler: (error: Error) => void): this;
  public on(event: WebhookEvent.MESSAGE_SENT, handler: (message: Message) => void): this;
  public on(event: WebhookEvent.MESSAGE_RECEIVED, handler: (response: Message) => void): this;
  public on(event: WebhookEvent, handler: WebhookEventCallback): this {
    this._getSubscriptions(event).add(handler);
    return this;
  }

  /**
   * Send user message to bot
   * @param message - Complete payload to send
   * @param channel - Webhook channel configuration to use (if different than that in the instance options)
   */
  public send(message: Message, channel?: WebhookChannel): Promise<void> {
    return Promise.resolve(channel || this._getChannelConfig())
      .then(webhook => new Promise<any>((resolve, reject) => {
        if (message) {
          try {
            const { url, secret } = webhook;
            const { userId, messagePayload, ...extras } = message;
            webhookUtil.messageToBotWithProperties(url, secret, userId,
              messagePayload,
              extras,
              error => error ? reject(error) : resolve(true)
            );
          } catch (e) { reject(e); }
        } else {
          resolve(null);
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
   * Webhook receiver middleware.
   * @param callback - callback on message received, otherwise emits event
   */
  public receiver(callback?: WebhookRecieverCallback): express.RequestHandler {
    return (req, res, next) => {
      // Validate message from bot
      this._receiverValidationHandler()(req, res, err => {
        // respond to the webhook request.
        if (err) {
          this._dispatch(WebhookEvent.ERROR, err);
          // TODO: standardize response for bots platform
          res.json({ok: false, error: err.message}); // status code is already set.
        } else {
          // invoke callback or dispatch to bot response subscribers
          if (callback) {
            callback(req, res, next);
          } else {
            this._dispatch(WebhookEvent.MESSAGE_RECEIVED, req.body);
            res.json({ ok: true });
          }
        }
      });
    }
  }

  /**
   * webhook request validation. supported either as middleware layer, or
   * receiver callback
   */
  private _receiverValidationHandler(): express.RequestHandler {
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
    }
  }

  /**
   * Returns the MessageModel class for creating or validating messages to or from bots.
   */
  public MessageModel() {
    return MessageModel;
  }

}
