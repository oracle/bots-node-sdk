import * as express from 'express';
import { ILogger } from '../common/definitions';
import { IParserMiddlewareOptions } from '../middleware/parser';

/**
 * options for OracleBot.init()
 */
export interface IMainInitOptions {
  logger?: ILogger;
  parser?: IParserMiddlewareOptions;
}

/**
 * Primary bot application initialization function used to prepare the application
 * for bot message handling. Unless the parser option is explicitly false, this
 * function requires https://www.npmjs.com/package/express|express
 * and https://www.npmjs.com/package/body-parser|body-parser.
 * @param app - Express application reference.
 * @param options - Configuration options.
 * @return - the app or router with which init was called.
 *
 * ```javascript
 * import * as OracleBot from '@oracle/bots-node-sdk';
 * import * as express from 'express';
 *
 * const app = express();
 * OracleBot.init(app, {
 *   // options...
 * });
 * ```
 */
export function init(app: express.Router | express.Application, options: IMainInitOptions = <any>{}) {
  // provide custom logger
  if (options.logger) {
    const { setLogger } = require('../config/');
    setLogger(options.logger);
  }
  // init body-parser middleware
  if (options.parser || options.parser == null) {
    const { ParserMiddleware } = require('../middleware/parser');
    ParserMiddleware.extend(app, options.parser);
  }

  return app;
}
