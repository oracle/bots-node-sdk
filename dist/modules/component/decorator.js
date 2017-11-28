"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * BotComponent class decorator function. (TypeScript only)
 * Used to source component metadata object.
 * @param annotations Component metadata object.
 */
exports.BotComponent = (annotations = {}) => {
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
                return this.__decoratorMetadata;
            }
            // front door of component instance invokation.
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