import * as middleware from './middleware/'; // directory index
// import { Middleware } from './middleware/';

/**
 * Configurable middleware module.
 *
 * ```javascript
 * import * as OracleBot from '@oracle/bots-node-sdk';
 *
 * export = (app: express.Express): void => {
 *   app.use('/components', OracleBot.Middleware.customComponent({
 *     cwd: __dirname, // root of application source
 *     register: [ // explicitly provide a global registry
 *       './path/to/a/component',
 *       require('./path/to/another/component'),
 *       './path/to/other/components',
 *       './path/to/a/directory',
 *     ]
 *   }));
 * };
 * ```
 */
export namespace Middleware {
  export const customComponent = middleware.customComponent;
}
