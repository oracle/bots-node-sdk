import * as _Lib from './modules/'; // index
import { Component as _Component } from './modules/'; // decorator

/**
 * SDK 'Lib' exposing core classes, decorators, etc.
 *
 * ```javascript
 *  import * as OracleBot from '@oracle/bots-js-sdk';
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
  export const Component = _Lib.Component;
  export type Component = _Lib.Component;

  // Custom Component abstraction class
  export abstract class ComponentAbstract extends _Lib.ComponentAbstract { }

  // Custom Component registry class
  export class ComponentRegistry extends _Lib.ComponentRegistry { }

  // Legacy Shell (for use by swagger)
  export const ComponentShell = _Lib.ComponentShell;

  // Component Conversation invocation
  export class Conversation extends _Lib.Conversation { }

  // Conversation Message Model
  export class MessageModel extends _Lib.MessageModel { }

}
