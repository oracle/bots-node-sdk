const OracleBot = require('@oracle/bots-node-sdk');

module.exports = function ComponentService(app) {
  const custom = require('./main');
  OracleBot.Middleware.customComponent(app, {
    cwd: custom.cwd || __dirname,
    baseUrl: '{{endpoint}}',
    register: custom.components,
  });
};
