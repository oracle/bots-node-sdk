import { RestServiceContext
  , RestServiceEventHandler
  , RestServiceEventHandlers
  , RestServiceEventHandlerMetadata
  , TransformPayloadEvent

} from '@oracle/bots-node-sdk/lib';

// Documentation for writing SQL query event handlers: https://github.com/oracle/bots-node-sdk/blob/master/REST_SERVICE_EVENT_HANDLER.md

// You can use your favorite http client package to make REST calls, however, the node fetch API is pre-installed with the bots-node-sdk.
// Documentation can be found at https://www.npmjs.com/package/node-fetch
// Un-comment the next line if you want to make REST calls using node-fetch. 
// import fetch from 'node-fetch';

export class {{className}} implements RestServiceEventHandler {

  public metadata(): RestServiceEventHandlerMetadata {
    return { 
      name: '{{name}}',    
      eventHandlerType: '{{eventHandlerType}}'
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
