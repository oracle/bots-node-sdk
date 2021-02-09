# Webhooks

The fundamental mechanism for sending and receiving messages with the Oracle Digital Assistant platform
is through _asynchronous_ inbound and outbound messaging. The platform supports
several **built-in** channels natively, and supports **webhook** for other messaging
services and clients.

How you implement webhook as a channel differs greatly across clients. Generally,
each client uses a unique message format, and has different mechanisms for sending and
receiving messages. This package includes the necessary integration tools.

<!--[nodoc]-->
## QuickStart for Webhook

[Webhook Starter Example](https://github.com/oracle/bots-node-sdk/blob/master/examples/webhook/starter) contains sample code and instructions.
<!--[/nodoc]-->

## Webhook Client

`WebhookClient` is a flexible library for integrating with webhook channels that are
configured in your Digital Assistant instance. Refer to [Webhooks](https://www.oracle.com/pls/topic/lookup?ctx=en/cloud/paas/digital-assistant&id=DACUA-GUID-96CCA06D-0432-4F20-8CDD-E60161F46680) in *Using Oracle Digital Assistant* and the [Webhook Starter Example](https://github.com/oracle/bots-node-sdk/blob/master/examples/webhook/starter) to further
understand ways you can implement a webhook client.

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

> **TIP** If you want verbose logging details, you can configure a logging utility of
your choice and initialize the SDK accordingly:
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