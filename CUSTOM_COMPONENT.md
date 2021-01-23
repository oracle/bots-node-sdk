# Writing Custom Components

Each state within a Bot flow calls a component to perform actions ranging
from basic interactions like user input and outputting response text to
some service-specific actions like fulfilling an order or booking a flight.

The platform has many [Built-in Components](https://docs.oracle.com/en/cloud/paas/digital-assistant/use-chatbot/components1.html#GUID-729FF27F-4DDA-41C2-B9CD-09EB3FBBA7A7)
to support basic actions like setting variables, allowing OAuth, and enabling
user input. In cases where your bot design calls for unique actions outside of
these functions, you’ll be writing [Custom Components](https://docs.oracle.com/en/cloud/paas/digital-assistant/use-chatbot/components1.html#GUID-D4DB30EC-D089-4809-A845-31FAAE1794AA).
These allow your bot to call REST APIs, implement business logic, transition
state, customize messages, etc.

## Custom Component Structure

### Using Javascript

A custom component should export two objects, the `metadata` object that provides information like the name of the component, supported properties, and supported transition actions. And the `invoke` function that contains the actual logic that should be executed.

```javascript
module.exports = {

  metadata: {
    name: 'helloWorld',
    properties: {},
    supportedActions: []
  },

  invoke: async (context) => {
    context.reply('hello world');
  }
}
```

You can also define the `metadata` object as a function, rather than a JSON object:

```javascript
module.exports = {

  metadata: () => ({
    name: 'helloWorld',
    properties: {},
    supportedActions: []
  }),

  invoke: async (context) => {
    context.reply('hello world');
  }
}
```
The old style of defining the `invoke` function using the `done` callback argument is still supported:

```javascript
  invoke: (context, done) => {
    context.reply('hello world');
    done();
  }
}
```
We recommend to no longer use the `done`  callback argument. Using the new `async` function definition, you can write asynchronous code in a synchronous way using the `await` keyword.
In addition, you no longer have to remember to call `done()` at every place in your code where the custom component logic is completed.

### Using TypeScript

When using typescript, the custom component class should implement the `CustomComponent` interface which requires two methods to be present: 
- the `metadata` method that should return an object of type `CustomComponentMetadata`.
- the `invoke` method that should accept two arguments, the context of type `CustomComponentContext` and a callback of type `InvocationCallback`.

```typescript
import {CustomComponent,  CustomComponentMetadata, CustomComponentContext, InvocationCallback }  from '@oracle/bots-node-sdk/lib';

export class HelloWorld implements CustomComponent {

  public metadata(): CustomComponentMetadata {
    return {
      name: 'helloWorld',
      properties: {},
      supportedActions: []
    }
  }

  public async invoke(conversation: CustomComponentContext): Promise<void> {
    context.reply('hello world');
  }
}
```

## The Invoke Method

The `invoke` method contains all the business logic. In this method you can read and write skill context variables, create conversation messages, set state transitions, make REST calls and more.

The first argument of the invoke method is the `context` object. This object references the [CustomComponentContext](https://oracle.github.io/bots-node-sdk/CustomComponentContext.html) that provides access to many convenience methods to create your business logic.

More information on creating conversation messages that your bot should send to the user can be found [here](https://github.com/oracle/bots-node-sdk/blob/master/MESSAGE_MODEL.md).

You can use your favorite http client package to make REST calls, however, the [node fetch](https://www.npmjs.com/package/node-fetch) API is pre-installed with the bots-node-sdk. Use the following statement if you want to make REST calls using node-fetch:

```javascript
const fetch = require("node-fetch");
```

or when using typescript:

```typescript
import * as fetch from 'node-fetch';
```



