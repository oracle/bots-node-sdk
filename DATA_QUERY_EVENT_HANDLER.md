# Writing SQL Query Event Handlers

## Table of contents
- [Introduction](#introduction)
- [SQL Query Handler Structure](#structure)
    - [Using Javascript](#js)
    - [Using TypeScript](#ts)
- [Writing SQL Query Handler Functions](#writing)
- [Supported Events](#events)
    - [Entity Level Events](#entityEvents)
    - [Attribute Level Events](#attributeEvents)
- [Access the Backend Using HTTP REST Calls](#rest)
- [Code Samples](#samples)
    - [How to Set the Query Title](#queryTitle)
    - [How to Change the Response Message Layout](#layout)
    - [How to Add a Footer Text](#footerText)
    - [How to Add a Total Row](#totalRow)
    - [How to Add a Global Follow Up Query Action](#followUpQueryGlobal)
    - [How to Add a Row Level Follow Up Query Action](#followUpQueryRow)
    - [How to Change Attribute Display Settings](#attributeDisplay)
    - [How to Format an Attribute Value](#attributeFormat)

## Introduction <a name="introduction">

An SQL Query Event Handler (SQEH) enables you to customize the SQL Dialogs query results.

The SQEH is deployed as part of a component service. The built-in SQL Dialog component, which receives the queries, identifies a series of events. When one of these events occurs, the component first checks whether a SQEH has been registered to the query's root entity (that is, the first entity that follows FROM in the SQL clause). If so, it then checks if the SQEH has a handler defined for that event. When such a handler exists, the component invokes that event handler method in the SQEH. 

## SQL Query Event Handler Structure <a name="structure">

### Using Javascript <a name="js">

An SQL query event handler exports two objects: the `metadata` object that provides the name of the component and the `eventHandlerType` (which should be set to `DataQuery`), and the `handlers` object that contains the various entity-level and attribute-level event handler functions.

```javascript
module.exports = {
  metadata: {
    name: 'mySqlQueryEventHandler',
    eventHandlerType: 'DataQuery'
  },
  handlers:  {
    entity: { 

     /**
      * Handler to change overall UI settings
      * @param {ChangeUISettingsEvent} event
      * @param {DataQueryContext} context
      * @returns {DataQueryUISettings} the changed UI settings
      */
      changeUISettings: async (event, context) => { 
        return event.settings;
      },

     /**
      * Handler to change the query result data
      * @param {ChangeResponseDataEvent} event
      * @param {DataQueryContext} context
      * @returns {object} the changed query result data
      */
      changeResponseData: async (event, context) => { 
        return context.getQueryResult();
      },

     /**
      * Handler to change the candidate bot messages that will be sent
      * @param {ChangeBotMessagesEvent} event
      * @param {DataQueryContext} context
      * @returns {NonRawMessagePayload[]} the changed bot messages
      */
     changeBotMessages: async (event, context) => {
        return event.messages;
      }

    },
    attributes: {
      SomeAttributemName: { // TODO change to a valid attribute name

        /**
         * Handler to change UI settings for an attribute
         * @param {ChangeAttributeUISettingsEvent} event
         * @param {DataQueryContext} context
         */
        changeUISettings: async (event, context) => {
            return event.settings;
        },

        /**
         * Handler to change the formatting of an attribute value
         * @param {FormatAttributeEvent} event
         * @param {DataQueryContext} context
        * @returns {object} the formatted attribute value
         */
        format: async (event, context) => {
          return event.attributeValue;          
        }
  
      }
      // add more attributes and their handlers here
    }
  }
}
```

If needed, you can define the `metadata` and `handlers` members as functions rather than as an objects.

### Using TypeScript <a name="ts">

In TypeScript, the event handler class implements the `DataQueryEventHandler` interface. This interface requires both of the following methods:
 
- The `metadata` method that returns an object of type `DataQueryEventHandlerMetadata`.
- The `handlers` method that returns an object of type `DataQueryEventHandlers`.

```typescript
import { DataQueryContext, DataQueryEventHandler, DataQueryEventHandlers, DataQueryEventHandlerMetadata, ChangeUISettingsEvent, DataQueryUISettings, ChangeResponseDataEvent, ChangeBotMessagesEvent, NonRawMessagePayload, ChangeAttributeUISettingsEvent, ReadOnlyFieldMetadata, FormatAttributeEvent } from '@oracle/bots-node-sdk/lib';

export class MySqlQueryEventHandler implements DataQueryEventHandler {

  public metadata(): DataQueryEventHandlerMetadata {
    return { 
      name: 'mySqlQueryEventHandler',    
      eventHandlerType: 'DataQuery'
      };
  }

  public handlers(): DataQueryEventHandlers {
    return {
      entity: { 

        /**
         * Handler to change overall UI settings
         * @param {ChangeUISettingsEvent} event
         * @param {DataQueryContext} context
         * @returns {DataQueryUISettings} the changed UI settings
         */
         changeUISettings: async (event: ChangeUISettingsEvent, context: DataQueryContext): Promise<DataQueryUISettings> => { 
           return event.settings;
         },
   
        /**
         * Handler to change the query result data
         * @param {ChangeResponseDataEvent} event
         * @param {DataQueryContext} context
         * @returns {any} the changed query result data
         */
         changeResponseData: async (event: ChangeResponseDataEvent, context: DataQueryContext): Promise<any> => { 
           return context.getQueryResult();
         },
   
        /**
         * Handler to change the candidate bot messages that will be sent
         * @param {ChangeBotMessagesEvent} event
         * @param {DataQueryContext} context
         * @returns {NonRawMessagePayload[]} the changed bot messages
         */
        changeBotMessages: async (event: ChangeBotMessagesEvent, context: DataQueryContext): Promise<NonRawMessagePayload[]> => {
           return event.messages;
         }
   
      },
      attributes: {
         SomeAttributemName: { // TODO change to a valid attribute name
   
           /**
            * Handler to change UI settings for an attribute
            * @param {ChangeAttributeUISettingsEvent} event
            * @param {DataQueryContext} context
            * @returns {ReadOnlyFieldMetadata} the changed attribute UI settings
            */
           changeUISettings: async (event: ChangeAttributeUISettingsEvent, context: DataQueryContext): Promise<ReadOnlyFieldMetadata> => {
               return event.settings;
           },
   
           /**
            * Handler to change the formatting of an attribute value
            * @param {FormatAttributeEvent} event
            * @param {DataQueryContext} context
            * @returns {any} the formatted attribute value
            */
           format: async (event: FormatAttributeEvent, context: DataQueryContext): Promise<any> => {
             return event.attributeValue;          
           }
     
         }
         // add more attributes and their handlers here
       }
    };
  }

} 
```

## Writing Event Handler Functions  <a name="writing">

The first argument of each event method is the `event` object. The properties available in this object depend on the type of event.
See the [list of supported entity events](#events) for information on which properties are available with which event.

The second argument of each event method  is the `context` object. This object references the [DataQueryContext](https://oracle.github.io/bots-node-sdk/DataQueryContext.html) that provides access to many convenience methods used to create your event handler logic.

You can find more information on creating conversation messages from an event handler [here](https://github.com/oracle/bots-node-sdk/blob/master/MESSAGE_FACTORY.md).

<b>TIP</b>: if you are using a JavaScript IDE like Visual Studio Code, you can get code insight and code completion support by defining the types used in the event handlers as follows in your JavaScript handler file:
```javascript
const { DataQueryContext, DataQueryEventHandler, DataQueryEventHandlers, DataQueryEventHandlerMetadata, ChangeUISettingsEvent, DataQueryUISettings, ChangeResponseDataEvent, ChangeBotMessagesEvent, NonRawMessagePayload, ChangeAttributeUISettingsEvent, ReadOnlyFieldMetadata, FormatAttributeEvent } = require ('@oracle/bots-node-sdk/lib');
```
When using TypeScript, you will automatically get code completion support if your IDE supports it.

## Supported Events <a name="events">

### Entity Level Events <a name="entityEvents">
The table below lists all entity level events:

| Event | Description | Event Properties |
|--|--|--|
| `changeUISettings` | A handler that can be used to change overall UI settings. For a list of properties you can change, check the `DataQueryUISettings` interface in [Data Query Types](https://github.com/oracle/bots-node-sdk/blob/master/ts/lib/dataquery/dataQueryTypes.ts). | <ul><li><b>settings</b>: The `DataQueryUISettings` object.</li></ul>
| `changeResponseData` | A handler that can be used to change the query result set. For a list of properties you can change, check the `QueryResult` interface in [Data Query Types](https://github.com/oracle/bots-node-sdk/blob/master/ts/lib/dataquery/dataQueryTypes.ts). | <ul><li><b>responseData</b>: The `QueryResult` object.</li></ul>
| `changeBotMessages` | A handler that can be used to change the candidate bot message(s) that will be sent to the user. See the section on [Conversation Messaging](https://github.com/oracle/bots-node-sdk/blob/master/MESSAGE_FACTORY.md) for more info on adding or changing messages.| <ul><li><b>messages</b>: The list of messages.</li></ul>

### Attribute Level Events <a name="attributeEvents">
The table below lists all attribute level events:

| Event | Description | Event Properties |
|--|--|--|
| `changeUISettings` | A handler that can be used to change overall UI settings. For a list of properties you can change, check the `ReadOnlyFieldMetadata` interface in [Data Query Types](https://github.com/oracle/bots-node-sdk/blob/master/ts/lib/dataquery/dataQueryTypes.ts). | <ul><li><b>settings</b>: The `ReadOnlyFieldMetadata` object.</li></ul>
| `format` | A handler that can be used to change how the attribute value is formatted. | <ul><li><b>attributeValue</b>: The value of the attribute that needs to be formatted.</li></ul>

## Access the Backend Using HTTP REST Calls <a name="rest">

There are several Node.js libraries that make HTTP requests easy. The list of these libraries changes frequently. You should review the pros and cons of the currently available libraries and decide which one works best for you. We recommend you use a library that supports JavaScript Promises so that you can leverage the async nature of the event handler methods to write your REST calls in a synchronous way.
An easy choice might be the [node fetch](https://www.npmjs.com/package/node-fetch) API that is pre-installed with the 'bots-node-sdk'. Use the following statement if you want to make REST calls using node-fetch:

```javascript
const fetch = require("node-fetch");
```

or when using typescript:

```typescript
import * as fetch from 'node-fetch';
```

The code to make REST calls with `node fetch` within an event handler looks like this:

```javascript

  // Make a REST GET request
  const response = await fetch('http://some-backend-server-url');
  if (response.status === 200) {        
    const data = await response.json();
    // Do something with the data...
  } 
```

## Code Samples <a name="samples">

The following samples use a query entity called `Emp`, which has the following attributes:

| Name | Type | 
|--|--|--|
| `empno` | Number 
| `ename` | String 
| `job` | String 
| `hiredate` | Date 
| `mgr` | Number 

All code samples are using TypeScript. If you are using JavaScript, you just need to remove the type definitions included after the `:` in the method signature, the code itself remains the same. 

Note that some of the samples below implement functionality that can also be implemented declaratively in the Query Entity page in the Oracle Digital Assistant user interface. However, the declarative settings apply to all types of queries that have the entity as root entity, which might not always be what you want. Using event handlers, you can add conditional behavior, for example, you can check for group-by queries by inspecting `context.getSQLQuery()`, and always display such queries in table layout, even if the number of rows is below the threshold for switching from form layout to table layout as configured in the Query Entity page.

### How to Set the Query Title<a name="queryTitle">
While we can set a static query title using the `Display Name` on the Query Entity page, we can create a dynamic title using the `changeUISettings` event:

```javascript
entity: {
  changeUISettings: async (event: ChangeUISettingsEvent, context: DataQueryContext): Promise<DataQueryUISettings> => { 
    event.settings.headerText = `I found ${context.getRowCount()} employees`;
    return event.settings;
  }
```

### How to Change the Response Message Layout<a name="layout">
To change the layout of the message that presents the query results, we can use the `changeUISettings` event. In addition to changing the layout, we
might want to change the display settings of the attributes as well. For example, when changing the layout from `tableForm` to `form` we need to update the attributes that would have been displayed in the table section to display in the form.

```javascript
entity: {
  changeUISettings: async (event: ChangeUISettingsEvent, context: DataQueryContext): Promise<DataQueryUISettings> => { 
    event.settings.layout = 'table';
    // make sure all attributes in the query that were displayed in the table, are now displayed in the form
    context.getAttributesUISettings().filter(item => item.displayInTable || true ).forEach(item => { item.displayInForm = true; };             
    return event.settings;
  }
```

### How to Add a Footer Text<a name="footerText">
Here is a code snippet that adds a footer text that displays the execution time of the query. Note that the footerText is also used for the feedback message "Was this answer helpful?" when feedback is enabled, so we need to add our own text before existing footer text.

```javascript
changeBotMessages: async (event: ChangeBotMessagesEvent, context: DataQueryContext): Promise<NonRawMessagePayload[]> => {
  // if Interpretation message is enabled (which is the default), then two messages are returned and we need to change the last one
  // to make the code resilient to the interpretation message enabled flag, we always modify the last message

  // convert message from json to appropriate message type class
  const mf = context.getMessageFactory();
  let message = mf.messageFromJson(event.messages[event.messages.length - 1]);

  let millis = context.getQueryExecutionTime();   
  let minutes = Math.floor(millis / 60000);
  let seconds = ((millis % 60000) / 1000).toFixed(3);
  message.setFooterText(`The query was executed in ${minutes > 0 ? minutes + ' minutes and ' : ''}${seconds} seconds.\n\n${message.footerText}`);

  // convert back to json
  event.messages[event.messages.length - 1] = message.toJson();
  return event.messages;
}
```

### How to Add a Total Row <a name="totalRow">
We can use the `changeResponseData` event to add a total row to the result. In the code example below, we add a total row when the query result contains more than 1 row and there is a `count` attribute present in the result rows.

```javascript
changeResponseData: async (event: ChangeResponseDataEvent, context: DataQueryContext): Promise<any> => { 
  // add total row when query includes count attr and more than 1 row
  if (context.getQueryResult() && context.getQueryResult().length > 1 && context.getQueryResult()[0].hasOwnProperty('count')) {
    const sum = context.getQueryResult().reduce((partialSum: number, row: any) => partialSum + row.count, 0);
    context.getQueryResult().push({'count': sum, 'job': ''});
  }
  return context.getQueryResult();
}
```

### How to Add a Global Follow Up Query Action <a name="followUpQueryGlobal">
We can use the `changeBotMessages` event to add a button action that executes a global follow up query. The `DataQueryContext` contains a convenience method `createQueryAction` that takes care of most of the work. The global action button will be added to the `actions` array of the message.

```javascript
changeBotMessages: async (event: ChangeBotMessagesEvent, context: DataQueryContext): Promise<NonRawMessagePayload[]> => {
  // if Interpretation message is enabled (which is the default), then two messages are returned and we need to change the last one
  // to make the code resilient to the interpretation message enabled flag, we always modify the last message

  // convert message from json to appropriate message type class
  const mf = context.getMessageFactory();
  let message = mf.messageFromJson(event.messages[event.messages.length - 1]);

  if (!context.isFollowUpQuery()) {
    message.addAction(context.createQueryAction('Show Jobs Count', 'SELECT job, COUNT(*) FROM Emp GROUP BY job', 'Jobs Count'));
  }  
  // convert back to json
  event.messages[event.messages.length - 1] = message.toJson();
  return event.messages;
}
```

### How to Add a Row Level Follow Up Query Action <a name="followUpQueryRow">
We can use the `changeBotMessages` event to add a button action that executes a row level follow up query. The `DataQueryContext` contains a convenience method `createFollowUpQueryAction` that takes care of most of the work. The row level action button will be added to the `actions` array within each `form` within the message.

```javascript
// message type imports
const { FormMessage, TableFormMessage } = require('@oracle/bots-node-sdk/typings/lib2');


changeBotMessages: async (event: ChangeBotMessagesEvent, context: DataQueryContext): Promise<NonRawMessagePayload[]> => {
  // if Interpretation message is enabled (which is the default), then two messages are returned and we need to change the last one
  // to make the code resilient to the interpretation message enabled flag, we always modify the last message

  // convert message from json to appropriate message type class
  const mf = context.getMessageFactory();
  let message = mf.messageFromJson(event.messages[event.messages.length - 1]);

  if (!context.isFollowUpQuery()) {
    let forms = null;  
    if (message instanceof FormMessage || message instanceof TableFormMessage) {
      forms = message.getForms();
    }
    if (forms) {
      // Add button to drill down into subordinates of a manager
      for (let i = 0; i < forms.length; i++) {
        let empno = context.getQueryResult()[i].empno;
        let ename = context.getQueryResult()[i].ename;
        let isManager = ['MANAGER','PRESIDENT'].includes(context.getQueryResult()[i].job);
        if (empno && isManager) {
          forms[i].addAction(context.createQueryAction('Subordinates',`SELECT ename, job FROM Emp WHERE mgr = ${empno}`, `Subordinates of ${ename}` ));
        }
      }  
    }  
  }  
  // convert back to json
  event.messages[event.messages.length - 1] = message.toJson();
  return event.messages;
}
```

Because we don't need to cast to the proper message type to get the forms list, the JavaScript version of this example is slightly simpler:
```javascript
changeBotMessages: async (event, context) => {
  // if Interpretation message is enabled (which is the default), then two messages are returned and we need to change the last one
  // to make the code resilient to the interpretation message enabled flag, we always modify the last message

  // convert message from json to appropriate message type class
  const mf = context.getMessageFactory();
  let message = mf.messageFromJson(event.messages[event.messages.length - 1]);

  let forms = message.forms;  
  if (!context.isFollowUpQuery() && forms) {
    // Add button to drill down into subordinates of a manager
    for (let i = 0; i < forms.length; i++) {
      let empno = context.getQueryResult()[i].empno;
      let ename = context.getQueryResult()[i].ename;
      let isManager = ['MANAGER','PRESIDENT'].includes(context.getQueryResult()[i].job);
      if (empno && isManager) {
        forms[i].addAction(context.createQueryAction('Subordinates',`SELECT ename, job FROM Emp WHERE mgr = ${empno}`, `Subordinates of ${ename}` ));
      }
    }  
  }  
  // convert back to json
  event.messages[event.messages.length - 1] = message.toJson();
  return event.messages;
}
```

### How to Change Attribute Display Settings <a name="attributeDisplay">
We can use the attribute level `changeUISettings` event to change the display characteristics of an attribute. For example, we can completely hide it, or change whether the attribute is displayed in form layout or table layout:
```javascript
hiredate: { 
  changeUISettings: async (event: ChangeAttributeUISettingsEvent, context: DataQueryContext): Promise<ReadOnlyFieldMetadata> => {
    if (context.getLayout() === 'tableForm') {
        event.settings.displayInTable = false;
        event.settings.displayInForm = true;  
    }
    return event.settings;
  }
}  
```

### How to Format an Attribute Value <a name="attributeFormat">
We can use the attribute level `format` event to format the attribute value. 
```javascript
hiredate: { 
  format: async (event: FormatAttributeEvent, context: DataQueryContext): Promise<any> => {
    return new Date(event.attributeValue).toDateString();
  }
}  
```

