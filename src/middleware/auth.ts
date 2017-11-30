import { express, MiddlewareAbstract } from './abstract';
import * as auth from 'basic-auth';

export enum AUTH_TYPE {
  INHERIT, // Inherit from upstream services, no middleware applied
  BASIC = 1, // HTTP Basic auth
};

/**
 * concentrated auth middleware options
 */
export interface IAuthMiddlewareOptions {
  type: AUTH_TYPE;
  credentials?: IAuthBasicCredentials;
}

export interface IAuthBasicCredentials {
  user?: string;
  pass?: string;
}

export class AuthMiddleware extends MiddlewareAbstract {

  protected _init(router: express.Router, options: IAuthMiddlewareOptions): void {
    switch (options.type) {
      case AUTH_TYPE.BASIC:
        router.use(this._basicHandler(options.credentials));
        break;
      case AUTH_TYPE.INHERIT: // Do nothing
      default:
        break;
    }
  }

  private _basicHandler(config: IAuthBasicCredentials): express.RequestHandler {
    return (req, res, next) => {
      const requestCredentials = auth(req);
      if (!requestCredentials || requestCredentials.name !== config.user || requestCredentials.pass !== config.pass) {
        res.status(401)
          .set('WWW-Authenticate', 'Basic realm="OracleBot Default Custom Component Service"')
          .end('Access denied');
      } else {
        next();
      }
    }
  }

}
