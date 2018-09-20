'use strict';
const { WebhookClient } = require('../main').Middleware;
const webhookSecret = '8e34e25f71aa447e87e065300cf305f0';

const stubWebhookChannel = () => () => {
  return Promise.resolve({
    url: 'https://foo/bar',
    secret: webhookSecret,
  });
}

const webhook = new WebhookClient({
  channel: (...args) => stubWebhookChannel()(...args)
});

const CONF = {
  port: 4111,
  noop: () => {},
  componentPrefix: '/bot/components',
  // webhookRouterUri: '/webhook',
  webhookReceiverUri: '/webhook/standalone',
  webhookWithoutSecret: '/webhook/nosecret',
  webhookClientUri: '/webhook/client',
  webhookSecret: webhookSecret, // secret as string
  webhookClient: webhook,
  stubWebhookChannel,
  webhookSecretGetter: () => { // secret as cb
    return Promise.resolve(webhookSecret);
  },
  stubWebhookReceiverCallback: () => (req, res) => {
    expect(req.body).toBeDefined();
    res.send();
  },
  parser: {},
  messages: {
    OK: 'OK'
  },
  connector: {
    postRedirect: '/messages/bounce',
    postUrl: '/messages',
  }
}

module.exports = CONF;
