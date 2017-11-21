import * as Joi from 'joi';
import { CommonProvider, PROVIDER_KEY_JOI } from './provider';

export class CommonValidator {

  /**
   * static schema ref
   */
  private static _schema = new Map<any, Joi.Schema>();

  /**
   * static method to provide a singleton schema object reference
   * @param schemaFactory a Joi schema factory accepting a single argument, the joi validator object.
   */
  public static fromFactory(factory: (joi: any) => Joi.Schema): Joi.Schema {
    if (!this._schema.has(factory)) {
      const schema = factory(CommonProvider.get(PROVIDER_KEY_JOI))
      this._schema.set(factory, schema);
    }
    return this._schema.get(factory);
  }
}
