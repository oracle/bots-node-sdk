"use strict";

const { CommonProvider } = require("../common/provider");

/**
 * Embedded middleware abstraction layer.
 * @private
 */
class MiddlewareAbstract {
  constructor(layer, options) {
    // setup additional iVars.
    this._logger = CommonProvider.getLogger();
    this.options = options;
    // init middleware
    try {
      this._init(layer, options);
    } catch (e) {
      this._logger.error(`Failed to init ${this.constructor.name}`, e);
    }
  }

  /**
   * extend static method. Instantiate the middleware class on the provided router.
   * @param {external:ExpressRouter|external:ExpressApplication} layer: express.Router - main namespace router.
   * @param {*} options: any - Channel specific middleware options.
   * @return instantiated class.
   */
  static extend(layer, options = {}) {
    const THIS = this; // bypass "Cannot create instance of abstract class error"
    return new THIS(layer, options);
  }
}

module.exports = {
  MiddlewareAbstract
};
