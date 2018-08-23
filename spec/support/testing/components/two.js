'use strict';

class ComponentTwo {
  metadata() {
    return {
      name: 'test.nonextended',
    }
  }
  invoke(sdk, done) {
    done();
  }
}

class ComponentTwoDuplicate {
  metadata() {
    return {
      name: 'test.nonextended',
    }
  }
  invoke(sdk, done) {
    done();
  }
}

module.exports = {
  ComponentTwo,
  ComponentTwoDuplicate,
};
