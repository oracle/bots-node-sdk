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
                // capture raw body/encoding for signature validation (if necessary)
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
exports.ParserMiddleware = ParserMiddleware;
//# sourceMappingURL=parser.js.map