/**
 * Invoke an entity resolution component
 * @param {object} component - component instance
 * @param {EntityResolutionContext} context - context derived for this invocation
 * @private
 */
async function invokeResolveEntitiesEventHandlers(component, context) {
  let logger = context.logger();
  let entityHandlers = (typeof component.handlers === 'function') ? component.handlers() : component.handlers;  
  for (var event of context.getRequest().events) {
    let eventName = event.name;
    let itemName = event.eventItem;
    let handler;
    let handlerPath;
    if (itemName) {
      // retrieve item event handler
      // nested bag items are separated using dot in item name.
      let itemNames = itemName.split('.');
      let handlerObject = entityHandlers.items[itemNames[0]];
      if (itemNames.length > 1) {
        for (let i = 1; i < itemNames.length; i++) {
          handlerObject = handlerObject.items[itemNames[i]];
        }
      }
      handler = handlerObject[eventName];
      handlerPath = `${itemName}.${eventName}`;
      // handlerPath = `${itemName.replace(/\./g,'.items.')}.${eventName}`;
    } else if (event.custom) {
      // retrieve custom event handler
      handler = entityHandlers.custom[eventName];
      handlerPath = `custom.${eventName}`;
    } else {
      // retrieve entity event handler
      handler = entityHandlers.entity[eventName];
      handlerPath = `entity.${eventName}`;
    }
    if (handler) {
      // event handlers can be async (returning a promise), but we dont want to enforce
      // every event handler is async, hence Promise.resolve wrapping of invocation
      let returnValue = await Promise.resolve(handler(event.properties || {}, context));
      // make sure return value is a boolean
      let retValue = returnValue === undefined ? true : (returnValue+''==='true')   
      logger.debug(`${eventName} returned ${retValue}`);
      if (eventName==='shouldPrompt') {        
        context._getShouldPromptCache()[itemName] = retValue;
        if (retValue) {
          // only invoke next shouldPrompt handler when current handler returned false
          break;
        } 
      } else if (eventName==='validate') {
        if (retValue && Object.keys(context.getValidationErrors()).length>0) {
          // if validation error is registered, return value should always be false
          retValue = false;
        }
        context.getResponse().validationResults[handlerPath] = retValue; 
        if (!retValue && !context.getEntityResolutionStatus().editFormMode) {
          // only invoke next validate handler when current handler returned true
          // or we are in edit form mode
          break;
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
function getResolveEntitiesEventHandlers(component) {
  let events = [];
  let handlers = (typeof component.handlers === 'function') ? component.handlers() : component.handlers;
  if (handlers) {
    Object.keys(handlers).forEach(key => {
      if (key === 'entity') {
        Object.keys(handlers[key]).forEach(event => {
          events.push(`entity.${event}`);
        });
      }
      if (key === 'items') {
        // recursive call to get all (nested) item handlers
        getItemEventhandlers(events, '', handlers[key]);
      }   
      if (key === 'custom') {
        Object.keys(handlers[key]).forEach(event => {
          events.push(`custom.${event}`);
        });
      }
    });    
  }
  return events;
}

/**
 * Recursively add item-level event handlers for all (nested) bag items.
 * @param {*} events 
 * @param {*} eventPath 
 * @param {*} itemsNode 
 */
function getItemEventhandlers(events, eventPath, itemsNode) {
  Object.keys(itemsNode).forEach(itemKey => {
    Object.keys(itemsNode[itemKey]).forEach(event => {
      if (event === 'items') {
        // child bag items, make recursive call
        getItemEventhandlers(events, `${eventPath}items.${itemKey}.`, itemsNode[itemKey].items);
      } else {
        events.push(`${eventPath}items.${itemKey}.${event}`);
      }
    });
  });

}

module.exports = {
  getResolveEntitiesEventHandlers,
  invokeResolveEntitiesEventHandlers,
};
