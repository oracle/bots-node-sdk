"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const provider_1 = require("./provider");
class CommonValidator {
    /**
     * static method to provide a singleton schema object reference
     * @param factory - Joi schema factory accepting a single argument, the joi validator object.
     */
    static getSchema(factory) {
        if (!this._schemaCache.has(factory)) {
            const joi = provider_1.CommonProvider.get(provider_1.PROVIDER_KEY_JOI);
            if (!joi) {
                throw new Error(`'${provider_1.PROVIDER_KEY_JOI}' reference not provided`);
            }
            const schema = factory(joi);
            this._schemaCache.set(factory, schema);
        }
        return this._schemaCache.get(factory);
    }
    /**
     * static validation method
     * @param factory - Joi schema factory (joi): Joi.Schema
     * @param payload - Payload to validate against schema
     * @param options - Validation options (optional)
     */
    static validate(factory, payload, options) {
        return this.getSchema(factory).validate(payload, options);
    }
}
/**
 * static schema ref
 */
CommonValidator._schemaCache = new Map();
exports.CommonValidator = CommonValidator;
//# sourceMappingURL=validator.js.map