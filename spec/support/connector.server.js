const express = require("express");
const OracleBot = require("../main");
const CONF = require("./spec.config");
const app = express();

OracleBot.init(app);

// app.use((req, res, next) => {
//   console.log(req.method, req.url);
//   next();
// });

// endpoint to redirect to alternate post
app.post(CONF.connector.postRedirect, (req, res) => {
  res.redirect(307, `http://${req.headers.host}${CONF.connector.postUrl}`);
});

app.post(CONF.connector.postUrl, (req, res) => {
  // simulate created
  const code = req.headers['x-hub-signature'] ? 202 : 403;
  res.status(code).end();
});

// export the http.Server for supertest
const server = app.listen(CONF.port);

module.exports = server;