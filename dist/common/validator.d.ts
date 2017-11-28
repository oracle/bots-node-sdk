import * as Joi from 'joi';
export interface IValidationSchemaFactory {
    (joi: any): Joi.Schema;
}
export declare class CommonValidator {
    /**
     * static schema ref
     */
    private static _schemaCache;
    /**
     * static method to provide a singleton schema object reference
     * @param factory - Joi schema factory accepting a single argument, the joi validator object.
     */
    static getSchema(factory: IValidationSchemaFactory): Joi.Schema;
    /**
     * static validation method
     * @param factory - Joi schema factory (joi): Joi.Schema
     * @param payload - Payload to validate against schema
     * @param options - Validation options (optional)
     */
    static validate(factory: IValidationSchemaFactory, payload: any, options?: Joi.ValidationOptions): Joi.ValidationResult<any>;
}
