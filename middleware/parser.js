'use strict';

const bodyParser = require("body-parser");
const { MiddlewareAbstract } = require("./abstract");
const { CONSTANTS } = require('../common/constants');

/**
 * Options used for express {@link https://www.npmjs.com/package/body-parser|body-parser}
 * in bots custom middleware. Options are a subset of those available in body-parser,
 * and cover most general use cases. If body-parser requirements extend beyond these
 * general options, consider using the {@link module:Util/Webhook.bodyParserRawMessageVerify}
 * function in your middleware configuration.
 * @typedef ParserOptions
 * @alias ParserOptions
 * @memberof module:Middleware
 * @property {boolean|Object} [json=true] - Parse json body payloads
 * @property {boolean|Object} [urlencoded=true] - Parse urlencoded body payloads
 * @property {string} [limit='5mb'] - Parser body size limit
 * @property {Function} [verify] - Additional body parser verification function 
 * @see {@link https://www.npmjs.com/package/body-parser}
 */

/**
 * Body parser middleware
 * @private
 */
class ParserMiddleware extends MiddlewareAbstract {
  /**
   * initialize the body-parser middleware on the application service
   * @param {external.ExpressApplication} service
   * @param {ParserOptions} options 
   */
  _init(service, options) {
    if (options.urlencoded || options.urlencoded == null) {
      this._addParser(service, bodyParser.urlencoded(this._getOptions({ extended: true }, options.urlencoded)));
    }
    if (options.json || options.json == null) {
      this._addParser(service, bodyParser.json(this._getOptions({}, options.json)));
    }
  }

  /**
   * add/replace parser to the application or router stack.
   * @param {external.ExpressApplication} service 
   * @param {function} parser - body parser middleware
   */
  _addParser(service, parser) {
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
  _commonOptions() {
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
    }
  }

  /**
   * get final parser options by combining defaults with user-defined opts
   * @param {object} defaults - parser default options
   * @param {*} opts - user defined options
   */
  _getOptions(defaults, opts) {
    opts = typeof opts === 'object' ? opts : {};
    return Object.assign(defaults, opts, this._commonOptions());
  }
}

module.exports = {
  ParserMiddleware,
}
