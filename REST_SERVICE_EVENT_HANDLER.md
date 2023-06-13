# Writing REST Service Event Handlers

## Table of contents
- [Introduction](#introduction)
- [REST Service Handler Structure](#structure)
    - [Using Javascript](#js)
    - [Using Typescript](#ts)
- [Writing REST Service Handler Functions](#writing)
- [Supported Events](#events)

## Introduction <a name="introduction">

A REST Service Event Handler (RSEH) enables you to transform customize the REST request body before the REST call is made, and to transform the response body after the REST call is made.

The RSEH is deployed as part of a component service. The built-in Call REST component checks whether an event handler is registered
and if so, the component invokes the event handler methods to transform the request and/or response body.

## RESTService Event Handler Structure <a name="structure">

### Using Javascript <a name="js">

A REST service event handler exports two objects: the `metadata` object that provides the name of the component and the `eventHandlerType` (which should be set to `RestService`), and the `handlers` object that contains the event handler functions.

```javascript
module.exports = {
  metadata: {
    name: 'myRestServiceEventHandler',
    eventHandlerType: 'RestService'
  },
  handlers: { 

    /**
    * Handler to transform the request payload
    * @param {TransformPayloadEvent} event
    * @param {RestServiceContext} context
    * @returns {object} the transformed request payload
    */
    transformRequestPayload: async (event, context) => { 
      return event.payload;
    },

    /**
    * Handler to transform the response payload
    * @param {TransformPayloadEvent} event
    * @param {RestServiceContext} context
    * @returns {object} the transformed response payload
    */
    transformResponsePayload: async (event, context) => { 
      return event.payload;
    },

    /**
    * Handler to transform the error response payload
    * @param {TransformPayloadEvent} event
    * @param {RestServiceContext} context
    * @returns {object} the transformed error response payload
    */
    transformErrorResponsePayload: async (event, context) => { 
      return event.payload;
    }
  }
}; 
```

If needed, you can define the `metadata` and `handlers` members as functions rather than as an objects.

### Using TypeScript <a name="ts">

In TypeScript, the event handler class implements the `RestServiceEventHandler` interface. This interface requires both of the following methods:
 
- The `metadata` method that returns an object of type `RestServiceEventHandlerMetadata`.
- The `handlers` method that returns an object of type `RestServiceEventHandlers`.

```typescript
import { RestServiceContext, RestServiceEventHandler, RestServiceEventHandlers, RestServiceEventHandlerMetadata, TransformPayloadEvent } from '@oracle/bots-node-sdk/lib';

export class MyRestServiceEventHandler implements RestServiceEventHandler {

  public metadata(): RestServiceEventHandlerMetadata {
    return { 
      name: 'myRestServiceEventHandler',    
      eventHandlerType: 'RestService'
      };
  }

  public handlers(): RestServiceEventHandlers {
    return {

      /**
        * Handler to transform the request payload
        * @param {TransformPayloadEvent} event
        * @param {RestServiceContext} context
        * @returns {object} the transformed request payload
        */
      transformRequestPayload: async (event: TransformPayloadEvent, context: RestServiceContext): Promise<any> => { 
        return event.payload;
      },

      /**
       * Handler to transform the response payload
       * @param {TransformPayloadEvent} event
       * @param {RestServiceContext} context
       * @returns {object} the transformed response payload
       */
      transformResponsePayload: async (event: TransformPayloadEvent, context: RestServiceContext): Promise<any> => { 
        return event.payload;
      },

      /**
       * Handler to transform the error response payload
       * @param {TransformPayloadEvent} event
       * @param {RestServiceContext} context
       * @returns {object} the transformed error response payload
       */
      transformErrorResponsePayload: async (event: TransformPayloadEvent, context: RestServiceContext): Promise<any> => { 
        return event.payload;
      }

    };
  }

} 
```

## Writing Event Handler Functions  <a name="writing">

The first argument of each event method is the `event` object. The properties available in this object depend on the type of event.
See the [list of supported entity events](#events) for information on which properties are available with which event.

The second argument of each event method  is the `context` object. This object references the [RestServiceContext](https://oracle.github.io/bots-node-sdk/RestServiceContext.html) that provides access to convenience methods you can use to create your event handler logic.

<b>TIP</b>: if you are using a JavaScript IDE like Visual Studio Code, you can get code insight and code completion support by defining the types used in the event handlers as follows in your JavaScript handler file:
```javascript
const { RestServiceContext, RestServiceEventHandler, RestServiceEventHandlers, RestServiceEventHandlerMetadata, TransformPayloadEvent } = require ('@oracle/bots-node-sdk/lib');
```
When using TypeScript, you will automatically get code completion support if your IDE supports it.

## Supported Events <a name="events">

The table below lists the event methods that can be implemented:

| Event | Description | Event Properties |
|--|--|--|
| `transformRequestPayload` | A handler that can be used to transform the REST request body. | <ul><li><b>payload</b>: The request body object.</li></ul>
| `transformResponsePayload` | A handler that can be used to transform the REST response body. | <ul><li><b>payload</b>: The response body object.</li></ul>
| `transformErrorResponsePayload` | A handler that can be used to transform the REST response body when the REST service returned an error status (400 or higher). | <ul><li><b>payload</b>: The response body object.</li></ul>

