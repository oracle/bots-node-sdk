/// <reference types="express" />
import * as express from 'express';
import { IParserMiddlewareOptions } from './parser';
import { IComponentMiddlewareOptions } from './component';
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
export declare namespace Middleware {
    /**
     * MiddlewareOptions. Define options/configuration for Bot middleware.
     */
    interface IMiddewareOptions {
        parser?: IParserMiddlewareOptions;
        component?: IComponentMiddlewareOptions;
    }
    /**
     * init middleware function. Add bot middleware to the app router stack.
     * @param options  options to configure the middleware.
     * @return express.Router
     * @todo add webhook middleware
     */
    function init(options?: IMiddewareOptions): express.Router;
}
