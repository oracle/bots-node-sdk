# Writing Custom Components

## Table of contents
- [Introduction](#introduction)
- [Custom Component Structure](#structure)
    - [Using Javascript](#js)
    - [Using Typescript](#ts)
    - [The Metadata Object](#metadata)
    - [The Invoke Method](#invoke)
- [Control the Flow with keepTurn and transition](#flowControl)    
- [Access the Backend Using HTTP REST Calls](#rest)
- [Code Samples](#samples)
    - [How to Get a Component Property Value](#propertyValue)
    - [How to Get a Variable Value](#getVar)
    - [How to Set a Variable Value](#setVar)
    - [How to Send Rich Conversation Messages](#messages)
    - [How to Get a Skill's Custom Parameter Value](#getCustomParam)  
    - [How to Set a Composite Bag Item Value](#setBagItem)
    - [How to Keep Prompting for User Input](#keepPrompting)    

## Introduction <a name="introduction">

Each state within a Bot flow calls a component to perform actions ranging
from basic interactions like user input and outputting response text to
some service-specific actions like fulfilling an order or booking a flight.

The platform has many [Built-in Components](https://docs.oracle.com/en/cloud/paas/digital-assistant/use-chatbot/components1.html#GUID-729FF27F-4DDA-41C2-B9CD-09EB3FBBA7A7)
to support basic actions like setting variables, allowing OAuth, and enabling
user input. In cases where your bot design calls for unique actions outside of
these functions, you’ll be writing [Custom Components](https://docs.oracle.com/en/cloud/paas/digital-assistant/use-chatbot/components1.html#GUID-D4DB30EC-D089-4809-A845-31FAAE1794AA).
These allow your bot to call REST APIs, implement business logic, transition
state, customize messages, etc.

## Custom Component Structure <a name="structure">

### Using Javascript <a name="js">

A custom component should export two objects, the `metadata` object that provides information like the name of the component, supported properties, and supported transition actions. And the `invoke` function that contains the actual logic that should be executed.

```javascript
module.exports = {

  metadata: {
    name: 'helloWorld',
    properties: {
      human: { required: true, type: 'string' }
    },
    supportedActions: ['weekday', 'weekend']
  },

  invoke: (context, done) => {
    // Retrieve the value of the 'human' component property.
    const { human } = context.properties();
    // determine date
    const now = new Date();
    const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' });
    const isWeekend = [0, 6].indexOf(now.getDay()) > -1;
    // Send two messages, and transition based on the day of the week
    context.reply(`Greetings ${human}`)
      .reply(`Today is ${now.toLocaleDateString()}, a ${dayOfWeek}`)
      .transition(isWeekend ? 'weekend' : 'weekday'); 
    done();  
  }
}
```

You can also define the `metadata` object as a function, rather than a JSON object:

```javascript
module.exports = {

  metadata: () => ({
    name: 'helloWorld',
    properties: {
      human: { required: true, type: 'string' }
    },
    supportedActions: ['weekday', 'weekend']
  }),

  ...
}
```
If you are using `bots-node-sdk` version 2.5.1 or higher, and deploying to an external container, or deploying to the embedded container of platform version 21.02 or higher, you can start using the new syntax of the `invoke` method, with the `async` keyword, and without the second `done` argument:

```javascript
  invoke: async (context) => {
    ...
    context.reply('hello world');
  }
}
```
Using the new `async` function definition, you can write asynchronous code in a synchronous way using the `await` keyword.
In addition, you no longer have to remember to call `done()` at every place in your code where the custom component logic is completed.

### Using TypeScript <a name="ts">

When using typescript, the custom component class should implement the `CustomComponent` interface which requires two methods to be present: 
- the `metadata` method that should return an object of type `CustomComponentMetadata`.
- the `invoke` method that accepts two argument, the `context` of type `CustomComponentContext`, and `done` of type `InvocationCallback`.

```typescript
import {CustomComponent,  CustomComponentMetadata, CustomComponentContext, InvocationCallback }  from '@oracle/bots-node-sdk/lib';

export class HelloWorld implements CustomComponent {

  public metadata(): CustomComponentMetadata {
    return {
      name: 'helloWorld',
      properties: {
        human: { required: true, type: 'string' }
      },
      supportedActions: ['weekday', 'weekend']
    }
  }

  public invoke(context: CustomComponentContext, done: InvocationCallback): void {
    // Retrieve the value of the 'human' component property.
    const { human } = context.properties();
    // determine date
    const now = new Date();
    const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' });
    const isWeekend = [0, 6].indexOf(now.getDay()) > -1;
    // Send two messages, and transition based on the day of the week
    context.reply(`Greetings ${human}`)
      .reply(`Today is ${now.toLocaleDateString()}, a ${dayOfWeek}`)
      .transition(isWeekend ? 'weekend' : 'weekday'); 
    done();  
  }
}
```
If you are using `bots-node-sdk` version 2.5.1 or higher, and deploying to an external container, or deploying to the embedded container of platform version 21.02 or higher, you can start using the new syntax of the `invoke` method, with the `async` keyword, and without the second `done` argument:

```typescript
  public async invoke(context: CustomComponentContext): Promise<void> {
    context.reply('hello world');
  }
}
```
Using the new `async` function definition, you can write asynchronous code in a synchronous way using the `await` keyword.
In addition, you no longer have to remember to call `done()` at every place in your code where the custom component logic is completed.

### The Metadata Object <a name="metadata">

The metadata object can have three properties:

- **name** (required): the name of the custom component. The name cannot have spaces and can only contain letters, numbers, underscores or dots.

- **properties** (optional): the properties a developer can set when including the custom component in the dialog flow YAML file. Each property has a name and the value is a JSON object with two properties: a boolean `required` property, and a `type` property. 
<br/><br/>
The allowable values for property type are: `object`, `string`, `boolean`, `int`, `double`, `float`, `long`, `list`, `map`, `stringVariable`, `booleanVariable`, `intVariable`, `doubleVariable`, `floatVariable`, `longVariable`, `mapVariable`, `listVariable`, `nlpresultVariable`, `entityVariable`.
<br/><br/>
The `required` and `type` properties are not checked at runtime, in other words, if you do not specify a required component property in the YAML dialog flow, or the property value is of the wrong type, the custom component would still be invoked. However, when you validate the skill by clicking the `Validate` button, you will get validation errors when a required property is missing or the property value is of the wrong type.

- **supportedActions** (optional): array of action names this component might use when calling the `transition(actionName)` function on the custom component `context` object. 
<br/><br/>
The `supportedActions` are not checked at runtime, if you call the `transition(actionName)` function with an `actionName` argument value that is not specified in the `supportedActions` property, it will still work. However, we do recommend to specify all the transition actions as `supportedActions` because the skill validator will warn you when you forget to include a transition action in the YAML dialog flow that might be set by the custom component.

### The Invoke Method <a name="invoke">

The `invoke` method contains all the business logic. In this method you can read and write skill context variables, create conversation messages, set state transitions, make REST calls and more.

The first argument of the invoke method is the `context` object. This object references the [CustomComponentContext](https://oracle.github.io/bots-node-sdk/CustomComponentContext.html) that provides access to many convenience methods to create your business logic.

More information on creating conversation messages that your bot should send to the user can be found [here](https://github.com/oracle/bots-node-sdk/blob/master/MESSAGE_MODEL.md).

## Control the Flow with keepTurn and transition <a name="flowControl">

You use different combinations of the [CustomComponentContext](https://oracle.github.io/bots-node-sdk/CustomComponentContext.html) `keepTurn` and `transition` functions, to define how the custom component interacts with a user and how the conversation continues after the component returns flow control to the skill.

- `keepTurn(boolean)` specifies whether the conversation should transition to another state without first prompting for user input. Note that if you want to set `keepTurn` to true, you should call `keepTurn` after you call `reply` because `reply` implicitly sets `keepTurn` to false.

- `transition(action)` causes the dialog to transition to the next state after all replies, if any, are sent. The optional `action` argument names that action (outcome) that the component returns.
If you don't call `transition()`, the response is sent but the dialog stays in the state and subsequent user input comes back to this component. That is, `invoke()` is called again.

```javascript
invoke: (context, done) => {
   ...
   context.reply(payload);
   context.keepTurn(true);
   context.transition ("success"); 
   done();
}
```
Here is a list of typical combinations of `keepTurn()` and `transition()` you will use depending on the use case:

| Use Case | keepTurn value | Use transition(...) |
|--|--|--|
| Transition to another state without first prompting the user for input. | true | yes
| Wait for user input after control returns to the skill and before the skill transitions to another state. | false | yes
| Wait for user input after control returns to the skill and before the skill returns control to the custom component | false | no

## Access the Backend Using HTTP REST Calls <a name="rest">

You'll find that there are several Node.js libraries that have been built to make HTTP requests easy, and the list changes frequently. You should review the pros and cons of the currently available libraries and decide which one works best for you. We recommend you use a library that supports promises so you can leverage the new `async` version of the `invoke` method and use the `await` keyword to write your REST calls in a synchronous way.
An easy choice might be the [node fetch](https://www.npmjs.com/package/node-fetch) API that is pre-installed with the bots-node-sdk. Use the following statement if you want to make REST calls using node-fetch:

```javascript
const fetch = require("node-fetch");
```

or when using typescript:

```typescript
import * as fetch from 'node-fetch';
```

The code to make REST calls with `node fetch` looks like this:

```javascript
  // Make a REST GET request
  fetch('http://some-backend-server-url')
  .then((response) => {
    return response.json();    
  })
  .then((data) => {
    const data = await response.json();
    // Store the data in a context variable
    context.variable('myContextVar',data);
    done();
  })
  .catch((err) => {
    done(err);
  });

  // Make a REST POST request
  let payload = ...
  fetch('http://some-backend-server-url',{ method: 'POST', body: payload})
  .then((response) => {
    if (response.status === 200) {        
      context.transition('success');
    } else {
      context.transition('failure');
    }
    done();
  })
  .catch((err) => {
    done(err);
  });
```

When your are able to use the new `async invoke` syntax, you can write your code in a synchronous way without callbacks, or `promise-then` constructs:

```javascript
  // Make a REST GET request
  const response = await fetch('http://some-backend-server-url');
  if (response.status === 200) {        
    const data = await response.json();
    // Store the data in a context variable
    context.variable('myContextVar',data);
  } 

  // Make a REST POST request
  let payload = ...
  const response = await fetch('http://some-backend-server-url',{ method: 'POST', body: payload});
  if (response.status === 200) {        
    context.transition('success');
  } else {
    context.transition('failure');
  }
```

## Code Samples <a name="samples">

### How to Get a Component Property Value <a name="propertyValue">

You can call `context.properties()` to get an object that contains all the component properties.

```javascript
module.exports = {

  metadata: {
    name: 'greeting',
    properties: {
      name: { required: true, type: 'string' }
    }
  },

  invoke: (context, done) => {
    // Retrieve the value of the 'name' component property.
    const { name } = context.properties() || '';
    context.reply(`Hello ${name}`);
    done();
  }
}
```
Instead of
```javascript
    const { name } = context.properties() || '';
```
you can also write
```javascript
    const name = context.properties().name || '';
```
or
```javascript
    const name = context.properties()['name'] || '';
```

### How to Get the Value of a Variable <a name="getVar">

Add a `metadata` property to pass in the name of the context variable, verify that the property was passed in, and then call `context.variable(<variable name>)` to retrieve the value.

```javascript
const { latitudeVariable } = context.properties();
if (latitudeVariable) {
  let _latitude = context.variable(latitudeVariable); 
  // ...   
  done();
} else {
  done(new Error('State is missing latitudeVariable property.'));
}
```

To get the value of a profile variable, you prefix the name of the variable with `profile.`.
```javascript
  let _profileVarValue = context.variable('profile.<name>'); 
```

### How to Set a Variable Value <a name="setVar">

Add a `metadata` property to pass in the name of the variable, and then call `context.variable(<variable name>, <value>)` to set the value. For example:

```javascript
invoke (context, done) => {
  const listVariableName = context.properties().variableName;
  const fruits = [{"label": "Banana", "value": "banana"}, {"label": "Apple", "value": "apple"}, {"label": "Orange", "value": "orange"}];
  // Write list of fruits to a context variable
  context.variable(listVariableName, fruits);
  // Navigate to next state without first prompting for user interaction.
  context.keepTurn(true);
  context.transition();
  done();
}
```

Use an object to update a variable that's an entity type, such as ADDRESS, and include an `entityName` property that's set to the entity type.

```javascript
if (addressVariable){
  let _AddressObject = {"entityName": 'ADDRESS'
                        , "postcode": _zip
                        , "state": _state };
  context.variable(addressVariable, _addressObject);
}
```

### How to Send Rich Conversation Messages <a name="messages">

As you have seen in the previous examples, you can use `context.reply(<payload>)` to create a bot message that is sent to the user. 
You can call this function multiple times to send multiple messages. When you call this function, `keepTurn` is set to false automatically.
The payload can be a string, or a rich message object. See the section on [Conversation Messaging](https://github.com/oracle/bots-node-sdk/blob/master/MESSAGE_MODEL.md) for code samples on how to create a [text message with buttons actions](https://github.com/oracle/bots-node-sdk/blob/master/MESSAGE_MODEL.md#cardMessage), a [card message](https://github.com/oracle/bots-node-sdk/blob/master/MESSAGE_MODEL.md#cardMessage), and an [attachment message](https://github.com/oracle/bots-node-sdk/blob/master/MESSAGE_MODEL.md#attachmentMessage).

### How to Get a Skill's Custom Parameter Value <a name="getCustomParam">

On the skill's **Settings** tab, add the custom parameter and provide a value (or set the value in the dialog flow). From the custom component, call `context.variable(system.config.<parameter-name>')` to retrieve the value.

### How to Set a Composite Bag Item Value <a name="setBagItem">

In the skill, create a context variable and set its type to the name of the Composite Bag entity. In the custom component, add metadata properties to pass in the name of the Composite Bag entity variable and the name of the bag item. Add code to check if the entity variable is null, and set it to and empty object if it is. Create an object for the bag item with the desired values and set the bag item to that object. Update the entity variable and return to the skill.
<br/><br/>
**Tip**: You can use the intent tester to see the attributes for a complex built-in type.
<br/><br/>
Here's an example:

```javascript
metadata: {
  name: 'sample.SetEmailBagItem',
  properties: {
    compositeBagEntityName: { required: true, type: 'string' },
    variableName: { required: true, type: 'string' },
    bagItemName: { required: true, type: 'string' },
    email: { required: true, type: 'int' },
  },
  supportedActions: ["validEmail", "invalidEmail"]
},

invoke: (context, done) => {
  // code to get component property values and validate email goes here
  ...
  // Get composite bag entity object (cbe), create bag item object, update bag item in cbe 
  let cbe = context.variable(variableName) || {"entityName": compositeBagEntityName};
  cbe[bagItemName)] = {"entityName": "EMAIL", "email": _email};
  context.variable(variableName, cbe);
  context.transition("validEmail");
  context.keepTurn(true);
  done();
}
```
**Tip**: It is easier to use [entity event handlers](https://github.com/oracle/bots-node-sdk/blob/master/ENTITY_EVENT_HANDLER.md) instead of custom components when working with composite bag entities.

### How to Keep Prompting for User Input <a name="keepPrompting">

This code sample keeps showing the user a random quote of the day, until the user indicates he wants to quit.

```javascript
invoke: (context, done) => {

  const quotes = require("./json/Quotes.json");
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  
  // Check if postback action is issued and postback is from this component rendering. 
  // This ensures that the component only responds to its own postback actions.     
  if (context.postback() && context.postback()['system.state'] === context.getRequest().state && context.postback().isNo) {
    context.keepTurn(true);
    context.transition();
  } else {
    // Show the quote of the day.
    context.reply(`'${quote.quote}'`);
    context.reply(`Quote by: ${quote.origin}`);
    // Create a single message with two buttons to request another quote or not.
    let actions = [];
    const messageModel= context.getMessageModel();
    actions.push(messageModel.postbackActionObject("Yes", null, { isNo: false}));
    actions.push(messageModel.postbackActionObject("No", null, { isNo: true}));
    let buttonMessage = messageModel.textConversationMessage("Do you want another quote?", actions);
    context.reply(buttonMessage);
    // Although reply() automatically sets keepTurn to false, it's good practice to explicitly set it so that it's
    // easier to see how you intend the component to behave.
    context.keepTurn(false);
  }
  done();
}
```
The Quotes.json used in this example looks like this:

```javascript
[
	{
		"quote": "The man who moves a mountain begins by carrying away small stones.",
		"origin": "Confucius"
	},
	{
		"quote": "If you always do what you’ve always done, you’ll always get what you’ve always got.",
		"origin": "Henry Ford"
  },
  ...
]  
```


