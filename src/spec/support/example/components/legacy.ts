/**
 * example of legacy style module.exports = {}
 */
export = {
  metadata: () => ({
    name: 'legacy.style'
  }),

  invoke(sdk, done) {
    sdk.reply('example response');
    done();
  }
};
