export * from './component';
export * from './conversation';
export * from './message';

// /**
//  * encapsulate core objects in Lib
//  */
// import {
//   Component as pComponent,
//   ComponentAbstract as pComponentAbstract,
//   ComponentRegistry as pComponentRegistry
// } from './component';
// import { Conversation as pConv, ComponentShell as pShell } from './conversation';
// import { MessageModel as pMM } from './message';

// /**
//  * Main module exposing core classes, decorators, etc.
//  *
//  * ```javascript
//  *  import * as OracleBot from '@oracle/bots-js-sdk';
//  *
//  *  @OracleBot.Lib.Component({
//  *    name: 'my.custom.component',
//  *    properties: {},
//  *    supportedActions: []
//  *  })
//  *  export class MyCustomComponent extends OracleBot.Lib.ComponentAbstract {
//  *    invoke(conversation: OracleBot.Lib.Conversation, done) {
//  *      // ...
//  *    }
//  *  }
//  * ```
//  */
// export module Lib {

//   // @Component decorator
//   export const Component = pComponent;
//   export type Component = pComponent;

//   // Custom Component abstraction class
//   export abstract class ComponentAbstract extends pComponentAbstract { }

//   // Custom Component registry class
//   export class ComponentRegistry extends pComponentRegistry { }

//   // Legacy Shell (for use by swagger)
//   export const ComponentShell = pShell;

//   // Component Conversation invocation
//   export class Conversation extends pConv { }

//   // Conversation Message Model
//   export class MessageModel extends pMM { }

// }
