import * as lib from './lib/'; // index
// import { Component as _Component } from './lib/'; // decorator

/**
 * SDK 'Lib' exposing core classes, decorators, etc.
 *
 * ```javascript
 *  import * as OracleBot from '@oracle/bots-node-sdk';
 *
 *  @OracleBot.Lib.Component({
 *    name: 'my.custom.component',
 *    properties: {},
 *    supportedActions: []
 *  })
 *  export class MyCustomComponent extends OracleBot.Lib.ComponentAbstract {
 *    invoke(conversation: OracleBot.Lib.Conversation, done) {
 *      // ...
 *    }
 *  }
 * ```
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

  // Component Conversation invocation
  export class Conversation extends lib.Conversation { }
  export class CustomComponentContext extends lib.CustomComponentContext { }

  // Entity Resolution invocation
  export class EntityResolutionContext extends lib.EntityResolutionContext { }

  // Conversation Message Model
  export class MessageModel extends lib.MessageModel { }

  // Component Metadata interface
  export type IComponentMetadata = lib.IComponentMetadata;

  // Component interface
  export type IComponent<T extends IComponentMetadata = lib.ICustomComponentMetadata> = lib.IComponent<T>;

}
