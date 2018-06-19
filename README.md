# Oracle Bots Node.js SDK

This SDK is intended as the main productivity resource for Oracle Bots development
in a Node.js express environment. This package provides two primary solutions for
custom implementations against the [Oracle Bots](https://docs.oracle.com/en/cloud/paas/mobile-autonomous-cloud/use-chatbot/overview1.html)
platform: Running [Custom Component Services](https://docs.oracle.com/en/cloud/paas/mobile-autonomous-cloud/use-chatbot/bot-components.html#GUID-A93D7DAB-DCCE-42CD-8E6B-A06FB9BEE90D)
and/or [Webhook Channels](https://docs.oracle.com/en/cloud/paas/mobile-autonomous-cloud/use-chatbot/bot-channels.html#GUID-96CCA06D-0432-4F20-8CDD-E60161F46680).

- [Installation](#installation) - Installation and usage information.
- [Custom Component](#custom-components) - Services to enrich a conversation flow with custom logic, API integrations, messages, and more.
- [Webhook](#webhook) - Integrate with custom messaging channels using incoming/outgoing webhook.

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
```

## Custom Components

Using the `@oracle/bots-node-sdk` for Custom Component development introduces some
new features, and is **100%** compatible with existing components you may have
already developed with the original SDK.

This SDK supports two structures for the definition of a custom component, one
of which is the traditional object export.

```javascript
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

> Custom Component example as Object

You may also define a component by exporting class(es) with the **OPTION** of
extending the `ComponentAbstract` class for additional iVars and methods.
**NOTE** Component classes are instantiated as _singletons_.

```javascript
const { ComponentAbstract } = require('@oracle/bots-node-sdk/lib');

module.exports = class MyCustomComponent extends ComponentAbstract {
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

> Custom Component example as JavaScript class

## Middleware

Support for various Bot requests can be handled by the configurable `Middleware`
module within this SDK.

- [Custom Component Middleware](#component-middleware) for integrating your data into bot flows.
- [Webhook Middleware](#webhook-middleware) for adding custom message handling via the webhook channel.

### Component Middleware

Initializing the component middleware includes some basic configurations. Most important
is the `register` middleware property, which specifies component
paths or objects and a filesystem registry path respectively.

- `cwd` *string* - Top level directory to which all other paths are relative. `__dirname` is recommended.
- `register` *(string|object(s)|function)[]* - Define *global* component registry from flexible array of the components to resolve.
  - String paths may also be directories, which are scanned and added to the registry.

```javascript
const express = require('express');
const OracleBot = require('@oracle/bots-node-sdk');

const app = express();
app.use('/components', OracleBot.Middleware.customComponent({
  cwd: __dirname,
  register: [
    './path/to/a/component',
    './path/to/other/components',
    './path/to/a/directory',
  ]
}));
```

### Webhook Middleware

The SDK also provides express middleware for Oracle Bots webhook channels. The
middleware is designed to act as a "receiver" for messages from the platform
webhook channel.

```javascript
const OracleBot = require('@oracle/bots-node-sdk');
const express = require('express');
const app = express();
OracleBot.init(app); // must be applied upstream of the receiver for proper parsing.

const { WebhookClient, WebhookEvent } = OracleBot.Middleware;

const channel = { // also supports callback (req => ({url: string, secret: string}) | Promise<{url: string, secret: string}>)
  url: process.env.BOT_WEBHOOK_URL,
  secret: process.env.BOT_WEBHOOK_SECRET
};
const webhook = new WebhookClient({ channel: channel });
webhook.on(WebhookEvent.ERROR, console.error);

// receive bot messages
app.post('/bot/message', webhook.receiver((req, res, next) => {
  const message = req.body;
  // Format & forward verified message to client.
  res.send();
}));

// OR use events and forego callback (res is sent automatically)
app.post('/bot/message', webhook.receiver());
webhook.on(WebhookEvent.MESSAGE_RECEIVED, message => {
  // ...
});

// also integrate with other webhooks
app.post('/user/message', (req, res) => {
  let message = {};
  // assign userId, messagePayload, etc and send.
  webhook.send(message, channel) // returns promise
    .then(() => res.send('ok'), e => res.status(400).send()));
});
```

> **NOTE** `WebhookClient.send` supports an optional channel configuration as its
second argument, thereby supporting request specific channel determination.

## Utilities

Utility functions are available within the `Util` namespace of the main entrypoint.

```javascript
const { Util } = require('@oracle/bots-node-sdk');
// or
const Util = require('@oracle/bots-node-sdk/util');
```

### Webhook Util

- `OracleBot.Util.Webhook` contains methods for webhook channel api, signature creation, and validation.

### Message Formatting

- MessageModel - `OracleBot.Lib.MessageModel` create stuctured object of a known Common Message Model message such as Text, Card, Attachment, Location, Postback, Agent or Raw type.  When using the Custom Components SDK, MessagModel is available via the SDK MessageModel() call. It can also be used outside of SDK.  In addition, MessageModel can also be used in browser.  When used in browser, include the package joi-browser.
- MessageModel Utils - `OracleBot.Util.MessageModel` functions to help deriving string or speech representation of a Conversation Message Model payload. This is used primarily to output text or speech to voice and text-based channels like Alexa and SMS.

```javascript
const { MessageModel } = require('@oracle/bots-node-sdk/lib');
// or
const OracleBot = require('@oracle/bots-node-sdk');
const { MessageModel } = OracleBot.Lib;
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
    new MyComponent().invoke(conv, (err) => {
      expect(err).toBeFalsy();
      expect(conv.getReplies().length).toBeGreaterThan(0);
      done();
    });
  });
});
```

## Using TypeScript

This package includes `types`, and can therefore be used directly with TypeScript.

```typescript
import { Lib } from '@oracle/bots-node-sdk';

class MyCustomComponent implements Lib.IComponentInterface {
  public metadata(): Lib.IComponentMetadata {
    return { name: 'my.custom.component' }
  }
  public invoke(conversation: Lib.Conversation, done: () => void): void {
    // ...
  }
}
```

## License

Copyright (c) 2017, 2018 Oracle and/or its affiliates The Universal Permissive
License (UPL), Version 1.0