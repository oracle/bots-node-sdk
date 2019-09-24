import { Primitive, ICallback } from '../../common/definitions';
import { CustomComponentContext } from './sdk';
/**
 * Component metadata defintions
 */
export interface IBaseComponentMetadata {
  name?: string;
}

export interface ICustomComponentMetadata extends IBaseComponentMetadata {
  supportedActions?: string[];
  properties?: {
    [name: string]: {
      type: Primitive,
      required?: boolean,
    }
  };
}

export interface IEntityResolverComponentMetadata extends IBaseComponentMetadata {
  eventHandlerType?: 'ResolveEntities';
  events?: string[];
}

export type IComponentMetadata = ICustomComponentMetadata | IEntityResolverComponentMetadata;

export interface IComponent<T extends IComponentMetadata = ICustomComponentMetadata> {
  metadata(): T;
  invoke?(context: CustomComponentContext, done: ICallback): void;
  handlers?(): any; // TODO: add types for the handler object definitions
}
