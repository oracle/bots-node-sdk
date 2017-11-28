import { express, MiddlewareAbstract } from './abstract';
import * as bodyParser from 'body-parser';

/**
 * concentrated parser middleware options
 */
export interface IParserMiddlewareOptions {
  urlencoded?: boolean;
  json?: boolean;
  limit?: string;
}

/**
 * extended request object with raw properties
 */
export interface IParsedRequest extends express.Request {
  rawBody: Buffer,
  encoding: string,
}

/**
 * Body parser middleware
 */
export class ParserMiddleware extends MiddlewareAbstract {

  protected _init(router: express.Router, options: IParserMiddlewareOptions): void {
    const common = {
      limit: options.limit || '5mb',
      verify: (req: IParsedRequest, res, buf, encoding) => {
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
