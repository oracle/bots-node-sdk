/**
 * Invoke an entity resolution component
 * @param {object} component - component instance
 * @param {EntityResolutionContext} context - context derived for this invocation
 * @param {*} logger - logging instance to use
 * @private
 */
async function invokeResolveEntitiesEventHandlers(component, context, logger) {
  let entityHandlers = component.handlers()[context.getEntityName()];
  for (var event of context.getRequest().events) {
    let eventName = event.name;
    let itemName = event.eventItem;
    let handler;
    let handlerPath;
    if (itemName) {
      // retrieve item event handler
      handler = entityHandlers.items[itemName][eventName];
      handlerPath = `${itemName}.${eventName}`;
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
      logger.debug(`Invoking event handler ${handlerPath} with event: ${JSON.stringify(event)}`);
      // event handlers can be async (returning a promise), but we dont want to enforce
      // every event handler is async, hence Promise.resolve wrapping of invocation
      let returnValue = await Promise.resolve(handler(event.properties || {}, context));
      // make sure return value is a boolean
      let retValue = returnValue === undefined ? true : (returnValue+''==='true')   
      logger.debug(`${eventName} returned ${retValue}`);
      if (eventName==='shouldPrompt') {        
        logger.debug(`Adding ${itemName} to shouldPrompt cache with value ${retValue}`);
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
        if (!retValue) {
          // only invoke next validate handler when current handler returned true
          break;
        } 
      }
    } else {
      logger.debug(`No handler found for event: ${handlerPath}`);
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
  let handlers = component.handlers();
  if (handlers) {
    Object.keys(handlers).forEach(key => {
      let entObject = handlers[key];
      if (entObject.entity) {
        Object.keys(entObject.entity).forEach(event => {
          events.push(`${key}.entity.${event}`);
        });
      }
      if (entObject.items) {
        Object.keys(entObject.items).forEach(itemKey => {
          Object.keys(entObject.items[itemKey]).forEach(event => {
            events.push(`${key}.items.${itemKey}.${event}`);
          });
        });
      }    
      if (entObject.custom) {
        Object.keys(entObject.custom).forEach(event => {
          events.push(`${key}.custom.${event}`);
        });
      }
    });    
  }
  return events;
}

module.exports = {
  getResolveEntitiesEventHandlers,
  invokeResolveEntitiesEventHandlers,
};
