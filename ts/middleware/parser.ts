import * as bodyParser from 'body-parser';
import { CONSTANTS } from '../common/constants';
import { MiddlewareAbstract, express, ServiceInstance } from './abstract';

/**
 * concentrated parser middleware options
 */
export interface ParserMiddlewareOptions {
  /** urlencoded content type parsing */
  urlencoded?: boolean|object;
  /** json body parsing configuration */
  json?: boolean|object;
  /** body size limit */
  limit?: string;
  /** body-parser verification callback */
  verify?: (req: express.Request, res: express.Request, buf: Buffer, encoding: string) => void;
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

  protected _init(service: ServiceInstance, options: ParserMiddlewareOptions): void {
    if (options.urlencoded || options.urlencoded == null) {
      this._addParser(service, bodyParser.urlencoded(this._getOptions({ extended: true }, options.urlencoded)));
    }
    if (options.json || options.json == null) {
      this._addParser(service, bodyParser.json(this._getOptions({}, options.json)));
    }
  }

  /**
   * add/replace parser to the application or router stack.
   * @param service - application or router layer to add
   * @param parser - body parser middleware
   */
  private _addParser(service: ServiceInstance, parser: express.RequestHandler) {
    let stack = (service && (service['_router'] || service).stack) || [];
    let replaced = false;

    // find/replace in stack
    stack.filter(layer => layer.name === parser.name)
      .forEach(layer => {
        replaced = true;
        layer.handle = parser;
      });

    // add to stack if not already replaced
    if (!replaced) {
      service.use(parser);
    }
  }

  /**
   * get common options object
   */
  private _commonOptions(): ParserMiddlewareOptions {
    const { limit, verify } = this.options;
    return {
      limit: limit || '5mb',
      verify: (req, res, buf, encoding) => {
        // Instead of just letting bodyParser.json to parse the raw message to JSON, the rawMessage and its encoding is saved as properties
        // 'rawBody' and 'encoding' for use in signature verification in method verifyMessageFormat.
        req[CONSTANTS.PARSER_RAW_BODY] = buf;
        req[CONSTANTS.PARSER_RAW_ENCODING] = encoding;
        return verify ? verify(req, res, buf, encoding) : true;
      }
    };
  }

  /**
   * get final parser options by combining defaults with user-defined opts
   * @param {object} defaults - parser default options
   * @param {*} opts - user defined options
   */
  private _getOptions(defaults: any, opts: any) {
    opts = typeof opts === 'object' ? opts : {};
    return Object.assign(defaults, opts, this._commonOptions());
  }

}
