# Oracle Bots JavaScript SDK

```
npm install git+ssh://alm.oraclecorp.com:2222/mcs_intelligent-bots-cloud-service/bots-js-sdk.git
```

## Documentation

## Middleware

> TypeScript
```javascript
import * as express from 'express';
import * as OracleBot from '@oracle/bot-js-sdk';

export = function(app: express.Express): void {
  app.use(OracleBot.middleware({
    root: __dirname, // root of application source
    component: { // component middleware options
      baseDir: OracleBot.DEFAULT_COMPONENT_DIR // relative directory for components in source
    }
  }));
};
```

> JavaScript 
```javascript
const OracleBot = require('@oracle/bot-js-sdk');

export = function(app) {
  app.use(OracleBot.middleware({
    root: __dirname,
    component: {
      baseDir: OracleBot.DEFAULT_COMPONENT_DIR
    }
  }));
};
```

## Utilities

```javascript

```

### Custom Components
- Registry
- Samples

### Webhook
- Utils
- Middleware

### Message Formatting
- MessageModel
- Utils

## Testing Harness

> TypeScript
```javascript
// const BotTesting = require('@oracle/bot-js-sdk/testing');
import * as BotTesting from '@oracle/bot-js-sdk/testing';

```