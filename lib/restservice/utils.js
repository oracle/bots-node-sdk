/**
 * Invoke rest service event handlers
 * @param {object} component - component instance
 * @param {RestServiceContext} context - context derived for this invocation
 * @private
 */
async function invokeRestServiceEventHandlers(component, context) {
  let logger = context.logger();
  let handlers = (typeof component.handlers === 'function') ? component.handlers() : component.handlers;  

  let event = context.getRequest().event;
  let eventName = event.name;
  let handler = handlers[eventName];

  if (handler) {
    // event handlers can be async (returning a promise), but we dont want to enforce
    // every event handler is async, hence Promise.resolve wrapping of invocation
    if (eventName === `transformRequestPayload`) {
      let payload = context.getRequestPayload();
      event.properties = {'payload': payload};
      logger.debug(`Invoking event handler ${eventName}`);
      let returnValue = await Promise.resolve(handler(event.properties, context));
      if (returnValue) {
        context.setRequestPayload(returnValue);
      }
    } else if (eventName === `transformResponsePayload` || eventName === `transformErrorResponsePayload`) {
      let payload = context.getResponsePayload();
      event.properties = {'payload': payload};
      logger.debug(`Invoking event handler ${eventName}`);
      let returnValue = await Promise.resolve(handler(event.properties, context));
      if (returnValue) {
        context.setResponsePayload(returnValue);
      }
    }
  } else {
    logger.debug(`No handler found for event: ${eventName}`);
  }              
}

/**
 * Resolve the event handlers defined by the component
 * @param {object} component - component implementation
 * @private
 */
function getRestServiceEventHandlers(component) {
  let events = [];
  let handlers = (typeof component.handlers === 'function') ? component.handlers() : component.handlers;
  if (handlers) {
    Object.keys(handlers).forEach(key => {
      events.push(`${key}`);
    });
  }
  return events;
}

module.exports = {
  getRestServiceEventHandlers,
  invokeRestServiceEventHandlers,
};
