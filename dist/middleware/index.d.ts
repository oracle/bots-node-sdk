/// <reference types="express" />
import * as express from 'express';
import { IAuthMiddlewareOptions, AUTH_TYPE } from './auth';
import { IParserMiddlewareOptions } from './parser';
import { IComponentMiddlewareOptions } from './component';
export { AUTH_TYPE };
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
export declare namespace Middleware {
    /**
     * MiddlewareOptions. Define options/configuration for Bot middleware.
     */
    interface IMiddewareOptions {
        root?: string;
        auth?: IAuthMiddlewareOptions;
        parser?: IParserMiddlewareOptions;
        component?: IComponentMiddlewareOptions;
    }
    /**
     * init middleware function. Add bot middleware to the app router stack.
     * @param options: MiddlewareOptions to configure the middleware.
     * @return express.Router
     * @todo add webhook middleware
     */
    function init(options?: IMiddewareOptions): express.Router;
}
