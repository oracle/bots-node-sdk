"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const auth_1 = require("./auth");
exports.AUTH_TYPE = auth_1.AUTH_TYPE;
const parser_1 = require("./parser");
const component_1 = require("./component");
;
/**
 * middleware function. Add bot middleware to the app router stack.
 * @param options: MiddlewareOptions to configure the middleware.
 * @return express.Router
 * @todo add webhook middleware
 */
function middleware(options = {}) {
    const router = express.Router();
    const root = options.root || process.cwd();
    // create iterable map
    const mwMap = new Map([
        ['auth', auth_1.AuthMiddleware],
        ['parser', parser_1.ParserMiddleware],
        ['component', component_1.ComponentMiddleware],
    ]);
    // iterate and apply the middleware layers
    mwMap.forEach((mw, key) => {
        if (!!options[key]) {
            mw.extend(root, router, options[key]);
        }
    });
    return router;
}
exports.middleware = middleware;
//# sourceMappingURL=index.js.map