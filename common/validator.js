'use strict';

const { CommonProvider, PROVIDER_KEY_JOI } = require('./provider');

const schemaCache = new Map();

/**
 * centralized object validation class.
 * @private
 */
class CommonValidator {

  static _getJoi() {
    let joi = CommonProvider.get(PROVIDER_KEY_JOI);
    if (!joi && joi !== null) {
      joi = eval('require')('@hapi/joi');
      CommonProvider.register({
        key: PROVIDER_KEY_JOI,
        use: joi,
      });
    }
    return joi;
  }
  /**
   * static method to provide a singleton schema object reference
   * @param factory - Joi schema factory accepting a single argument, the joi validator object.
   */
  static getSchema(factory) {
    if (!schemaCache.has(factory)) {
      const joi = this._getJoi();
      if (joi) {
        schemaCache.set(factory, factory(joi));
      }
    }
    return schemaCache.get(factory);
  }

  static useInBrowser() {
    CommonProvider.register({
      key: PROVIDER_KEY_JOI,
      use: null,
    });
  }

  /**
   * static validation method
   * @param factory - Joi schema factory (joi): Joi.Schema
   * @param payload - Payload to validate against schema
   * @param options - Validation options (optional)
   */
  static validate(factory, payload, options) {
    const schema = this.getSchema(factory);
    return schema ? schema.validate(payload, options) : true;
  }
}

module.exports = {
  CommonValidator,
};
