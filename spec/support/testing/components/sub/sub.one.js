'use strict';

const { ComponentAbstract } = require("../../../../main");

class SubComponent extends ComponentAbstract {
  metadata() {
    return {
      name: 'sub.one',
    }
  }
  invoke(sdk, done) {
    this.logger.info('A siloed component!');
    done();
  }
}
exports.SubComponent = SubComponent;
