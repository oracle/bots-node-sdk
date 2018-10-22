'use strict';

/**
 * Sample express server with custom component services
 */
const express = require('express');
const logger = console;

const defaultPort = 3000;
const port = process.env.PORT || defaultPort;
const serviceUrl = '/components';

/**
 * The custom component service is initialized in service.js
 */
const app = express();
const main = require('./service');
main(app, serviceUrl);

const server = app.listen(port, () => {
  logger.info(`Service online with endpoint '${serviceUrl}' and port ${port}`);
});

module.exports = server;

