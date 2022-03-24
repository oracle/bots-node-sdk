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
    - [How to Get a Context Variable Value](#getVar)
    - [How to Get a User or Profile Variable Value](#getProfile)
    - [How to Get a Skill's Custom Parameter Value](#getCustomParam)  
    - [How to Set a Context Variable Value](#setVar)
    - [How to Set a Composite Bag Item Value](#setBagItem)
    - [How to Send Conversation Messages](#messages)
    - [How to Keep Prompting for User Input](#keepPrompting)    

## Introduction <a name="introduction">

Each state within a bot flow calls a component to perform actions ranging
from basic interactions like accepting user input and outputting response text to
service-specific actions like fulfilling an order or booking a flight.

The platform has many [built-in components](https://docs.oracle.com/en/cloud/paas/digital-assistant/use-chatbot/components1.html#GUID-729FF27F-4DDA-41C2-B9CD-09EB3FBBA7A7)
to support basic actions like setting variables, allowing OAuth, and enabling
user input. In cases where your bot design calls for actions outside of
the provided components, such as calling REST APIs, implementing complex business logic, and customizing messages, you can write custom components.

> **Tip:** For additional information about writing and using custom components, see [Backend Integration](https://docs.oracle.com/en/cloud/paas/digital-assistant/use-chatbot/components1.html#GUID-D4DB30EC-D089-4809-A845-31FAAE1794AA) in *Using Oracle Digital Assistant*.

## Custom Component Structure <a name="structure">

### Using Javascript <a name="js">

The custom component must export two objects:
- The `metadata` object, which provides the following component information to the skill:
    - Name of the component
    - Supported properties
    - Supported transition actions
- The `invoke` function, which contains the logic to execute

Here's an example of how to use both objects. Note that the argument (`context`) names the reference to the [CustomComponentContext](https://oracle.github.io/bots-node-sdk/CustomComponentContext.html) object, which provides a context object for reading and changing variables as well as sending back results.

> **Note:** Before version 2.5.1, many code examples named the first argument `conversation`. Either name is valid.

```javascript
module.exports = {

  metadata: {
    name: 'helloWorld',
    properties: {
      human: { required: true, type: 'string' }
    },
    supportedActions: ['weekday', 'weekend']
  },

  invoke: async (context) => {
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
  }
}
```

You also can also define the `metadata` object as a function instead of a JSON object:

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

### Using TypeScript <a name="ts">

When you use TypeScript, the custom component class must implement the `CustomComponent` interface, which requires two methods: 
- The `metadata` method, which returns an object of type `CustomComponentMetadata`. This method provides the following component information to the skill:
    - Name of the component
    - Supported properties
    - Supported transition action
- The `invoke` method, which accepts two arguments:
    - `context` of type `CustomComponentContext`
    - `done` of type `InvocationCallback`

  This method contains the logic to execute.

The following code shows an example of defining the two methods.

```typescript
import {CustomComponent,  CustomComponentMetadata, CustomComponentContext }  from '@oracle/bots-node-sdk/lib';

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

  public async invoke(context: CustomComponentContext): Promise<void> {
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

### The Metadata Object <a name="metadata">

The metadata object can have three properties:

- **name** (required): The name of the custom component. The name can't have spaces and can only contain letters, numbers, underscores, and dots.

- **properties** (optional): The properties that a developer can set when invoking the custom component from the dialog flow. Each property has a name, and the value is a JSON object with two properties: a boolean `required` property and a `type` property. 
<br/><br/>
The allowable values for property type are: `object`, `string`, `boolean`, `int`, `double`, `float`, `long`, `list`, `map`, `stringVariable`, `booleanVariable`, `intVariable`, `doubleVariable`, `floatVariable`, `longVariable`, `mapVariable`, `listVariable`, `nlpresultVariable`, and `entityVariable`.
<br/><br/>
The `required` and `type` properties aren't checked at runtime. In other words, if you don't specify a required component property in the dialog flow or the property value is of the wrong type, the skill will still invoke the custom component. However, when you validate the skill by clicking the **Validate** button, you'll get validation errors whenever a required property is missing or the property value is of the wrong type.

- **supportedActions** (optional): An array of action names that this component might use when calling the `transition(actionName)` function on the custom component `context` object. 
<br/><br/>
The `supportedActions` aren't checked at runtime. If you call the `transition(actionName)` function with an `actionName` argument value that isn't specified in the `supportedActions` property, it will still work. However, we recommend that you specify all the possible transition actions as `supportedActions` to ensure that the skill validator will warn dialog flow developers if a custom component state doesn't include all the transition actions that the component can set.

### The Invoke Method <a name="invoke">

The `invoke` method contains all the logic. In this method you can read and write skill context variables, create conversation messages, set state transitions, make REST calls, and more.

The argument of the `invoke` method is the `context` object. This object references the [CustomComponentContext](https://oracle.github.io/bots-node-sdk/CustomComponentContext.html), which provides access to many convenience methods to create your logic.

More information about creating conversation messages to send to the skill user can be found [here](https://github.com/oracle/bots-node-sdk/blob/master/MESSAGE_MODEL.md).

## Control the Flow with keepTurn and transition <a name="flowControl">

You use different combinations of the [CustomComponentContext](https://oracle.github.io/bots-node-sdk/CustomComponentContext.html) `keepTurn` and `transition` functions to define how the custom component interacts with a user and how the conversation continues after the component returns flow control to the skill.

- `keepTurn(boolean)` specifies whether the conversation should transition to another state without first prompting for user input. Note that if you want to set `keepTurn` to true, you should call `keepTurn` after you call `reply` because `reply` implicitly sets `keepTurn` to false.

- `transition(action)` causes the dialog to transition to the next state after all replies, if any, are sent. The optional `action` argument names the action (outcome) that the component returns.
If you don't call `transition()`, the response is sent but the dialog stays in the state and subsequent user input comes back to this component. That is, `invoke()` is called again.

```javascript
invoke: async (context) => {
   ...
   context.reply(payload);
   context.keepTurn(true);
   context.transition ("success"); 
}
```
Here's a list of typical combinations of `keepTurn()` and `transition()` that you can use depending on the use case:

| Use Case | keepTurn value | Use transition(...) |
|:--|:--|:--|
| Transition to another state without first prompting the user for input. | true | yes
| Wait for user input after control returns to the skill and before the skill transitions to another state. | false | yes
| Wait for user input after control returns to the skill and before the skill returns control to the custom component | false | no

## Access the Backend Using HTTP REST Calls <a name="rest">

You'll find that there are several Node.js libraries that have been built to make HTTP requests easy, and the list changes frequently. You should review the pros and cons of the currently available libraries and decide which one works best for you. We recommend you use a library that supports promises so that you can leverage the `async` version of the `invoke` method, which was introduced in version 2.5.1, and use the `await` keyword to write your REST calls in a synchronous way.
An easy choice might be the [node fetch](https://www.npmjs.com/package/node-fetch) API that is pre-installed with the Bots Node SDK. Use the following statement if you want to make REST calls using node-fetch:

- **JavaScript:**
```javascript
const fetch = require("node-fetch");
```

- **TypeScript:**

```typescript
import fetch from 'node-fetch';
```

The code to make REST calls with `node fetch` looks like this:

```javascript
  // Make a REST GET request
  const response = await fetch('http://some-backend-server-url');
  if (response.status === 200) {        
    const data = await response.json();
    // Store the data in a context variable
    context.setVariable('myContextVar', data);
    context.transition('success');
  } else {
    context.transition('failure');
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

You can call `context.properties()` to get an object that contains all the component properties. For example:

```javascript
module.exports = {

  metadata: {
    name: 'greeting',
    properties: {
      name: { required: true, type: 'string' }
    }
  },

  invoke: async (context) => {
    // Retrieve the value of the 'name' component property.
    const { name } = context.properties() || '';
    context.reply(`Hello ${name}`);
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

### How to Get a Context Variable Value <a name="getVar">

Add a `metadata` property to pass in the name of the context variable, verify that the property was passed in, and then call `context.getVariable(<variable name>)` to retrieve the value. For example:

```javascript
const { latitudeVariable } = context.properties();
if (latitudeVariable) {
  let _latitude = context.getVariable(latitudeVariable); 
  // ...   
} else {
  throw new Error('State is missing latitudeVariable property.');
}
```

### How to Get a User or Profile Variable Value <a name="getProfile">

To get the value of a user or profile variable, you prefix the name of the variable with `profile.` or `user.` as shown here.
```javascript
  let _profileVarValue = context.getVariable('profile.<name>');
  let _userVarValue = context.getVariable('user.<name>');  
```
### How to Get a Skill's Custom Parameter Value <a name="getCustomParam">

On the skill's **Settings** tab, add the custom parameter and provide a value (or set the value in the dialog flow). From the custom component, call `context.getVariable('system.config.<parameter-name>')` to retrieve the value.

### How to Set a Context Variable Value <a name="setVar">

Add a `metadata` property to pass in the name of the variable, and then call `context.setVariable(<variable name>, <value>)` to set the value. For example:

```javascript
invoke async (context) => {
  const listVariableName = context.properties().variableName;
  const fruits = [{"label": "Banana", "value": "banana"}, {"label": "Apple", "value": "apple"}, {"label": "Orange", "value": "orange"}];
  // Write list of fruits to a context variable
  context.setVariable(listVariableName, fruits);
  // Navigate to next state without first prompting for user interaction.
  context.keepTurn(true);
  context.transition();
}
```

For a variable of type entity, such as ADDRESS, you use an object to update the variable and include an `entityName` property that's set to the entity type. For example:

```javascript
if (addressVariable){
  let _AddressObject = {"entityName": 'ADDRESS'
                        , "postcode": _zip
                        , "state": _state };
  context.setVariable(addressVariable, _addressObject);
}
```

### How to Set a Composite Bag Item Value <a name="setBagItem">

In the skill, create a context variable and set its type to the name of the composite bag entity. In the custom component, add metadata properties to pass in the name of the composite bag entity variable and the name of the bag item. Add code to check if the entity variable is null, and set it to an empty object if it is. Create an object for the bag item with the desired values and set the bag item to that object. Update the entity variable and return to the skill.
 
> **Tip**: You can use the intent tester to see the attributes for a complex built-in type.
 
Here's an example of setting the values for a composite bag item:

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

invoke: async (context) => {
  // code to get component property values and validate email goes here
  ...
  // Get composite bag entity object (cbe), create bag item object, update bag item in cbe 
  let cbe = context.getVariable(variableName) || {"entityName": compositeBagEntityName};
  cbe[bagItemName)] = {"entityName": "EMAIL", "email": _email};
  context.setVariable(variableName, cbe);
  context.transition("validEmail");
  context.keepTurn(true);
}
```
> **Tip**: When working with composite bag entities, [entity event handlers](https://github.com/oracle/bots-node-sdk/blob/master/ENTITY_EVENT_HANDLER.md) are easier to use than custom components.

### How to Send Conversation Messages <a name="messages">

You use `context.reply(<payload>)` to send a message to the user. 
You can call this function multiple times to send multiple messages. When you call this function, `keepTurn` is set to false automatically.

The payload can be a string or a rich message object. See [Conversation Messaging](https://github.com/oracle/bots-node-sdk/blob/master/MESSAGE_MODEL.md) for examples of how to create a [text message with buttons actions](https://github.com/oracle/bots-node-sdk/blob/master/MESSAGE_MODEL.md#textMessage), a [card message](https://github.com/oracle/bots-node-sdk/blob/master/MESSAGE_MODEL.md#cardMessage), and an [attachment message](https://github.com/oracle/bots-node-sdk/blob/master/MESSAGE_MODEL.md#attachmentMessage).

### How to Keep Prompting for User Input <a name="keepPrompting">

This code sample keeps showing the user a random quote of the day until the user indicates they want to quit.

```javascript
invoke: async (context) => {

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
}
```
The Quotes.json file that's used in this example looks like this:

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


