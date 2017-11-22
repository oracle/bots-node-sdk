/**
 * example of legacy style module.exports = {}
 */
export = {
  metadata() {
    return {
      name: 'legacy.style'
    }
  },

  invoke(sdk, done) {
    sdk.reply('example response');
    done();
  }
};
