import { Type, Primitive } from '../../common/definitions';
import { BotComponentInterface, BotConversationHandler } from './abstract';

export type ComponentMetaName = string;

export interface BotComponentMeta {
  name?: ComponentMetaName;
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
 * BotComponent
 * @param annotations {BotComponent} - metadata
 */
export const BotComponent = (annotations: BotComponent = {}): Function => { // decorator factory
  return <T extends Type<BotComponentInterface>>(ctor: T) => { // class decorator
    // assert annotation component name.
    annotations.name = annotations.name ||
      ctor.prototype.constructor.name.replace(/([a-z-]+)([A-Z])/g, '$1.$2').toLowerCase();

    return class extends ctor implements BotComponentInterface {
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
