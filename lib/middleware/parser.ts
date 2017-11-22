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

/**
 * extended request object with raw properties
 */
export interface ParsedRequest extends express.Request {
  rawBody: Buffer,
  encoding: string,
}

/**
 * Body parser middleware
 */
export class ParserMiddleware extends MiddlewareAbstract {

  protected _init(router: express.Router, options: ParserMiddlewareOptions): void {
    const common = {
      limit: options.limit || '5mb',
      verify: (req: ParsedRequest, res, buf, encoding) => {
        // capture raw body/encoding for signature validation (if necessary)
        req.rawBody = buf;
        req.encoding = encoding;
        return;
      }
    };
    if (options.urlencoded || options.urlencoded == null) {
      router.use(bodyParser.urlencoded({extended: true, ...common}));
    }
    if (options.json || options.json == null) {
      router.use(bodyParser.json({ ...common }));
    }
  }

}
