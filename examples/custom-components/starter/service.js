const OracleBot = require('@oracle/bots-node-sdk');

module.exports = (app) => {
  // initialize the application with OracleBot
  OracleBot.init(app);
  // add custom component endpoints
  OracleBot.Middleware.customComponent(app, {
    baseUrl: '/components',
    cwd: __dirname,
    register: [ './components' ]
  });
}