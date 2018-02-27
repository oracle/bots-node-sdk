"use strict";

const { CommonProvider } = require("../../common/provider");
/**
 * Custom component abstract class. Provides basic properites and methods as conveniences 
 * to child classes.
 * @memberof module:Lib
 * @example
 * const { ComponentAbstract } = require('@oracle/bots-node-sdk/lib');
 * 
 * class MyCustomComponent extends ComponentAbstract { ... }
 */
class ComponentAbstract {
  constructor() {
    this.logger = CommonProvider.getLogger();
  }
}

module.exports = {
  ComponentAbstract,
};