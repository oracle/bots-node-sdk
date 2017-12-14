"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_1 = require("./abstract");
const bodyParser = require("body-parser");
/**
 * Body parser middleware
 */
class ParserMiddleware extends abstract_1.MiddlewareAbstract {
    _init(router, options) {
        const common = {
            limit: options.limit || '5mb',
            verify: (req, res, buf, encoding) => {
                // Instead of just letting bodyParser.json to parse the raw message to JSON, the rawMessage and its encoding is saved as properties
                // 'rawBody' and 'encoding' for use in signature verification in method verifyMessageFormat.
                req.rawBody = buf;
                req.encoding = encoding;
                return;
            }
        };
        if (options.urlencoded || options.urlencoded == null) {
            router.use(bodyParser.urlencoded(Object.assign({ extended: true }, common)));
        }
        if (options.json || options.json == null) {
            router.use(bodyParser.json(Object.assign({}, common)));
        }
    }
}
// Parser middleware is required
ParserMiddleware.required = true;
exports.ParserMiddleware = ParserMiddleware;
//# sourceMappingURL=parser.js.map