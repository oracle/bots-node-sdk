"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const parser_1 = require("./parser");
const component_1 = require("./component");
/**
 * Configurable middleware module.
 *
 * ```javascript
 * import * as OracleBot from '@oracle/bot-js-sdk';
 *
 * export = (app: express.Express): void => {
 *   app.use(OracleBot.Middleware.init({
 *     root: __dirname, // root of application source
 *     component: { // component middleware options
 *       baseDir: 'components', // relative directory for components in fs
 *       register: [ // explicitly provide a global registry
 *         './path/to/a/component',
 *         './path/to/other/components',
 *         './path/to/even/more/components',
 *       ]
 *     }
 *   }));
 * };
 * ```
 */
var Middleware;
(function (Middleware) {
    ;
    /**
     * init middleware function. Add bot middleware to the app router stack.
     * @param options: MiddlewareOptions to configure the middleware.
     * @return express.Router
     * @todo add webhook middleware
     */
    function init(options = {}) {
        const router = express.Router();
        const root = options.root || process.cwd();
        // create iterable map
        const mwMap = new Map([
            ['parser', parser_1.ParserMiddleware],
            ['component', component_1.ComponentMiddleware],
        ]);
        // iterate and apply the middleware layers
        mwMap.forEach((mw, key) => {
            if (mw.required || !!options[key]) {
                mw.extend(root, router, options[key]);
            }
        });
        return router;
    }
    Middleware.init = init;
})(Middleware = exports.Middleware || (exports.Middleware = {}));
//# sourceMappingURL=index.js.map