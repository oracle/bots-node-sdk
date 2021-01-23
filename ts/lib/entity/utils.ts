import { EntityEventHandler, EntityEventHandlers } from '../component/kinds';
import { EntityResolutionContext } from './entityResolutionContext';

/**
 * Invoke an entity resolution component
 * @param {object} component - component instance
 * @param {EntityResolutionContext} context - context derived for this invocation
 * @private
 */
export async function invokeResolveEntitiesEventHandlers(
  component: EntityEventHandler,
  context: EntityResolutionContext) {
  let logger = context.logger();
  // TODO: can we also support handlers as object instead of function?
  let entityHandlers: EntityEventHandlers = component.handlers();

  for (let event of context.getRequest().events) {
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
      let retValue = returnValue === undefined ? true : (returnValue + '' === 'true')
      logger.debug(`${eventName} returned ${retValue}`);
      if (eventName === 'shouldPrompt') {
        logger.debug(`Adding ${itemName} to shouldPrompt cache with value ${retValue}`);
        context._getShouldPromptCache()[itemName] = retValue;
        if (retValue) {
          // only invoke next shouldPrompt handler when current handler returned false
          break;
        }
      } else if (eventName === 'validate') {
        if (retValue && Object.keys(context.getValidationErrors()).length > 0) {
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
export function getResolveEntitiesEventHandlers(component): string[] {
  let events: string[] = [];
  let handlers = (typeof component.handlers === 'function') ? component.handlers() : component.handlers;
  if (handlers) {
    Object.keys(handlers).forEach(key => {
      if (key === 'entity') {
        Object.keys(handlers[key]).forEach(event => {
          events.push(`entity.${event}`);
        });
      }
      if (key === 'items') {
        Object.keys(handlers[key]).forEach(itemKey => {
          Object.keys(handlers[key][itemKey]).forEach(event => {
            events.push(`items.${itemKey}.${event}`);
          });
        });
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
