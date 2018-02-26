"use strict";

const { CommonProvider } = require("../common/provider");

/**
 * Embedded middleware abstraction layer.
 */
class MiddlewareAbstract {
  constructor(router, options) {
    // setup additional iVars.
    this._logger = CommonProvider.getLogger();
    // init middleware
    try {
      this._init(router, options);
      // this._logger.info(`Initialized`);
    } catch (e) {
      this._logger.error(`Failed to init ${this.constructor.name}`, e);
    }
  }

  /**
   * extend static method. Instantiate the middleware class on the provided router.
   * @param router: express.Router - main namespace router.
   * @param options: any - Channel specific middleware options.
   * @return instantiated class.
   */
  static extend(router, options = {}) {
    const THIS = this; // bypass "Cannot create instance of abstract class error"
    return new THIS(router, options);
  }
}
MiddlewareAbstract.required = false; // all middleware defaults to !required

module.exports = {
  MiddlewareAbstract
};
