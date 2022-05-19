/* eslint-disable no-unused-vars */

'use strict';

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
    entity: { 
      /**
      * Default message handler that includes acknowledgements when a bag item is updated
      * or a bag item value is provided while the user was prompted for another item
      * @param {ChangeUISettingsEvent} event
      * @param {DataQueryResolutionContext} context
      */
      changeUISettings: async (event, context) => { 
        return event.settings;
      },

      changeResponseData: async (event, context) => { 
        return context.getQueryResult();
      },

      changeBotMessages: async (event, context) => {
        return event.messages;
      }
    },
    attributes: {
      SomeAttributemName: { // TODO change to a valid attribute name
        // add attribute level event handlers here
      }
      // add more attributes and their handlers here
    },
    custom: {
      // add custom event handlers here
    }
  }
}; 

/* eslint-enable no-unused-vars */


