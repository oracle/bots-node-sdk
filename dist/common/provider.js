"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROVIDER_KEY_JOI = 'joi';
exports.PROVIDER_KEY_LOGGER = 'logger';
/**
 * CommonProvider static object reference.
 * @example
 * const Joi = require('joi');
 *
 * CommonProvider.register([
 *   { key: PROVIDER_KEY_JOI, use: Joi }
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
                }
                else {
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
        return this.get(exports.PROVIDER_KEY_LOGGER) || console;
    }
}
/**
 * singleton provider map
 */
CommonProvider._map = new Map();
exports.CommonProvider = CommonProvider;
//# sourceMappingURL=provider.js.map