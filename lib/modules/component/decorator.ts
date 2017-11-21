import { Type, Primitive } from '../../common/definitions';
import { ComponentInterface } from './abstract';

export type BotComponentMetaName = string;

/**
 * Component metadata defintion
 */
export interface BotComponentMeta {
  name?: BotComponentMetaName;
  supportedActions?: string[];
  properties?: {
    [property: string]: {
      type: Primitive,
      required?: boolean,
    }
  };
}
export interface BotComponent extends BotComponentMeta { }

/**
 * BotComponent class decorator function. (TypeScript only)
 * Used to source component metadata object.
 * @param annotations Component metadata object.
 */
export const BotComponent = (annotations: BotComponent = {}): Function => { // decorator factory
  return <T extends Type<ComponentInterface>>(ctor: T) => { // class decorator
    // assert annotation component name.
    annotations.name = annotations.name ||
      ctor.prototype.constructor.name.replace(/([a-z-]+)([A-Z])/g, '$1.$2').toLowerCase();

    return class extends ctor implements ComponentInterface {
      private readonly __decoratorMetadata = Object.assign({}, annotations);

      // auto-implement the interface methods
      metadata(): BotComponentMeta {
        return this.__decoratorMetadata;
      }
      // front door of component instance invokation.
      invoke(...args: any[]): void {
        const cb = (args[args.length - 1] || function(err) {throw err});
        if (!super.invoke) {
          cb(new Error(`${ctor.prototype.constructor.name} invoke() method was not implemented.`));
        } else {
          try {
            super.invoke.apply(this, args);
          } catch (e) {
            cb(e);
          }
        }
      }
    }
  };
};
