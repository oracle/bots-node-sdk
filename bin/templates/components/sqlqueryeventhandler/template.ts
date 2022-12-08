import { DataQueryContext
  , DataQueryEventHandler
  , DataQueryEventHandlers
  , DataQueryEventHandlerMetadata
  , ChangeUISettingsEvent
  , DataQueryUISettings
  , ChangeResponseDataEvent
  , ChangeBotMessagesEvent
  , NonRawMessagePayload
  , ChangeAttributeUISettingsEvent
  , ReadOnlyFieldMetadata
  , FormatAttributeEvent

} from '@oracle/bots-node-sdk/lib';

// Documentation for writing SQL query event handlers: https://github.com/oracle/bots-node-sdk/blob/master/DATA_QUERY_EVENT_HANDLER.md

// You can use your favorite http client package to make REST calls, however, the node fetch API is pre-installed with the bots-node-sdk.
// Documentation can be found at https://www.npmjs.com/package/node-fetch
// Un-comment the next line if you want to make REST calls using node-fetch. 
// import fetch from 'node-fetch';

export class {{className}} implements DataQueryEventHandler {

  public metadata(): DataQueryEventHandlerMetadata {
    return { 
      name: '{{name}}',    
      eventHandlerType: '{{eventHandlerType}}'
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

