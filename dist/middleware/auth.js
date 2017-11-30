"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_1 = require("./abstract");
const auth = require("basic-auth");
var AUTH_TYPE;
(function (AUTH_TYPE) {
    AUTH_TYPE[AUTH_TYPE["INHERIT"] = 0] = "INHERIT";
    AUTH_TYPE[AUTH_TYPE["BASIC"] = 1] = "BASIC";
})(AUTH_TYPE = exports.AUTH_TYPE || (exports.AUTH_TYPE = {}));
;
class AuthMiddleware extends abstract_1.MiddlewareAbstract {
    _init(router, options) {
        switch (options.type) {
            case AUTH_TYPE.BASIC:
                router.use(this._basicHandler(options.credentials));
                break;
            case AUTH_TYPE.INHERIT: // Do nothing
            default:
                break;
        }
    }
    _basicHandler(config) {
        return (req, res, next) => {
            const requestCredentials = auth(req);
            if (!requestCredentials || requestCredentials.name !== config.user || requestCredentials.pass !== config.pass) {
                res.status(401)
                    .set('WWW-Authenticate', 'Basic realm="OracleBot Default Custom Component Service"')
                    .end('Access denied');
            }
            else {
                next();
            }
        };
    }
}
exports.AuthMiddleware = AuthMiddleware;
//# sourceMappingURL=auth.js.map