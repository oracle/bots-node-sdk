# Writing LLM Transformation Handlers

## Table of contents
- [Introduction](#introduction)
- [LLM Transformation Handler Structure](#structure)
    - [Using Javascript](#js)
    - [Using Typescript](#ts)
- [Writing LLM Transformation Handler Functions](#writing)
- [Supported Events](#events)

## <a name="introduction">Introduction</a> 

Each Large Language Model provider has its own format for its request and response payloads. Oracle Digital Assitant (ODA) uses its own format, the Common LLM Interface, or CLMI, to enable the `invokeLLM` component to work with any LLM while being agnostic of the proprietary request and response payloads of each LLM provider. 
An LLM Transformation Handler (LLMTH) converts CLMI request format used by the `invokeLLM` component to the LLM-specific request body, and after calling the LLM, the LLM-specific response body is converted back to the CLMI response format. 

See the [ODA documentation](https://docs.oracle.com/en/cloud/paas/digital-assistant/index.html) for more information on CLMI and for transformation code samples for popular LLM providers. 

The LLMTH is deployed as part of a component service, and is configured against an LLM service on the skill settings page in the configuration tab.

## <a name="structure">LLM Transformation Handler Structure</a> 

### <a name="js">Using Javascript</a> 

The transformation handler exports two objects: the `metadata` object that provides the name of the component and the `eventHandlerType` (which should be set to `LlmTransformation`), and the `handlers` object that contains the event handler functions.

```javascript
module.exports = {
  metadata: {
    name: 'myLlmTransformationHandler',
    eventHandlerType: 'LlmTransformation'
  },
  handlers: { 

    /**
    * Handler to transform the request payload
    * @param {TransformPayloadEvent} event - event object contains the following properties:
    * - payload: the request payload object
    * @param {LlmTransformationContext} context
    * @returns {object} the transformed request payload
    */
    transformRequestPayload: async (event, context) => { 
      return event.payload;
    },

    /**
    * Handler to transform the response payload
    * @param {TransformPayloadEvent} event - event object contains the following properties:
    * - payload: the response payload object
    * @param {LlmTransformationContext} context
    * @returns {object} the transformed response payload
    */
    transformResponsePayload: async (event, context) => { 
      return event.payload;
    },

    /**
    * Handler to transform the error response payload
    * @param {TransformPayloadEvent} event - event object contains the following properties:
    * - payload: the error response payload object
    * @param {LlmTransformationContext} context
    * @returns {object} the transformed error response payload
    */
    transformErrorResponsePayload: async (event, context) => { 
      return event.payload;
    }
  }
}; 
```

If needed, you can define the `metadata` and `handlers` members as functions rather than as an objects.
### <a name="ts">Using TypeScript</a>
In TypeScript, the event handler class implements the `LlmTransformationHandler` interface. This interface requires both of the following methods:
 
- The `metadata` method that returns an object of type `LlmTransformationHandlerMetadata`.
- The `handlers` method that returns an object of type `LlmTransformationHandlers`.

```typescript
import { LlmTransformationContext, LlmTransformationHandler, LlmTransformationHandlers, LlmTransformationHandlerMetadata, TransformPayloadEvent } from '@oracle/bots-node-sdk/typings/lib2';

export class MyTransformationHandler implements LlmTransformationHandler {

  public metadata(): LlmTransformationHandlerMetadata {
    return { 
      name: 'myLlmTransformationHandler',    
      eventHandlerType: 'LlmTransformation'
    };
  }

  public handlers(): LlmTransformationHandlers {
    return {

      /**
        * Handler to transform the request payload
        * @param {TransformPayloadEvent} event - event object contains the following properties:
        * - payload: the request payload object
        * @param {LlmTransformationContext} context
        * @returns {object} the transformed request payload
        */
      transformRequestPayload: async (event: TransformPayloadEvent, context: LlmTransformationContext): Promise<any> => { 
        return event.payload;
      },

      /**
       * Handler to transform the response payload
        * @param {TransformPayloadEvent} event - event object contains the following properties:
        * - payload: the response payload object
       * @param {LlmTransformationContext} context
       * @returns {object} the transformed response payload
       */
      transformResponsePayload: async (event: TransformPayloadEvent, context: LlmTransformationContext): Promise<any> => { 
        return event.payload;
      },

      /**
       * Handler to transform the error response payload
        * @param {TransformPayloadEvent} event - event object contains the following properties:
        * - payload: the error response payload object
       * @param {LlmTransformationContext} context
       * @returns {object} the transformed error response payload
       */
      transformErrorResponsePayload: async (event: TransformPayloadEvent, context: LlmTransformationContext): Promise<any> => { 
        return event.payload;
      }

    };
  }

} 
```

## <a name="writing">Writing LLM Transformation Handler Functions</a>  

The first argument of each event method is the `event` object. The properties available in this object depend on the type of event.
See the [list of supported entity events](#events) for information on which properties are available with which event.

The second argument of each event method  is the `context` object. This object references the [LlmTransformationContext](https://oracle.github.io/bots-node-sdk/LlmTransformationContext.html) that provides access to convenience methods you can use to create your event handler logic.

<b>TIP</b>: if you are using a JavaScript IDE like Visual Studio Code, you can get code insight and code completion support by defining the types used in the event handlers as follows in your JavaScript handler file:
```javascript
const { LlmTransformationContext, TransformPayloadEvent } = require ('@oracle/bots-node-sdk/typings/lib2');
```
When using TypeScript, you will automatically get code completion support if your IDE supports it.

## <a name="events">Supported Events </a>

The table below lists the event methods that can be implemented:

| Event | Description | Event Properties |
|--|--|--|
| `transformRequestPayload` | A handler that can be used to transform the request body. | <ul><li><b>payload</b>: The request body object.</li></ul>
| `transformResponsePayload` | A handler that can be used to transform the response body. | <ul><li><b>payload</b>: The response body object.</li></ul>
| `transformErrorResponsePayload` | A handler that can be used to transform the response body when the LLM REST service returned an error status (400 or higher). | <ul><li><b>payload</b>: The response body object.</li></ul>

