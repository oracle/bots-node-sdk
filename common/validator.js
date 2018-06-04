"use strict";

let joi = require('joi');
const schemaCache = new Map();

/**
 * centralized object validation class.
 * @private
 */
class CommonValidator {
  /**
   * static method to provide a singleton schema object reference
   * @param factory - Joi schema factory accepting a single argument, the joi validator object.
   */
  static getSchema(factory) {
    if (!schemaCache.has(factory)) {
      const schema = factory(joi);
      schemaCache.set(factory, schema);
    }
    return schemaCache.get(factory);
  }

  static useInBrowser() {
    joi = require('joi-browser');
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

module.exports = {
  CommonValidator,
};
