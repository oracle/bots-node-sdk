"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const provider_1 = require("../../common/provider");
/**
 * Custom component abstract class.
 * @preferred
 * @example export class MyCustomComponent extends ComponentAbstract { ... }
 */
class ComponentAbstract {
    constructor() {
        this.logger = provider_1.CommonProvider.getLogger();
    }
    /**
     * convenience getter to access decorator annotations.
     * requires the use of @Component({ ... }) decorator
     */
    get annotations() {
        return this['__decoratorMetadata'];
    }
}
exports.ComponentAbstract = ComponentAbstract;
//# sourceMappingURL=abstract.js.map