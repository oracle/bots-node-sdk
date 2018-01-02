# Oracle Bots JavaScript SDK

> This README is a work in progress. Please forgive any brevity or lack of cohesiveness.

## About

- [Installation](#installation) - Installation and usage information.
- [Middleware](#middleware) - Configurable Bots express middleware.
- [Utils](#utilities) - Utility functions for interfacing with Bots.
- [Custom Components](#custom-components) - Developing your custom bot components (new vs old).
- [Coverage report](./COVERAGE.md) - Unit testing coverage report.

---

## Installation

```shell
npm install --save @oracle/bots-js-sdk
```

**NOTE** - This project is intended for public [GitHub](https://github.com/oracle/) and
[@oracle/*](https://www.npmjs.com/org/oracle). Therefore npm installation directly from
`git` or artifactory should be removed prior to publishing.

```shell
export ORACLE_ID=my.oracle.username
git config --global url."ssh://${ORACLE_ID}%40oracle.com@alm.oraclecorp.com:2222/".insteadof "alm:"
npm install git+ssh://alm:mcs_intelligent-bots-cloud-service/bots-js-sdk.git
```

## Documentation

SDK documentation `npm run docs && open ./docs/index.html`

## Middleware

Support for various Bot requests is handled by the configurable `Middleware` module within this SDK.

### Component Middleware

Initializing the component middleware includes some basic configurations. Most important
are the `register` (common) and `autocollect` (namespaced) registry properties, which specify component
paths or objects and a filesystem registry path respectively.

- `cwd` *string* - Top level directory to which all other paths are relative. `__dirname` is recommended.
- `register` *(string|object(s)|function)[]* - Define *global* component registry from flexible array of the components to resolve.
  - String paths may also be directories, which are scanned and added to the registry.
  - If used with `autocollect`, all components will be shared with the automated "root registry" derived from `autocollect`.
- `autocollect` *string* - Relative path to a main component directory. This directory is automatically scanned to create a hierarchical registry.
  - Any directories are considered namespaced child registries in the hierarchy called *"collections"*. Collections behave exactly like the top level registry, except they are siloed in the API as `/collection/:collection` and `/collection/:collection/:component`.

> JavaScript Example

```javascript
const OracleBot = require('@oracle/bots-js-sdk');

module.exports = function(app) {
  app.use('/components', OracleBot.Middleware.init({
    component: {
      cwd: __dirname,
      autocollect: './components',
      register: [
        './path/to/a/component',
        './path/to/other/components',
        './path/to/a/directory',
      ]
    }
  }));
};
```

> TypeScript Example

```javascript
import * as express from 'express';
import * as OracleBot from '@oracle/bots-js-sdk';

export = (app: express.Express): void => {
  app.use('/components', OracleBot.Middleware.init({
    component: { // component middleware options
      cwd: __dirname, // working directory of the project runtime (defaults to process.cwd())
      autocollect: './components', // relative directory for components in fs
      register: [ // explicitly provide a global registry
        './path/to/a/component',
        './path/to/other/components',
        './path/to/a/directory',
      ]
    }
  }));
};
```

## Custom Components

Using the `@oracle/bots-js-sdk` for Custom Component development introduces a variety of new
features and requirements, but is **100%** compatible with existing components you may have
already developed with the original SDK.

Because this project uses [TypeScript](https://www.typescriptlang.org/index.html), we encourage,
however **do not require**, strongly-typed component development.

This SDK supports **OPTIONAL** new structures to the definition of any custom component, as well
as full support for using legacy formats. All properties and call signatures are defined, therefore
support typestrong progammability.

> Legacy JavaScript Example `MyCustomComponent.js`

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

> New Example Using JavaScript `MyCustomComponent.js`

Define component by exporting class(es) with the **OPTION** of extending the
`ComponentAbstract` class for additional iVars and methods. **NOTE** Component
classes are instantiated as singletons.

```javascript
const OracleBot = require('@oracle/bots-js-sdk');

module.exports = class MyCustomComponent extends OracleBot.Lib.ComponentAbstract {
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

> New Example Using TypeScript `MyCustomComponent.ts`

```javascript
import * as OracleBot from '@oracle/bots-js-sdk';

// decorator to apply class annotations available through the class.prototype.metadata() method.
@OracleBot.Lib.Component({
  name: 'my.custom.component', // (optional)
  properties: {}, // (optional)
  supportedActions: [] // (optional)
})
export class MyCustomComponent extends OracleBot.Lib.ComponentAbstract { // optionally extend the ComponentAbstract for convenient iVars.
  invoke(conversation: OracleBot.Lib.Conversation, done) {
    conversation.reply('hello').transition();
    done();
  }
}
```

## Utilities

Utility functions are available within the `Util` namespace of the main entrypoint.

```javascript
const Util = require('@oracle/bots-js-sdk').Util;
```

### Webhook

- Utils - `OracleBot.Util.Webhook`
- TODO: Middleware Webhook Gateway

### Message Formatting

- MessageModel - `OracleBot.Lib.MessageModel` create stuctured object of a known Common Message Model message such as Text, Card, Attachment, Location, Postback, Agent or Raw type.
- Utils - `OracleBot.Util.MessageModel` functions to help deriving string or speech representation of a Conversation Message Model payload. This is used primarily to output text or speech to voice and text-based channels like Alexa and SMS.

## Unit Testing Harness

`@oracle/bots-js-sdk` also includes unit testing facilities, which can be utilized within
your preferred test runner.

```javascript
import * as BotTesting from '@oracle/bots-js-sdk/testing';

import { MyComponent } from '../../components/MyComponent';

describe('MyComponent', () => {
  it('should chat', done => {
    const conv = BotTesting.MockConversation.any();
    new MyComponent().invoke(conv, (err) => {
      expect(err).toBeFalsy();
      expect(conv.text()).toBeDefined();
      done();
    });
  });
});
```
