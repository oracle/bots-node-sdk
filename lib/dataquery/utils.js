/**
 * Invoke data query event handlers
 * @param {object} component - component instance
 * @param {DataQueryContext} context - context derived for this invocation
 * @private
 */
async function invokeDataQueryEventHandlers(component, context) {
  let logger = context.logger();
  let handlers = (typeof component.handlers === 'function') ? component.handlers() : component.handlers;  
  for (var event of context.getRequest().events) {
    let eventName = event.name;
    let attributeName = event.attributeName;
    let handler;
    let handlerPath;
    if (attributeName) {
      // retrieve attribute event handler
      handler = handlers.attributes[attributeName][eventName];
      handlerPath = `attributes.${attributeName}.${eventName}`;
    } else {
      // retrieve entity event handler
      handler = handlers.entity[eventName];
      handlerPath = `entity.${eventName}`;
    }
    if (handler) {
      // event handlers can be async (returning a promise), but we dont want to enforce
      // every event handler is async, hence Promise.resolve wrapping of invocation
      if (handlerPath === `attributes.${attributeName}.format`) {
        // we need to invoke format handler for the requested attribute for every row in the result
        // passing in the attributeValue as event property
        for (let row of context.getQueryResult()) {
          // update row with formatted value if attribute is included in the row and has a value
          if (row[attributeName]) {
            event.properties = {'attributeValue': row[attributeName]};
            let returnValue = await Promise.resolve(handler(event.properties, context));
            if (returnValue) {
              row[attributeName] = returnValue
            }
          }
        }  
      } else if (handlerPath === `attributes.${attributeName}.changeUISettings`) {
        // only invoke the handler if the attribute is included in the result
        let metadata = context.getAttributeUISettings(attributeName);
        if (metadata) {
          event.properties = {'settings': metadata};
          let returnValue = await Promise.resolve(handler(event.properties, context));
          if (returnValue) {
            context.setAttributeUISettings(attributeName, returnValue);
          }

        }
      } else if (handlerPath === `entity.changeUISettings`) {
        let settings = context.getUISettings();
        if (settings) {
          event.properties = {'settings': settings};
          let returnValue = await Promise.resolve(handler(event.properties, context));
          if (returnValue) {
            context.setUISettings(returnValue);
          }
        }
      } else if (handlerPath === `entity.changeResponseData`) {
        let data = context.getQueryResult() || [];
        event.properties = {'responseData': data};
        let returnValue = await Promise.resolve(handler(event.properties, context));
        if (returnValue) {
          context.setQueryResult(returnValue);
        }
      } else if (handlerPath === `entity.changeBotMessages`) {
        event.properties = {'messages': context.getRequest().candidateMessages};
        let returnValue = await Promise.resolve(handler(event.properties, context));
        if (returnValue) {
          context.getResponse().messages = returnValue;
        }
      }
    } else {
      logger.error(`No handler found for event: ${handlerPath}`);
      break;
    }              
  } 
}

/**
 * Resolve the event handlers defined by the component
 * @param {object} component - component implementation
 * @private
 */
function getDataQueryEventHandlers(component) {
  let events = [];
  let handlers = (typeof component.handlers === 'function') ? component.handlers() : component.handlers;
  if (handlers) {
    Object.keys(handlers).forEach(key => {
      if (key === 'entity') {
        Object.keys(handlers[key]).forEach(event => {
          events.push(`entity.${event}`);
        });
      }
      if (key === 'attributes') {
        Object.keys(handlers[key]).forEach(itemKey => {
          Object.keys(handlers[key][itemKey]).forEach(event => {
            events.push(`attributes.${itemKey}.${event}`);
          });
        });
      }   
    });    
  }
  return events;
}

module.exports = {
  getDataQueryEventHandlers,
  invokeDataQueryEventHandlers,
};
