"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Directly expose for simple access
 * @todo - deprecate
 */
__export(require("./component"));
__export(require("./conversation"));
__export(require("./message"));
/**
 * encapsulate core objects in Lib
 */
const component_1 = require("./component");
const conversation_1 = require("./conversation");
const message_1 = require("./message");
/**
 * Main module exposing core classes, decorators, etc.
 *
 * ```javascript
 *  import * as OracleBot from '@oracle/bot-js-sdk';
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
var Lib;
(function (Lib) {
    // @Component decorator
    Lib.Component = component_1.Component;
    // Custom Component abstraction class
    class ComponentAbstract extends component_1.ComponentAbstract {
    }
    Lib.ComponentAbstract = ComponentAbstract;
    // Custom Component registry class
    class ComponentRegistry extends component_1.ComponentRegistry {
    }
    Lib.ComponentRegistry = ComponentRegistry;
    // Component Conversation invocation
    class Conversation extends conversation_1.Conversation {
    }
    Lib.Conversation = Conversation;
    // Conversation Message Model
    class MessageModel extends message_1.MessageModel {
    }
    Lib.MessageModel = MessageModel;
})(Lib = exports.Lib || (exports.Lib = {}));
//# sourceMappingURL=index.js.map