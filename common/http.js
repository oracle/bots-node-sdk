'use strict';

const axios = require('axios');

/**
 * Get a new http client instance
 * @param {object} [options] Axios request options
 */
function httpClient(options) {
  const instance = axios.default.create(options);
  // Workaround for https://github.com/axios/axios/issues/1158
  instance.interceptors.request.use(config => (Object.assign({}, config, {
    method: config.method && config.method.toUpperCase()
  })));
  return instance;
}

module.exports = {
  httpClient
};
