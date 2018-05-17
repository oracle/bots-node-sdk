import { CONSTANTS } from '../common/constants';
import { webhookUtil } from '../util/';
import { MiddlewareAbstract, express } from './abstract';

/**
 * Secret key request callback used in webhook message validation.
 */
export interface IWebhookSecretCallback {
  /** Secret key to validate message or promise */
  (req: express.Request): string | Promise<string>;
}

/**
 * Webhook message receiver callback. Called when a message is sent by bot to
 * the webhook endpoint.
 */
export interface IWebhookRecieverCallback extends express.RequestHandler {
  /** Error if the webhook message fails validation, and message when valid */
  // (error: Error | null, message?: object): void;
}

/**
 * Options for webhook middleware setup.
 */
export interface IWebhookMiddlewareOptions {
  /** Route pattern to receive bot message */
  path?: string | RegExp | (string|RegExp)[];
  secret: string | IWebhookSecretCallback;
  callback: IWebhookRecieverCallback;
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
      // add message receiver
      router.post(options.path || '/', this.receiver());
    }
  }

  /**
   * Webhook receiver middleware. Allows direct usage via `Middleware.webhookReceiver`
   */
  receiver(): express.RequestHandler {
    return (req, res, next) => {
      this.validationHandler()(req, res, err => {
        // respond to the webhook request.
        if (err) {
          this._logger.error(err);
          // TODO: standardize response for bots platform
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
  validationHandler(): express.RequestHandler {
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
  messageHandler(err?: Error): express.RequestHandler {
    return (req, res, next) => {
      const { callback } = this.options;
      // return callback && callback(err, !err && req.body);
      return callback && callback(req, res, next);
    }
  }
}
