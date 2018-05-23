"use strict";
const express = require("express");
const OracleBot = require("../main");
const CONF = require("./spec.config");
const app = express();

// apply parser at the top level
OracleBot.init(app);

// component middleware
app.use(CONF.componentPrefix, OracleBot.Middleware.customComponent({
  cwd: __dirname,
  // autocollect: './testing/components',
  register: [
    './testing/components',
    './testing/more.components/a.component'
  ]
}));
// webhook router middlware
app.use(CONF.webhookRouterUri, OracleBot.Middleware.webhookRouter({
  secret: CONF.webhookSecret,
  callback: (...args) => CONF.stubWebhookReceiverCallback()(...args),
}));
// standalone webhook receiver middleware
app.post(CONF.webhookReceiverUri, OracleBot.Middleware.webhookReceiver(
  CONF.webhookSecretGetter, // this is a function callback for the secret
  (...args) => CONF.stubWebhookReceiverCallback()(...args) // stubbable callback
));
// standalone webhook receiver middleware without secret
app.post(CONF.webhookWithoutSecret, OracleBot.Middleware.webhookReceiver(
  null,
  (...args) => CONF.stubWebhookReceiverCallback()(...args) // stubbable callback
));
// webhook client middleware
app.post(CONF.webhookClientUri, OracleBot.Middleware.webhookClient({},
  (...args) => CONF.stubWebhookClientHandler()(...args)
));

// some things behind the bot MW
app.get('/', (req, res) => {
  res.send(CONF.messages.OK);
});
// to test parser
app.post('/echo', (req, res) => {
  res.json(req.body);
});
// export the http.Server for supertest
const server = app.listen(CONF.port, () => {
  // console.log(`spec server listening on :${CONF.port}`);
});

module.exports = server;