'use strict';

module.exports = class ComponentThree {
  metadata() {
    return {
      name: 'test.direct',
    }
  }
  invoke(sdk, done) {
    done();
  }
};
