import * as joi from 'joi';

export interface IValidationSchemaFactory {
  (joi: any): joi.Schema;
}

const schemaCache = new Map<any, joi.Schema>();

export class CommonValidator {

  /**
   * static method to provide a singleton schema object reference
   * @param factory - Joi schema factory accepting a single argument, the joi validator object.
   */
  public static getSchema(factory: IValidationSchemaFactory): joi.Schema  {
    if (!schemaCache.has(factory)) {
      const schema = factory(joi);
      schemaCache.set(factory, schema);
    }
    return schemaCache.get(factory);
  }

  /**
   * static validation method
   * @param factory - Joi schema factory (joi): Joi.Schema
   * @param payload - Payload to validate against schema
   * @param options - Validation options (optional)
   */
  public static validate(factory: IValidationSchemaFactory, payload: any, options?: joi.ValidationOptions): joi.ValidationResult<any> {
    return this.getSchema(factory).validate(payload, options);
  }

}
