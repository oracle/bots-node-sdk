# Webhooks

The fundamental mechanism for sending and receiving messages with the Bot platform
is through _asynchronous_ inbound and outbound messaging. The platform supports
several **built-in** channels natively, and **webhook** for any other messaging
service or client.

Implementing webhook as a channel can differ greatly across clients. Generally
each client uses a unique message format, and different mechanisms for sending or
receiving messages. This package includes these necessary integration tools.

<!--[nodoc]-->
## QuickStart for Webhook

- [Webhook Starter Example](https://github.com/oracle/bots-node-sdk/blob/master/examples/webhook/starter)
<!--[/nodoc]-->

## Webhook Client

`WebhookClient` is a flexible library for integrating with webhook channels
configured within your bot. Refer to the documentation and examples to further
understand ways the webhook client may be implemented.

```javascript
const express = require('express');
const OracleBot = require('@oracle/bots-node-sdk');

const app = express();
OracleBot.init(app);

// implement webhook
const { WebhookClient, WebhookEvent } = OracleBot.Middleware;

const channel = {
  url: process.env.BOT_WEBHOOK_URL,
  secret: process.env.BOT_WEBHOOK_SECRET
};
const webhook = new WebhookClient({ channel: channel });
webhook.on(WebhookEvent.ERROR, console.error); // receive errors

// receive bot messages
app.post('/bot/message', webhook.receiver()); // receive bot messages
webhook.on(WebhookEvent.MESSAGE_RECEIVED, message => {
  // format and send to messaging client...
});

// send messages to bot (example)
app.post('/user/message', (req, res) => {
  let message = {/* ... */}; // format according to MessageModel
  webhook.send(message)
    .then(() => res.send('ok'), e => res.status(400).end());
});
```

> **TIP** `send()` supports an _optional_ `channel` as its
second argument, thereby handling request-specific channel determination.

> **TIP** If verbose logging details are desired, you may configure a logging utility of
your choice, and initialize the SDK accordingly:
```javascript
OracleBot.init(app, {
  logger: console,
});
```


## Webhook Utilities

While `WebhookClient` is designed to support the majority of possible integration
types, there may be cases where further control is needed. For this reason, and
to support the full spectrum of integration designs, a series of utilities are
exposed directly for interfacing with the platform's webhook channel.

```javascript
const { webhookUtil } = require('@oracle/bots-node-sdk/util');
// ...
webhookUtil.messageToBotWithProperties(url, secret, userId, messsage, extras, (err, result) => {

});
```