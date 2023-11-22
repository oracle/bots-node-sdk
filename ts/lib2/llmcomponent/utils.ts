import { LlmComponentHandler, LlmComponentHandlers } from './llmComponentTypes';
import { LlmComponentContext } from './llmComponentContext';
/**
 * Invoke llm component handlers
 * @param {LlmComponentHandler} component - component instance
 * @param {LlmComponentContext} context - context derived for this invocation
 * @private
 */
export async function invokeLlmComponentHandlers(component: LlmComponentHandler, context: LlmComponentContext) {
  let logger = context.logger();
  let handlers: LlmComponentHandlers = (typeof component.handlers === 'function') ? component.handlers() :
    component.handlers as LlmComponentHandlers;
  let event = context.getRequest().event;
  let eventName = event.name;
  let handler;
  if (event.custom) {
    // retrieve custom event handler
    handler = handlers.custom[eventName];
  } else {
    handler = handlers[eventName];
  }

  if (handler) {
    // event handlers can be async (returning a promise), but we dont want to enforce
    // every event handler is async, hence Promise.resolve wrapping of invocation
    if (eventName === `validateResponsePayload` || eventName === `validateRequestPayload`) {
      let returnValue = await Promise.resolve(handler(event.properties, context));
      // make sure return value is a boolean
      let retValue = returnValue === undefined ? true : (returnValue + '' === 'true')
      context.getResponse().valid = retValue;
    } else if (eventName === `changeBotMessages` ) {
      // convert json messages to message class
      const mf = context.getMessageFactory();
      let messages = event.properties.messages.map(msg => mf.messageFromJson(msg));
      event.properties.messages = messages;
      let returnValue = await Promise.resolve(handler(event.properties, context));
      // handler should return array of messages
      // if handler doesnt return anything we just use the event messages
      if (returnValue === undefined) {
        returnValue = event.properties.messages;
      }
      // convert messages back to json
      messages = returnValue.map(msg => msg.toJson());
      // there might be other messages added on the handler using context.addMessage
      let currMessages = context.getResponse().messages || [];
      context.getResponse().messages = currMessages.concat(messages);
    } else {
      await Promise.resolve(handler(event.properties, context));
    }
  } else {
    logger.error(`No handler found for event: ${eventName}`);
  }
}

/**
 * Resolve the event handlers defined by the component
 * @param {LlmComponentHandler} component - component implementation
 * @private
 */
export function getLlmComponentHandlers(component: LlmComponentHandler) {
  let events = [];
  let handlers = (typeof component.handlers === 'function') ? component.handlers() : component.handlers;
  if (handlers) {
    Object.keys(handlers).forEach(key => {
      if (key === 'custom') {
        Object.keys(handlers[key]).forEach(event => {
          events.push(`custom.${event}`);
        });
      } else {
        events.push(`${key}`);
      }
    });
  }
  return events;
}
