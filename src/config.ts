import * as _Config from './config/'; // directory

/**
 * SDK 'Config' module exposing optional configuration methods.
 *
 * ```javascript
 * import { Config } from '@oracle/bots-node-sdk';
 * // or
 * import * as Config from '@oracle/bots-node-sdk/config';
 * ```
 */
export namespace Config {
  export const setLogger = _Config.setLogger;
}
