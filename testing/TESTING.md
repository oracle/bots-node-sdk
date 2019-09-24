# @oracle/bots-node-sdk/testing

This document calls specific attention to test-driven Custom Component development,
with guidance to unit testing a custom component service, and each of its components.

```javascript
const { MockConversation, MockRequest } = require('@oracle/bots-node-sdk/testing');
```

## Testing Custom Components

By design, developers are encouraged to apply their tool chain of choice. The
examples in this reference use [Jasmine (`jasmine`)](https://jasmine.github.io/)
for demonstration of unit tests

In this example, all unit tests _(specs)_ are located within the `./spec`
directory.

### Custom Component Invocation Test

For the sake of demonstration, let's assume a project including a `hello.world`
Custom Component implementation. The invocation of the component demonstrates
a few basic principles for the purposes of different assertions in testing.
Consider the implementation:

```javascript
module.exports = {
  metadata: () => ({
    name: 'hello.world',
    properties: { name: {required: true, type: 'string'}},
    supportedActions: []
  }),
  invoke: (conversation, done) => {
    // read 'hello' variable
    const hi = conversation.variable('hello') || 'Hi';
    // create a response
    conversation.reply(`${hi} ${conversation.properties().name}.`);
    // set a variable
    conversation.variable('greeted', true);
    // transition state
    conversation.transition();
    done();
  }
};
```

The component demonstrates the following:

- Reading a variable from the conversation object
- Create a text response based on input variables/properties
- Set a variable called `greeted`
- Transitioning state

For the purposes of unit testing and mocking both requests and conversations,
the `@oracle/bots-node-sdk/testing` npm package exposes the following key objects:

| Method | Description |
|--|--|
| `MockRequest` | Mocks a request object to be used in component invocation |
| `MockConversation` | Directly extends the class normally constructed for component use, and provides static methods for easy creation in tests. All origianl methods are preserved, and may be used as normal by the component itself. |

> Create `MockRequest` objects with payloads, properties, variables, to be
processed by Custom Components during their `invoke` call. Message payloads can
be provided, and defaults will be applied. These members may be modified in any
unit test. See [Documentation](https://oracle.github.io/bots-node-sdk/testing_component_index.js.html#line37)
for information on the default values

```javascript
/**
 * Create a mock request for component middleware handling.
 * Individual properties and variables may be specified by modifying the result.
 * @function module:Testing.MockRequest
 * @param {*} [messagePayload] - message payload
 * @param {*} [properties] - conversation properties
 * @param {*} [variables] - conversation variables
 * @param {string} [type] - channel type
 */
function MockRequest(messagePayload = {}, properties = {}, variables = {}, type = 'test') {
  // ...
}
```

> Extension of the main `Conversation` class with some additional members
used in tests. Refer to the [SDK documentation](https://oracle.github.io/bots-node-sdk/Conversation.html)
for information on methods and their respective use(s)

```javascript
class MockConversation extends Lib.Conversation {
  /**
   * create a mock conversation with an "empty" valid request.
   * @return Conversation
   */
  static any() {
    return this.fromRequest(MockRequest());
  }
  /**
   * create conversation instance from a request
   * @param {MockRequest} req - the component invocation request body
   * @return Conversation
   */
  static fromRequest(req) {
    return new MockConversation(req);
  }
  /**
   * get conversation reply messages
   * @return - message list returned by the component
   */
  getReplies() {
    return this.response().messages;
  }
}
```

These two facilities are designed to be straightforward for use inside unit tests,
and can be applied to create simple and complex assertions alike.

> Simple example with `MockConversation.any()` (empty) request.

```javascript
const Tester = require("@oracle/bots-node-sdk/testing");
const HelloWorldComponent = require('../components/hello.world');

describe('HelloWorldComponent', () => {
  it('should respond to a simple request', done => {
    const conv = Tester.MockConversation.any();
    HelloWorldComponent.invoke(conv, (err) => {
      expect(err).toBeFalsy();
      expect(conv.getReplies()).toBeDefined();
      expect(conv.getReplies().length).toBeGreaterThan(0);
      done();
    });
  });
});
```

> More comprehensive example with richer request details

```javascript
const Tester = require("@oracle/bots-node-sdk/testing");
const HelloWorldComponent = require('../components/hello.world');

it('should respond to a request with params', done => {
    // create a conversation payload iwth properties and variables
    const properties = { name: 'Unit Tester' };
    const variables = { hello: 'Howdy' };
    const request = Tester.MockRequest(null, properties, variables);
    const conv = Tester.MockConversation.fromRequest(request);

    // stub/watch the variable method
    const varSpy = spyOn(conv, 'variable').and.callThrough();

    // invoke the component
    HelloWorldComponent.invoke(conv, (err) => {
      expect(err).toBeUndefined();
      expect(conv.getReplies()).toBeDefined();
      // check that the spy was called (once as getter, once as setter)
      expect(varSpy).toHaveBeenCalledTimes(2);

      // make assertions on the responses
      const reply = conv.getReplies()[0];
      expect(Reflect.has(reply.messagePayload, 'text')).toBe(true);
      expect(reply.messagePayload.text).toEqual('Howdy Unit Tester.');
      expect(conv.variable('greeted')).toBe(true);

      done();
    });
  });
```

### Event Handler Component Invocation Test

Likewise, we can write unit tests for event handler components.
Let's assume the following simplified event handler for resolving an expense:

```javascript
module.exports = {
  metadata: () => ({
    name: 'resolveExpense',    
    eventHandlerType: 'ResolveEntities'
  }),
  handlers: () => ({ 
    Expense: {
      entity: {
        /**
         * Generic fallback handler that is executed when item-level publishMessage event handler is not defined
         */        
        publishMessage:async (event, context) => {
          context.addCandidateMessages(); 
        }
      },
      items: {
        Amount: {
          /**
           * Validation of a system entity (CURRENCY): the event.newValue contains a JSON object representing the
           * system entity value
           */
          validate:async (event, context) => {
            if (event.newValue.amount < 5) {
              context.addValidationError("Amount",`Amounts below 5 ${event.newValue.currency} cannot be expensed. Enter a higher amount or type 'cancel'.`);
              return false;
            }
          }      
        }
      }
    }
  })     
}; 
```

The two event handlers defined in this component can be tested using the following code:

```javascript
'use strict';

const { ComponentRegistry, ComponentShell } = require("@oracle/bots-node-sdk/lib");
const Tester = require("@oracle/bots-node-sdk/testing");
const ResolveExpenseComponent = require('../components/resolveExpense');

describe('ResolveExpenseComponent', () => {

  // setup shell and expense composite bag variable for different tests
  let registry, shell, variables;
  beforeAll(() => {
    registry = ComponentRegistry.create(ResolveExpenseComponent);
    shell = ComponentShell(null, registry);
    let items = [];
    items.push(Tester.MockCompositeBagItem("Type","ENTITY","ExpenseType"));
    items.push(Tester.MockCompositeBagItem("Amount","ENTITY","CURRENCY"));
    items.push(Tester.MockCompositeBagItem("Date","ENTITY","DATE"));
    variables = {expense: Tester.MockCompositeBagEntityVariable("Expense",items)};
  });

  it('should prompt expense type', done => {
    // set up request with publishMessage event 
    let events = [Tester.MockResolveEntitiesEvent('publishMessage')]
    let req = Tester.MockEventHandlerRequest('expense','Type','Hi','What do you want to expense?', events, variables);
    shell.invokeResolveEntitiesEventHandler('resolveExpense',  req, (err, res) => {
      expect(err).toBeFalsy();
      expect(res.messages).toBeDefined();
      expect(res.messages.length).toBe(1);
      expect(res.messages[0].text).toBe('What do you want to expense?'); 
      expect(res.validationResults).toEqual({});
      expect(res.keepProcessing).toBeFalsy();
      expect(res.cancel).toBeFalsy();
      done();     
    });
  });

  it('should validate expense amount', done => {
    // set up request with validate amount event
    let amount = {entityName: 'CURRENCY',amount: 3, currency: 'dollar', totalCurrency: '3.0 dollar'};
    let events = [Tester.MockResolveEntitiesEvent('validate',false,{newValue: amount},"Amount")]
    let req = Tester.MockEventHandlerRequest('expense','Type','$3','What is expense date?', events, variables);
    shell.invokeResolveEntitiesEventHandler('resolveExpense',  req, (err, res) => {
      expect(err).toBeFalsy();
      expect(res.messages).toBeUndefined();
      expect(res.validationResults).toEqual({"Amount.validate": false});
      expect(res.entityResolutionStatus.validationErrors).toEqual({'Amount': "Amounts below 5 dollar cannot be expensed. Enter a higher amount or type 'cancel'."});
      expect(res.keepProcessing).toBeTrue();
      expect(res.cancel).toBeFalsy();
      done();     
    });
  });

});
```
