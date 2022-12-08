/* eslint-disable no-unused-vars */

'use strict';

// Documentation for writing SQL query event handlers: https://github.com/oracle/bots-node-sdk/blob/master/DATA_QUERY_EVENT_HANDLER.md

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
}; 

/* eslint-enable no-unused-vars */


