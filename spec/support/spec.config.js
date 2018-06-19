"use strict";
const webhookSecret = '8e34e25f71aa447e87e065300cf305f0';

module.exports = {
  port: 4111,
  componentPrefix: '/bot',
  // webhookRouterUri: '/webhook',
  webhookReceiverUri: '/webhook/standalone',
  webhookWithoutSecret: '/webhook/nosecret',
  webhookClientUri: '/webhook/client',
  webhookSecret: webhookSecret, // secret as string
  webhookSecretGetter: () => { // secret as cb
    return Promise.resolve(webhookSecret);
  },
  stubWebhookReceiverCallback: () => (req, res) => {
    expect(req.body).toBeDefined();
    res.send();
  },
  stubWebhookClientHandler: () => (req, res, cb) => {
    cb(new Error('stub'));
  },
  parser: {},
  messages: {
    OK: 'OK'
  }
};
