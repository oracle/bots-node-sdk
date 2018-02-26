"use strict";

exports.PROVIDER_KEY_LOGGER = 'logger';

/**
 * CommonProvider static object reference.
 * 
 * ```
 * const log4js = require('log4js');
 *
 * CommonProvider.register([
 *   { key: PROVIDER_KEY_LOGGER, use: log4js.getLogger() }
 * ]);
 * ```
 */
class CommonProvider {

  /**
   * register common references.
   * @param references - Providers
   */
  static register(...references) {
    references
      .map(provider => Array.isArray(provider) ? provider : [provider]) // normalize to ProviderDefinition[] form
      .forEach(providers => {
        providers.forEach(provider => {
          if (!this._map.has(provider.key)) {
            this._map.set(provider.key, provider.use);
          } else {
            this.getLogger().warn(`${this.constructor.name} already registered ${provider.key}`);
          }
        });
      });
  }
  /**
   * arbitrary static reference getter
   * @param key - key for registered object
   */
  static get(key) {
    return this._map.get(key);
  }
  /**
   * accessor for a shared logger reference.
   * @return logger interface object
   */
  static getLogger() {
    const logger = this.get(exports.PROVIDER_KEY_LOGGER) || console;
    // polyfill basic method implementations with noop
    ['log', 'trace', 'info', 'debug', 'warn', 'error'].forEach(method => {
      logger[method] = logger[method] || (() => {}); // noop unknown methods.
    });
    return logger;
  }
}
/**
 * singleton provider map
 */
CommonProvider._map = new Map();

module.exports = {
  CommonProvider,
};
