/* eslint-disable no-unused-vars */

'use strict';

// Documentation for writing REST Service query event handlers: https://github.com/oracle/bots-node-sdk/blob/master/REST_SERVICE_EVENT_HANDLER.md

// You can use your favorite http client package to make REST calls, however, the node fetch API is pre-installed with the bots-node-sdk.
// Documentation can be found at https://www.npmjs.com/package/node-fetch
// Un-comment the next line if you want to make REST calls using node-fetch. 
// const fetch = require("node-fetch");

module.exports = {
  metadata: {
    name: '{{name}}',    
    eventHandlerType: '{{eventHandlerType}}'
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

/* eslint-enable no-unused-vars */


