import * as middleware from './middleware/'; // directory index
// import { Middleware } from './middleware/';

/**
 * Configurable middleware module.
 *
 * ```javascript
 * import * as OracleBot from '@oracle/bots-node-sdk';
 *
 * export = (app: express.Express): void => {
 *   app.use('/components', OracleBot.Middleware.init({
 *     component: { // component middleware options
 *       cwd: __dirname, // root of application source
 *       autocollect: './components', // relative directory for components in fs
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
export namespace Middleware {
  export const init = middleware.init;
  export const getRouter = middleware.getRouter;
}
