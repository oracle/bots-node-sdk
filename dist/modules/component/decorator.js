"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @preferred
 * Component class decorator function. (`TypeScript` only)
 * Used to source component annotations (metadata) object.
 * @param annotations - Component metadata object.
 *
 * ```javascript
 * import * as OracleBot from '@oracle/bot-js-sdk';
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
exports.Component = (annotations = {}) => {
    return (ctor) => {
        // assert annotation component name.
        annotations.name = annotations.name ||
            ctor.prototype.constructor.name.replace(/([a-z-]+)([A-Z])/g, '$1.$2').toLowerCase();
        return class extends ctor {
            constructor() {
                super(...arguments);
                this.__decoratorMetadata = Object.assign({}, annotations);
            }
            // auto-implement the interface methods
            metadata() {
                if (!!super.metadata) {
                    console.warn(`${ctor.prototype.constructor.name} used decorator, but has metadata() defined. Ignoring annotations.`);
                    return super.metadata();
                }
                return this.__decoratorMetadata;
            }
            // front door of component instance invocation.
            invoke(...args) {
                const cb = (args[args.length - 1] || function (err) { throw err; });
                if (!super.invoke) {
                    cb(new Error(`${ctor.prototype.constructor.name} invoke() method was not implemented.`));
                }
                else {
                    try {
                        super.invoke.apply(this, args);
                    }
                    catch (e) {
                        cb(e);
                    }
                }
            }
        };
    };
};
//# sourceMappingURL=decorator.js.map