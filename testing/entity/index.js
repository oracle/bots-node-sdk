'use strict';

/**
 * Create a Resolve Entities event to include in mock request
 * @function module:Testing.MockResolveEntitiesEvent
 * @param {string} [name] - event name
 * @param {string} [isCustom] - boolean indicating whether this is custom event (defaults to false)
 * @param {object} [properties] - event properties, optional
 * @param {string} [eventItem] - item name  (optional, only required for item-level event)
 */
function MockResolveEntitiesEvent(name, isCustom = false, properties = {}, eventItem) {
  return {name:name, custom:isCustom, properties: properties, eventItem: eventItem};
}
/**
 * Create a composite bag item to include in composite bag entity variable
 * @function module:Testing.MockCompositeBagItem
 * @param {string} [name] - name of the composite bag item
 * @param {string} [type] - type of the composite bag item  (ENTITY, STRING, LOCATION or ATTACHMENT)
 * @param {string} [entityName] - name of the composite bag entity if type is set to ENTITY
 */
function MockCompositeBagItem(name, type, entityName) {
  return {name:name, type: type, entityName: entityName};
}
/**
 * Create a composite bag entity variable to include in mock request
 * @function module:Testing.MockCompositeBagEntityVariable
 * @param {string} [entityName] - name of the composite bag entity
 * @param {array} [items] - list of composite bag items, you can use function MockCompositeBagItem to create each item
 */
function MockCompositeBagEntityVariable(entityName, items) {
  return {type: {name: entityName, type: 'COMPOSITEBAG', compositeBagItems: items}
    ,value: null, entity: true};
}
/**
 * Create a mock request for entity event handler middleware handling.
 * @function module:Testing.MockEventHandlerRequest
 * @param {string} [variableName] - name of composite bag variable to resolve
 * @param {string} [currentItem] - name of current bag item to resolve
 * @param {string} [userMessage] - last user message
 * @param {string} [userMessage] - candidate message that will be shown to user if event handler does not change it
 * @param {array} [events] - list of events to process by event handler. Each event can be created with function MockResolveEntitiesEvent
 * @param {object} [variables] - context variables, the composite bag variable that must be resolved can be created using function MockCompositeBagEntityVariable
 */
function MockEventHandlerRequest(variableName, currentItem, userMessage, candidateMessage, events, variables) {
  function context() {
    return {
      variables: variables,
    };
  }
  function candidateMessages() {
    return [{type: 'text', text: candidateMessage}]
  }
  function entityResolutionStatus() {
    return {
      "updatedEntities": [],
      "outOfOrderMatches": [],
      "customProperties": {},
      "shouldPromptCache": {},
      "validationErrors": {},
      "skippedItems": [],
      "allMatches": [],
      "resolvingField": currentItem,
      "userInput": userMessage,
      "disambiguationValues": {}
    }
  }
  return {
    botId: 'mockbot',
    platformVersion: '1.1',
    context: context(),
    variableName: variableName,
    candidateMessages: candidateMessages(),
    events: events,
    entityResolutionStatus: entityResolutionStatus()
  };
}
module.exports = {
  MockResolveEntitiesEvent,
  MockCompositeBagItem,
  MockCompositeBagEntityVariable,
  MockEventHandlerRequest,
};