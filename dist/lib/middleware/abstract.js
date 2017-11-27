"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
exports.express = express;
const log4js = require("log4js");
/**
 * Embedded middleware abstraction layer.
 */
class MiddlewareAbstract {
    constructor(_root, router, options) {
        this._root = _root;
        // setup additional iVars.
        this._logger = log4js.getLogger(this.constructor.name);
        // init middleware
        try {
            this._init(router, options);
            this._logger.info(`Initialized`);
        }
        catch (e) {
            this._logger.error(`Failed to init ${this.constructor.name}`, e);
        }
    }
    /**
     * extend static method. Instantiate the middleware class.
     * @param root: string - base application dirname.
     * @param router: express.Router - main namespace router.
     * @param options: any - Channel specific middleware options.
     * @return instantiated class.
     */
    static extend(root, router, options = {}) {
        const THIS = this; // bypass "Cannot create instance of abstract class error"
        return new THIS(root, router, options);
    }
}
exports.MiddlewareAbstract = MiddlewareAbstract;
//# sourceMappingURL=abstract.js.map