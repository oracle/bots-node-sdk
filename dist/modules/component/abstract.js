"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log4js = require("log4js");
/**
 * Custom component abstract class.
 * @preferred
 * @example export class MyCustomComponent extends ComponentAbstract { ... }
 */
class ComponentAbstract {
    constructor() {
        this.logger = log4js.getLogger(this.constructor.name);
    }
    /**
     * convenience getter to access decorator annotations.
     * requires the use of @BotComponent({ ... }) decorator
     */
    get annotations() {
        return this['__decoratorMetadata'];
    }
}
exports.ComponentAbstract = ComponentAbstract;
//# sourceMappingURL=abstract.js.map