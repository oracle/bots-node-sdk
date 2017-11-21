import { express, MiddlewareAbstract } from './abstract';
import * as bodyParser from 'body-parser';

/**
 * concentrated parser middleware options
 */
export interface ParserMiddlewareOptions {
  urlencoded?: boolean;
  json?: boolean;
  limit?: string;
}

export class ParserMiddleware extends MiddlewareAbstract {

  protected _init(router: express.Router, options: ParserMiddlewareOptions): void {
    const common = {
      limit: options.limit || '5mb',
    };
    if (options.urlencoded || options.urlencoded == null) {
      router.use(bodyParser.urlencoded({extended: true, ...common}));
    }
    if (options.json || options.urlencoded == null) {
      router.use(bodyParser.json({...common}));
    }
  }

}
