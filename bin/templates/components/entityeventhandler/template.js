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
      */
      publishMessage: async (event, context) => {
        updatedItemsMessage(context);   
        outOfOrderItemsMessage(context);       
        context.addCandidateMessages(); 
      },
      /**
       * This handler is called when the composite bag entity is resolved
       */
      resolved: async (event, context) => { // eslint-disable-line no-unused-vars
        // add your back-end REST API call here
      }
      // add more entity level event handlers here
    },
    items: {
      SomeBagItemName: { // TODO change to a valid bag item name
        // add item level event handlers here
      }
      // add more bag items and their handlers here
    },
    custom: {
      // add custom event handlers here
    }
  }
}; 

/**
 * Helper function to show acknowledgement message when a bag item value is updated.
 */
function updatedItemsMessage(context) {
  if (context.getItemsUpdated().length > 0) {
    let message = "I have updated" + context.getItemsUpdated().map((item, i) => (i !== 0 ? " and the " : " the ") + item.toLowerCase() + " to " + context.getDisplayValue(item));
    context.addMessage(message);
  }
}

/**
 * Helper function to show acknowledgement message when a bag item value is provided when user was prompted for anther bag item.
 */
function outOfOrderItemsMessage(context) {
  if (context.getItemsMatchedOutOfOrder().length > 0) {
    let message = "I got" + context.getItemsMatchedOutOfOrder().map((item, i) => (i !== 0 ? " and the " : " the ") + item.toLowerCase() + " " + context.getDisplayValue(item));
    context.addMessage(message);
  }
}

