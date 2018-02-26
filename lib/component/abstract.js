"use strict";

const { CommonProvider } = require("../../common/provider");
/**
 * Custom component abstract class.
 * @preferred
 * 
 * ```
 * class MyCustomComponent extends ComponentAbstract { ... }
 * ```
 */
class ComponentAbstract {
  constructor() {
    this.logger = CommonProvider.getLogger();
  }
}

module.exports = {
  ComponentAbstract,
};