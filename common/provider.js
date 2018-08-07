"use strict";

exports.PROVIDER_KEY_LOGGER = 'logger';
exports.PROVIDER_KEY_JOI = 'joi';

/**
 * polyfill basic method implementations with noop
 * @param {*} logger 
 */
function polyfillLogger(logger) {
  const noop = () => {};
  ['log', 'trace', 'info', 'debug', 'warn', 'error']
    .filter(method => !logger[method])
    .forEach(method => logger[method] = noop) // noop unknown methods
  return logger;
}

const _DEFAULT_LOGGER = polyfillLogger({ });

/**
 * CommonProvider static object reference.
 * 
 * @example
 * const log4js = require('log4js');
 *
 * CommonProvider.register([
 *   { key: PROVIDER_KEY_LOGGER, use: log4js.getLogger() }
 * ]);
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
    const logger = this.get(exports.PROVIDER_KEY_LOGGER) || _DEFAULT_LOGGER;
    return polyfillLogger(logger);
  }
}
/**
 * singleton provider map
 */
CommonProvider._map = new Map();

exports.CommonProvider = CommonProvider;
