/**
 * Directly expose for simple access
 * @todo - deprecate
 */
export * from './component';
export * from './conversation';
export * from './message';
/**
 * encapsulate core objects in Lib
 */
import { Component as pComponent, ComponentAbstract as pComponentAbstract, ComponentRegistry as pComponentRegistry } from './component';
import { Conversation as pConv } from './conversation';
import { MessageModel as pMM } from './message';
/**
 * Main module exposing core classes, decorators, etc.
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
export declare module Lib {
    const Component: (annotations?: pComponent) => Function;
    type Component = pComponent;
    abstract class ComponentAbstract extends pComponentAbstract {
    }
    class ComponentRegistry extends pComponentRegistry {
    }
    class Conversation extends pConv {
    }
    class MessageModel extends pMM {
    }
}
