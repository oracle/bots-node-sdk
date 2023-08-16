import { LlmTransformationContext
  , LlmTransformationHandler
  , LlmTransformationHandlers
  , LlmTransformationHandlerMetadata
  , TransformPayloadEvent

} from '@oracle/bots-node-sdk/typings/lib2';

// Documentation for writing LLM Transformation handlers: https://github.com/oracle/bots-node-sdk/blob/master/LLM_TRANSFORMATION_HANDLER.md

// You can use your favorite http client package to make REST calls, however, the node fetch API is pre-installed with the bots-node-sdk.
// Documentation can be found at https://www.npmjs.com/package/node-fetch
// Un-comment the next line if you want to make REST calls using node-fetch. 
// import fetch from 'node-fetch';

export class {{className}} implements LlmTransformationHandler {

  public metadata(): LlmTransformationHandlerMetadata {
    return { 
      name: '{{name}}',    
      eventHandlerType: '{{eventHandlerType}}'
      };
  }

  public handlers(): LlmTransformationHandlers {
    return {

      /**
        * Handler to transform the request payload
        * @param {TransformPayloadEvent} event - event object contains the following properties:
        * - payload: the request payload object
        * @param {LlmTransformationContext} context - rest service context, see https://oracle.github.io/bots-node-sdk/LlmTransformationContext.html
        * @returns {object} the transformed request payload
        */
      transformRequestPayload: async (event: TransformPayloadEvent, context: LlmTransformationContext): Promise<any> => { 
        return event.payload;
      },

      /**
       * Handler to transform the response payload
        * @param {TransformPayloadEvent} event - event object contains the following properties:
        * - payload: the response payload object
       * @param {LlmTransformationContext} context - rest service context, see https://oracle.github.io/bots-node-sdk/LlmTransformationContext.html
       * @returns {object} the transformed response payload
       */
      transformResponsePayload: async (event: TransformPayloadEvent, context: LlmTransformationContext): Promise<any> => { 
        return event.payload;
      },

      /**
       * Handler to transform the error response payload, invoked when HTTP status code is 400 or higher and the error
       * response body received is a JSON object
        * @param {TransformPayloadEvent} event - event object contains the following properties:
        * - payload: the error response payload object
       * @param {LlmTransformationContext} context - rest service context, see https://oracle.github.io/bots-node-sdk/LlmTransformationContext.html
       * @returns {object} the transformed error response payload
       */
      transformErrorResponsePayload: async (event: TransformPayloadEvent, context: LlmTransformationContext): Promise<any> => { 
        return event.payload;
      }
     
    };
  }  
}
