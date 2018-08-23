const express = require('express');
const service = require('./service');
const pkg = require('./package.json');

const logger = console;
const app = express();
service(app);

const server = app.listen(process.env.PORT || 3000, () => {
  logger.info(`${pkg.name} service online\n`);
});

module.exports = server;
