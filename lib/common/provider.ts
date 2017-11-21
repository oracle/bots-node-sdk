import * as Joi from 'joi';

import { Logger } from './definitions';

export const PROVIDER_KEY_JOI = 'joi';
export const PROVIDER_KEY_LOGGER = 'logger';

export type ProviderKey = any;
export type ProviderRef = any;
export type ProviderDefinition = {
  key: ProviderKey;
  use: any;
};
export type Provider = ProviderDefinition | ProviderDefinition[];

/**
 * CommonProvider static object reference.
 * @example
 * const Joi = require('joi');
 *
 * CommonProvider.register([
 *   { key: PROVIDER_KEY_JOI, use: Joi }
 * ]);
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
            throw new Error(`${this.constructor.name} already registered ${provider.key}`);
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
  public static getLogger(): Logger {
    return this.get(PROVIDER_KEY_LOGGER) || console;
  }

}
