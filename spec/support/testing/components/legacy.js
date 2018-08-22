'use strict';
module.exports = {
  metadata: () => ({
    name: 'legacy.style'
  }),
  invoke(sdk, done) {
    sdk.reply('example response');
    done();
  }
};
