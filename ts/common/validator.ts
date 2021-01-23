import * as joi from '@hapi/joi';
import { CommonProvider, PROVIDER_KEY_JOI } from './provider';

export interface ValidationSchemaFactory {
  (joi: any): joi.Schema;
}

const schemaCache = new Map<any, joi.Schema>();

export class CommonValidator {

  private static _getJoi(): any {
    let Joi = CommonProvider.get(PROVIDER_KEY_JOI);
    if (!Joi) {
      Joi = require('joi');
      CommonProvider.register({
        key: PROVIDER_KEY_JOI,
        use: Joi,
      });
    }
    return Joi;
  }

  /**
   * static method to provide a singleton schema object reference
   * @param factory - Joi schema factory accepting a single argument, the joi validator object.
   */
  public static getSchema(factory: ValidationSchemaFactory): joi.Schema  {
    if (!schemaCache.has(factory)) {
      const schema = factory(this._getJoi());
      schemaCache.set(factory, schema);
    }
    return schemaCache.get(factory);
  }

  static useInBrowser() {
    CommonProvider.register({
      key: PROVIDER_KEY_JOI,
      use: require('joi-browser'),
    });
  }

  /**
   * static validation method
   * @param factory - Joi schema factory (joi): Joi.Schema
   * @param payload - Payload to validate against schema
   * @param options - Validation options (optional)
   */
  public static validate(factory: ValidationSchemaFactory, payload: any, options?: joi.ValidationOptions): joi.ValidationResult<any> {
    return this.getSchema(factory).validate(payload, options);
  }

}
