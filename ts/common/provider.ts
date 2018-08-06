import { ILogger } from './definitions';

export const PROVIDER_KEY_LOGGER = 'logger';

export type ProviderKey = any;
export type ProviderRef = any;
export type ProviderDefinition = {
  key: ProviderKey;
  use: ProviderRef;
};
export type Provider = ProviderDefinition | ProviderDefinition[];

/**
 * polyfill basic method implementations with noop
 * @param logger
 */
function polyfillLogger(logger: any): ILogger {
  const noop = () => {};
  ['log', 'trace', 'info', 'debug', 'warn', 'error']
    .filter(method => !logger[method])
    .forEach(method => logger[method] = noop) // noop unknown methods
  return logger as ILogger;
}

const _DEFAULT_LOGGER: ILogger = polyfillLogger({ });

/**
 * CommonProvider static object reference.
 * ```
 * const log4js = require('log4js');
 *
 * CommonProvider.register([
 *   { key: PROVIDER_KEY_LOGGER, use: log4js.getLogger() }
 * ]);
 * ```
 */
export class CommonProvider {
  /**
   * singleton provider map
   */
  private static _map = new Map<ProviderKey, ProviderRef>();

  /**
   * register common references.
   * @param references - Providers
   */
  public static register(...references: Provider[]): void {
    references
      .map(provider => Array.isArray(provider) ? provider : [provider]) // normalize to ProviderDefinition[] form
      .forEach(providers => {
        providers.forEach(provider => {
          if (!this._map.has(provider.key)) {
            this._map.set(provider.key, provider.use);
          } else {
            this.getLogger().warn(`${this.constructor.name} already registered ${provider.key}`);
          }
        })
      });
  }

  /**
   * arbitrary static reference getter
   * @param key - key for registered object
   */
  public static get(key: ProviderKey): ProviderRef {
    return this._map.get(key);
  }

  /**
   * accessor for a shared logger reference.
   * @return logger interface object
   */
  public static getLogger(): ILogger {
    const logger = this.get(PROVIDER_KEY_LOGGER) || _DEFAULT_LOGGER;
    return polyfillLogger(logger);
  }

}
