import { express, MiddlewareAbstract } from './abstract';
import * as auth from 'basic-auth';

export enum AUTH_TYPE {
  INHERIT, // Inherit from upstream services
  BASIC = 1, // HTTP Basic auth
};

/**
 * concentrated auth middleware options
 */
export type AuthMiddlewareOptions = {
  type: AUTH_TYPE;
  credentials?: AuthBasicCredentials;
}

export interface AuthBasicCredentials {
  user?: string;
  pass?: string;
}

export class AuthMiddleware extends MiddlewareAbstract {

  protected _init(router: express.Router, options: AuthMiddlewareOptions): void {
    switch (options.type) {
      case AUTH_TYPE.BASIC:
        router.use(this._basicHandler(options.credentials));
        break;
    }
  }

  private _basicHandler(config: AuthBasicCredentials): express.RequestHandler {
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
