import * as lib from './lib/'; // index
import * as def from './common/definitions';

/**
 * SDK 'Lib' exposing core classes, decorators, etc.
 */
export namespace Lib {

  // Custom component @Component decorator
  // export const Component = lib.Component;
  // export type Component = lib.Component;

  // Legacy Shell (for use by swagger)
  export const ComponentShell = lib.ComponentShell;

  // Custom Component abstraction class
  export abstract class ComponentAbstract extends lib.ComponentAbstract { }

  // Custom Component registry class
  export class ComponentRegistry extends lib.ComponentRegistry { }

  //  Component package interface
  export type ComponentPackage = lib.ComponentPackage;

  // Component Conversation invocation
  export class CustomComponentContext extends lib.CustomComponentContext { }

  // Entity Resolution invocation
  export class EntityResolutionContext extends lib.EntityResolutionContext { }

  // InvocationCallback interface for custom component invocation
  export type InvocationCallback = def.InvocationCallback;

  // Conversation Message Model
  export class MessageModel extends lib.MessageModel { }

  // Custom Component interface
  export type CustomComponent = lib.CustomComponent;

  // Entity Event Handler interface
  export type EntityEventHandler = lib.EntityEventHandler;

  // Custom Component Metadata interface
  export type CustomComponentMetadata = lib.CustomComponentMetadata;

  // Entity Event Handler Metadata interface
  export type EntityEventHandlerMetadata = lib.EntityEventHandlerMetadata;

  // Entity Event Handler handlers interface
  export type EntityEventHandlers = lib.EntityEventHandlers;

  export type EntityItems = lib.EntityItems;

  export type EntityEvent = lib.EntityEvent;

  export type EntityBaseEvent = lib.EntityBaseEvent;

  export type EntityItemEvents = lib.EntityItemEvents;

  export type EntityValidateEvent = lib.EntityValidateEvent;

  export type EntityPublishMessageEvent = lib.EntityPublishMessageEvent;

  export type EntityMaxPromptsReachedEvent = lib.EntityMaxPromptsReachedEvent;

  export type EntityAttachmentReceivedEvent = lib.EntityAttachmentReceivedEvent

  export type EntityLocationReceivedEvent = lib.EntityLocationReceivedEvent;

  export type EntityItemValidateEvent = lib.EntityItemValidateEvent;

  export type EntityItemPublishPromptMessageEvent = lib.EntityItemPublishPromptMessageEvent

  export type EntityItemPublishDisambiguationMessageEvent = lib.EntityItemPublishDisambiguationMessageEvent

  export type EntityItemMaxPromptsReachedEvent = lib.EntityItemMaxPromptsReachedEvent

}
