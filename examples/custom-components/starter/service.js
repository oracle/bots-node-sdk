const OracleBot = require('@oracle/bots-node-sdk');

module.exports = (app) => {
  // initialize the application with OracleBot
  OracleBot.init(app);
  // add custom component service
  app.use('/components', OracleBot.Middleware.customComponent({
    cwd: __dirname,
    register: [ './components' ]
  }));
}