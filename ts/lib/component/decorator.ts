import { Type, Primitive } from '../../common/definitions';
import { IComponent } from './abstract';

export type ComponentMetadataName = string;

/**
 * Component metadata defintion
 */
export interface IComponentMetadata {
  name?: ComponentMetadataName;
  supportedActions?: string[];
  properties?: {
    [name: string]: {
      type: Primitive,
      required?: boolean,
    }
  };
}

export interface Component extends IComponentMetadata { }

/**
 * @preferred
 * Component class decorator function. (`TypeScript` only)
 * Used to source component annotations (metadata) object.
 * @param annotations - Component metadata object.
 *
 * ```javascript
 * import * as OracleBot from '@oracle/bots-node-sdk';
 *
 * @OracleBot.Lib.Component({
 *   name: 'my.custom.component',
 *   properties: {},
 *   supportedActions: []
 * })
 * export class MyCustomComponent {
 *   invoke(conversation: OracleBot.Lib.Conversation, done) {
 *     // ...
 *   }
 * }
 * ```
 */
export const Component = (annotations: Component = {}): Function => { // decorator factory
  return <T extends Type<IComponent>>(ctor: T) => { // class decorator
    // assert annotation component name.
    annotations.name = annotations.name ||
      ctor.prototype.constructor.name.replace(/([a-z-]+)([A-Z])/g, '$1.$2').toLowerCase();

    return class extends ctor implements IComponent {
      private readonly __decoratorMetadata = {...annotations};

      // auto-implement the interface methods
      metadata(): IComponentMetadata {
        if (!!super.metadata) {
          console.warn(`${ctor.prototype.constructor.name} used decorator, but has metadata() defined. Ignoring annotations.`);
          return super.metadata();
        }
        return this.__decoratorMetadata;
      }
      // front door of component instance invocation.
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
