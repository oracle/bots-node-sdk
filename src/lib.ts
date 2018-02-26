import * as lib from './lib/'; // index
import { Component as _Component } from './lib/'; // decorator

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
  export const Component = lib.Component;
  export type Component = lib.Component;

  // Legacy Shell (for use by swagger)
  export const ComponentShell = lib.ComponentShell;

  // Custom Component abstraction class
  export abstract class ComponentAbstract extends lib.ComponentAbstract { }

  // Custom Component registry class
  export class ComponentRegistry extends lib.ComponentRegistry { }

  // Component Conversation invocation
  export class Conversation extends lib.Conversation { }

  // Conversation Message Model
  export class MessageModel extends lib.MessageModel { }

}
