import * as Joi from 'joi';
import { CommonProvider, PROVIDER_KEY_JOI } from './provider';

export interface IValidationSchemaFactory {
  (joi: any): Joi.Schema;
}

export class CommonValidator {

  /**
   * static schema ref
   */
  private static _schemaCache = new Map<any, Joi.Schema>();

  /**
   * static method to provide a singleton schema object reference
   * @param factory - Joi schema factory accepting a single argument, the joi validator object.
   */
  public static getSchema(factory: IValidationSchemaFactory): Joi.Schema {
    if (!this._schemaCache.has(factory)) {
      const joi = CommonProvider.get(PROVIDER_KEY_JOI);
      if (!joi) {
        throw new Error(`'${PROVIDER_KEY_JOI}' reference not provided`);
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
  public static validate(factory: IValidationSchemaFactory, payload: any, options?: Joi.ValidationOptions): Joi.ValidationResult<any> {
    return this.getSchema(factory).validate(payload, options);
  }

}
