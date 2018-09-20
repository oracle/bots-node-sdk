# Oracle Bots Node.js SDK

This SDK is the main developer resource for Oracle Bots integrations
in a Node.js express environment. This package provides two primary solutions for
custom implementations against the [Oracle Bots](https://docs.oracle.com/en/cloud/paas/mobile-autonomous-cloud/use-chatbot/overview1.html)
platform: Running [Custom Component Services](https://docs.oracle.com/en/cloud/paas/mobile-autonomous-cloud/use-chatbot/bot-components.html)
and/or [Webhook Channels](https://docs.oracle.com/en/cloud/paas/mobile-autonomous-cloud/use-chatbot/bot-channels.html).

- [Installation](#installation) - Installation and usage information.
- [Custom Component](#custom-components) - Services to enrich a conversation flow with custom logic, API integrations, messages, and more.
- [Webhook](#webhook) - Integrate with custom messaging channels using incoming/outgoing webhook.<!--[nodoc]-->
- [Documentation](https://oracle.github.io/bots-node-sdk) - Full SDK documentation.
<!--[/nodoc]-->
<!--[nodoc]-->
[![npm version](https://badge.fury.io/js/%40oracle%2Fbots-node-sdk.svg)](https://badge.fury.io/js/%40oracle%2Fbots-node-sdk)
[![wercker status](https://app.wercker.com/status/39bb567cbcdc92b7dcbb3a78f144102d/s/master "wercker status")](https://app.wercker.com/project/byKey/39bb567cbcdc92b7dcbb3a78f144102d)
<!--[/nodoc]-->

---

## Installation

```text
npm install --save @oracle/bots-node-sdk
```

Install this project as a dependency to a Node.js express project.

```javascript
const express = require('express');
const OracleBot = require('@oracle/bots-node-sdk');

const app = express();
OracleBot.init(app);
// implement custom bot services... (see below)
```

### Custom Logging

If verbose logging details are desired, you may configure a logging utility of
your choice, and initialize the SDK accordingly.

```javascript
OracleBot.init(app, {
  logger: console,
});
```

## Custom Components

Each state within a Bot flow calls a component to perform actions ranging
from basic interactions like user input and outputting response text to
some service-specific actions like fulfilling an order or booking a flight.

The platform has many [built-in components](https://docs.oracle.com/en/cloud/paas/mobile-autonomous-cloud/use-chatbot/reference1.html)
to support basic actions like setting variables, allowing OAuth, and enabling
user input. In cases where your bot design calls for unique actions outside of
these functions, you’ll be writing [Custom Components](https://docs.oracle.com/en/cloud/paas/mobile-autonomous-cloud/use-chatbot/bot-components.html).
These allow your bot to call REST APIs, implement business logic, transition
state, customize messages, etc.

This package provides the necessary middleware and libraries for incorporating
Custom Components into your Bot dialog.

- [Custom Component Service](#custom-component-service)
- [Custom Component Code](#custom-component-code)

<!--[nodoc]-->
### QuickStart for Custom Components

[Component Package Starter Example](https://github.com/oracle/bots-node-sdk/blob/master/examples/custom-components/starter)
<!--[/nodoc]-->

### Custom Component Service

The API for exposing custom components to your bot is established using the
middleware included in this package.

Initializing the component middleware includes some basic configurations.
Most important is the `register` option, which specifies component
paths or component objects - telling the service where Custom Component sources
are located within your project.

- `cwd` **string** - Top level directory to which all other paths are relative. `__dirname` is recommended.
- `register` **(string|object(s)|function)[]** - Defines component registry from array of the paths to resolve.
  - String paths may also be directories, which are scanned recursively and added to the registry.
  - Multiple components may also be exported from a single file.

```javascript
const express = require('express');
const OracleBot = require('@oracle/bots-node-sdk');

const app = express();
OracleBot.init(app);

// implement custom component api
OracleBot.Middleware.customComponent(app, {
  baseUrl: '/components',
  cwd: __dirname,
  register: [
    './path/to/a/component',
    './path/to/other/components',
    './path/to/a/directory',
  ]
});
```

### Custom Component Code

Using the `@oracle/bots-node-sdk` for Custom Component development supports a
flexible approach to authoring components. This means that many structures for
the implementation of a Custom Component are possible. Whatever the approach, the
fundamental interface is required as follows:

```javascript
// interface for a custom component implementation
{
  metadata(): {name: string, properties?: {[name:string]: string}, supportedActions?: string[]};
  invoke(conversation: Conversation, done: () => {}): void;
}
```

One supported implementation is to use a simple object with `metadata` and `invoke`
members:

```javascript
// mycomponent.js
module.exports = {
  metadata: () => ({
    name: 'my.custom.component',
    properties: {},
    supportedActions: []
  }),
  invoke: (conversation, done) => {
    conversation.reply('hello').transition();
    done();
  }
}
```

You may also wish to define a component by exporting class(es) and **optionally**
extending the `ComponentAbstract` class for additional convenience members.
**NOTE** Component classes are instantiated as _singletons_.

```javascript
// mycomponent.js
const { ComponentAbstract } = require('@oracle/bots-node-sdk/lib');

module.exports = class MyComponent extends ComponentAbstract {
  metadata() {
    return {
      name: 'my.custom.component',
      properties: {},
      supportedActions: []
    }
  }
  invoke(conversation, done) {
    conversation.reply('hello').transition();
    done();
  }
}
```

## Webhook

The fundamental mechanism for sending and receiving messages with the Bot platform
is through _asynchronous_ inbound and outbound messaging. The platform supports
several **built-in** channels natively, and **webhook** for any other messaging
service or client.

Implementing webhook as a channel can differ greatly across clients. Generally
each client uses a unique message format, and different mechanisms for sending or
receiving messages. This package includes these necessary integration tools.

- [Webhook Client](#webhook-client)
- [Webhook Utils](#webhook-utils)

<!--[nodoc]-->
### QuickStart for Webhook

[Webhook Starter Example](https://github.com/oracle/bots-node-sdk/blob/master/examples/webhook/starter)
<!--[/nodoc]-->

### Webhook Client

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

### Webhook Utilities

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

## Message Formatting

The Oracle Bots platform supports several
[message formats](https://docs.oracle.com/en/cloud/paas/mobile-autonomous-cloud/use-chatbot/bot-channels.html),
as defined by the `MessageModel` class.

The class provides several static methods used to create a stuctured object of a
known Common Message Model message such as Text, Card, Attachment, Location,
Postback or Raw type. It can be used within Custom Components, Webhook, or
independently. In addition, MessageModel can be used in browsers. When used in
browser, include the package `joi-browser`.

```javascript
const { MessageModel } = require('@oracle/bots-node-sdk/lib');
// or
const OracleBot = require('@oracle/bots-node-sdk');
const { MessageModel } = OracleBot.Lib;
```

> **TIP:** Use `conversation.MessageModel()` to access from within a Custom
Component invoke method. Use `webhook.MessageModel()` to access from within a `WebhookClient`
instance.

| Method | Purpose | Usage |
|--|--|--|
| `textConversationMessage` | Basic text | `inbound`, `outbound` |
| `attachmentConversationMessage` | Support media URLs | `inbound`, `outbound` |
| `cardConversationMessage` | Card presentation | `outbound` |
| `postbackConversationMessage` | Submit postback payloads | `inbound` |
| `locationConversationMessage` | Receive location payload | `inbound` |
| `rawConversationMessage` | Freeform payload | `inbound`, `outbound` |

### MessageModel Utilities

Additionally, a set of utilities for MessageModel are provided. `Util.MessageModel`
functions help deriving string or speech representation of a Conversation Message
Model payload. This is used primarily to output text or speech to voice or
text-based channels like Alexa and SMS.

```javascript
const { messageModelUtil } = require('@oracle/bots-node-sdk/util');
// ...
messageModelUtil.convertRespToText(message);
```

## Unit Testing

The SDK also includes unit testing facilities, which can be utilized within
your preferred test runner.

```javascript
const Tester = require('@oracle/bots-node-sdk/testing');
const { MyComponent } = require('../../components/MyComponent');

describe('MyComponent', () => {
  it('should chat', done => {
    const conv = Tester.MockConversation.any();
    new MyComponent().invoke(conv, () => {
      // check replies
      expect(conv.getReplies().length).toBeGreaterThan(0);
      // check transition
      expect(conversation.response().transition).toBe(true);
      // check variables
      expect(conversation.variable('abc')).toEqual('xyz');
      done();
    });
  });
});
```

## Using TypeScript

This package includes `types`, and can therefore be used directly with TypeScript.

```typescript
import { Lib } from '@oracle/bots-node-sdk';

class MyCustomComponent implements Lib.IComponent {
  public metadata(): Lib.IComponentMetadata {
    return { name: 'my.custom.component' }
  }
  public invoke(conversation: Lib.Conversation, done: () => void): void {
    // ...
  }
}
```

<!--[nodoc]-->
## Contributing

`@oracle/bots-node-sdk` is an open source project. See
[CONTRIBUTING](https://github.com/oracle/bots-node-sdk/blob/master/CONTRIBUTING.md) for details.<!--[/nodoc]-->

## License

Copyright © 2018, Oracle and/or its affiliates. All rights reserved.

The Universal Permissive License (UPL), Version 1.0