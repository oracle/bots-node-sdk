const express = require('express');
const service = require('./service');
const pkg = require('./package.json');

const app = express();
service(app);

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`${pkg.name} service online`);
});

module.exports = server;
