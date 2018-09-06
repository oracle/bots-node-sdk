'use strict';

const { CommonProvider } = require("../common/provider");

/**
 * Embedded middleware abstraction layer.
 * @private
 */
class MiddlewareAbstract {
  constructor(service, options) {
    this.options = options;
    // setup additional iVars.
    this._logger = CommonProvider.getLogger();
    this._service = service;
    // init middleware
    try {
      this._init(service, options);
    } catch (e) {
      this._logger.error(`Failed to init ${this.constructor.name}`, e);
      throw e;
    }
  }

  /**
   * static getter for class constructor
   */
  static get ctor() {
    return this;
  }

  /**
   * extend static method. Instantiate the middleware class on the provided router.
   * @param {external:ExpressRouter|external:ExpressApplication} service: express.Router - main namespace router.
   * @param {*} options: any - Channel specific middleware options.
   * @return instantiated class.
   */
  static extend(service, options = {}) {
    return new this.ctor(service, options);
  }
}

module.exports = {
  MiddlewareAbstract,
};
