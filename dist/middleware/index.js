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
 *     component: { // component middleware options
 *       cwd: __dirname, // root of application source
 *       path: './components', // relative directory for components in fs
 *       register: [ // explicitly provide a global registry
 *         './path/to/a/component',
 *         require('./path/to/another/component'),
 *         './path/to/other/components',
 *         './path/to/a/directory',
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
     * @param options  options to configure the middleware.
     * @return express.Router
     * @todo add webhook middleware
     */
    function init(options = {}) {
        const router = express.Router();
        // create iterable map
        const mwMap = new Map([
            ['parser', parser_1.ParserMiddleware],
            ['component', component_1.ComponentMiddleware],
        ]);
        // iterate and apply the middleware layers
        mwMap.forEach((mw, key) => {
            if (mw.required || !!options[key]) {
                mw.extend(router, options[key]);
            }
        });
        return router;
    }
    Middleware.init = init;
})(Middleware = exports.Middleware || (exports.Middleware = {}));
//# sourceMappingURL=index.js.map