import { RestServiceEventHandler, RestServiceEventHandlers } from './restServiceTypes';
import { RestServiceContext } from './restServiceContext';
/**
 * Invoke rest service event handlers
 * @param {RestServiceEventHandler} component - component instance
 * @param {RestServiceContext} context - context derived for this invocation
 * @private
 */
export async function invokeRestServiceEventHandlers(component: RestServiceEventHandler, context: RestServiceContext) {
  let logger = context.logger();
  let handlers: RestServiceEventHandlers = component.handlers();

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
 * @param {RestServiceEventHandler} component - component implementation
 * @private
 */
export function getRestServiceEventHandlers(component: RestServiceEventHandler) {
  let events = [];
  let handlers: RestServiceEventHandlers = component.handlers();
  if (handlers) {
    Object.keys(handlers).forEach(key => {
      events.push(`${key}`);
    });
  }
  return events;
}
