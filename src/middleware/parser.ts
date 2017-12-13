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
  // Parser middleware is required
  public static required = true;

  protected _init(router: express.Router, options: IParserMiddlewareOptions): void {
    const common = {
      limit: options.limit || '5mb',
      verify: (req: IParsedRequest, res, buf, encoding) => {
        // Instead of just letting bodyParser.json to parse the raw message to JSON, the rawMessage and its encoding is saved as properties
        // 'rawBody' and 'encoding' for use in signature verification in method verifyMessageFormat.
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
