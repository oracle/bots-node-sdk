import { ILogger } from './definitions';
export declare const PROVIDER_KEY_JOI = "joi";
export declare const PROVIDER_KEY_LOGGER = "logger";
export declare type ProviderKey = any;
export declare type ProviderRef = any;
export declare type ProviderDefinition = {
    key: ProviderKey;
    use: ProviderRef;
};
export declare type Provider = ProviderDefinition | ProviderDefinition[];
/**
 * CommonProvider static object reference.
 * @example
 * const Joi = require('joi');
 *
 * CommonProvider.register([
 *   { key: PROVIDER_KEY_JOI, use: Joi }
 * ]);
 */
export declare class CommonProvider {
    /**
     * singleton provider map
     */
    private static _map;
    /**
     * register common references.
     * @param references - Providers
     */
    static register(...references: Provider[]): void;
    /**
     * arbitrary static reference getter
     * @param key - key for registered object
     */
    static get(key: ProviderKey): ProviderRef;
    /**
     * accessor for a shared logger reference.
     * @return logger interface object
     */
    static getLogger(): ILogger;
}
