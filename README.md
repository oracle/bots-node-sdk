# Oracle Bots Node.js SDK

This SDK is intended as the main productivity resource for Oracle Bots development in a Node.js
express environment.

- [Installation](#installation) - Installation and usage information.
- [Middleware](#middleware) - Configurable Bots express middleware.
- [Utils](#utilities) - Utility functions for interfacing with Bots.
- [Custom Components](#custom-components) - Developing your custom bot components.

---

## Installation

```shell
npm install --save @oracle/bots-node-sdk
```

**NOTE** - This project is intended for public [GitHub](https://github.com/oracle/) and
[@oracle/*](https://www.npmjs.com/org/oracle). Therefore npm installation directly from
`git` or artifactory should be removed prior to publishing.

```shell
export no_proxy=".oraclecorp.com"
npm install --save http://artifactory-slc.oraclecorp.com/artifactory/bot-dev-local/@oracle/bots-node-sdk/latest.tgz
```

## Documentation

SDK documentation `npm run docs && open ./docs/index.html`

## Middleware

Support for Bot requests can be handled by the configurable `Middleware` module within this SDK.

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

## Custom Components

Using the `@oracle/bots-node-sdk` for Custom Component development introduces a variety of new
features and requirements, and is **100%** compatible with existing components you may have
already developed with the original SDK.

This SDK supports **OPTIONAL** new structures to the definition of any custom component, as well
as full support for using legacy formats.

```javascript
module.exports = {
  metadata: () => ({
    name: 'my.custom.component',
    properties: {},
    supportedActions: []
  }),
  invoke: (conversation, done) => {
    conversation.reply('hello').tranistion();
    done();
  }
}
```

> Legacy JavaScript Custom Component Example

Define component by exporting class(es) with the **OPTION** of extending the
`ComponentAbstract` class for additional iVars and methods. **NOTE** Component
classes are instantiated as singletons.

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

> Example Using JavaScript Classes

## Utilities

Utility functions are available within the `Util` namespace of the main entrypoint.

```javascript
const { Util } = require('@oracle/bots-node-sdk');
// or
const Util = require('@oracle/bots-node-sdk/util');
```

### Webhook

- `OracleBot.Util.Webhook` methods for webhook channel payload signature and validation.

### Message Formatting

- MessageModel - `OracleBot.Lib.MessageModel` create stuctured object of a known Common Message Model message such as Text, Card, Attachment, Location, Postback, Agent or Raw type.
- MessageModel Utils - `OracleBot.Util.MessageModel` functions to help deriving string or speech representation of a Conversation Message Model payload. This is used primarily to output text or speech to voice and text-based channels like Alexa and SMS.

## Unit Testing Harness

The SDK also includes unit testing facilities, which can be utilized within
your preferred test runner.

```javascript
import * as Tester from '@oracle/bots-node-sdk/testing';

import { MyComponent } from '../../components/MyComponent';

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

## License

Copyright (c) 2016, 2017 Oracle and/or its affiliates The Universal Permissive License (UPL), Version 1.0