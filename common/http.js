'use strict';

const fetch = require('node-fetch');

/**
 * Get a new http client instance
 * @see https://www.npmjs.com/package/node-fetch
 * @returns {(url: string, options?: any) => Promise<Response>}
 */
function httpClient() {
  return (url, options) => {
    return fetch(url, options)
      .then((res) => {
        return res.ok ? res : Promise.reject(new Error(`${res.status}: ${res.statusText}`));
      });
  };
}

module.exports = {
  httpClient
};
