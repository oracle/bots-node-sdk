const OracleBot = require('@oracle/bots-node-sdk');

module.exports = (app) => {
  app.use('/components', OracleBot.Middleware.customComponent({
    cwd: __dirname,
    register: [ './components' ]
  }))
}