# Oracle Bots JavaScript SDK

> This README is a work in progress. Please forgive any brevity or lack of cohesiveness.

## About

- [Middleware](#middleware) - Custom Component express middleware wrapper.
- [Utils](#utilities) - Utility functions for interfacing with Bots.
- [Coverage report](./COVERAGE.md) - Unit testing coverage report.

---

## Installation

**NOTE** This project is intended for public [GitHub](https://github.com/oracle/) and
[@oracle/* npm](https://www.npmjs.com/org/oracle). Therefore npm installation directly from
alm `git` should be replaced by `git submodule` addition in the consuming project(s).

```shell
#export ORACLE_ID=my.oracle.username

npm install git+ssh://${ORACLE_ID}%40oracle.com@alm.oraclecorp.com:2222/mcs_intelligent-bots-cloud-service/bots-js-sdk.git
```

## Test

`npm test`

## Documentation

Generate SDK documentation `npm run docs && open ./docs/index.html`

## Middleware

Support

- auth
- body parser
- custom component

> JavaScript

```javascript
const OracleBot = require('@oracle/bot-js-sdk');

module.exports = function(app) {
  app.use(OracleBot.Middleware.init({
    root: __dirname,
    component: {
      baseDir: 'components'
    }
  }));
};
```

> TypeScript

```javascript
import * as express from 'express';
import * as OracleBot from '@oracle/bot-js-sdk';

export = (app: express.Express): void => {
  app.use(OracleBot.Middleware.init({
    root: __dirname, // root of application source
    component: { // component middleware options
      baseDir: 'components' // relative directory for components in source
    }
  }));
};
```

## Utilities

Utility functions are available within the `Util` namespace of the main entrypoint. 

```javascript
const Util = require('@oracle/bot-js-sdk').Util;
```

### Custom Components

- Registry - Presently automatic through `fs` scanning as part of middleware configuration.
- TODO: Support manual registry for legacy compatibility.
- Developing:

### Webhook

- Utils - `OracleBot.Util.Webhook`
- TODO: Middleware Gateway

### Message Formatting

- MessageModel - `OracleBot.MessageModel`
- Utils = `OracleBot.Util.MessageModel`

## Testing Harness

This package includes conversation unit testing facilities. 

> JavaScript

```javascript
const BotTesting = require('@oracle/bot-js-sdk/testing');
```

> TypeScript

```javascript
import * as BotTesting from '@oracle/bot-js-sdk/testing';

import { MyComponent } from '../../components/MyComponent';

describe('MyComponent', () => {
  it('should chat', done => {
    const conv = BotTesting.MockComponent.Conversation.any();
    new MyComponent().invoke(conv, (err) => {
      expect(err).toBeFalsy();
      expect(conv.text()).toBeDefined();
      done();
    });
  });
});
```
