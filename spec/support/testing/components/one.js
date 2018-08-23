'use strict';

const { ComponentAbstract } = require("../../../main");

class MyFirstComponent extends ComponentAbstract {
  metadata() {
    return {
      name: 'test.one',
    }
  }
  invoke(sdk, done) {
    this.logger.info('Testing');
    done();
  }
}
exports.MyFirstComponent = MyFirstComponent;