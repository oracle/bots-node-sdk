import { BaseContext } from '../component/baseContext';
import EventHandlerRequestSchemaFactory = require('./schema/eventHandlerRequestSchema');
import { MessagePayload, NonRawMessagePayload } from '../message';

// Response template
const RESPONSE = {
  context: undefined,
  error: false,
  validationResults: {},
  keepProcessing: true,
  cancel: false,
  modifyContext: false
};

export interface EntityMap {
  entityName?: string
  [name: string]: any;
}

export interface CompositeBagItem {
  sequenceNr: number
  name: string;
  type: string;
  entityName?: string;
  description?: string;
}

export interface EntityResolutionStatus {
  name?: string;
  resolvingField?: string;
  validationErrors?: { [name: string]: string | Error };
  skippedItems?: string[];
  updatedEntities?: CompositeBagItem[];
  outOfOrderMatches?: CompositeBagItem[];
  allMatches?: CompositeBagItem[];
  disambiguationValues: { [name: string]: any[] };
  userInput?: string;
  enumValues: object[],
  useFullEntityMatches: true;
  customProperties: { [name: string]: any };
  shouldPromptCache: any;
  nextRangeStart?: number;
  previousRangeStart?: number;
  rangeSize?: number
  needShowMoreButton?: boolean;
  needShowPreviousButton?: boolean;
  promptCount?: number;
  prompt?: string;
}

export interface SystemEntityDisplayProperty {
  properties: string[];
  function?: (...args: string[]) => string;
}

/**
 * The Bots EntityResolutionContext is a class for querying, validating and changing a composite bag entity and its
 * entity resolution status.
 * </p>
 * An EntityResolutionContext class instance is passed as an argument to every event handler function.
 * @memberof module:Lib
 */
export class EntityResolutionContext extends BaseContext {
  private readonly _entityStatus: EntityResolutionStatus;
  private _entity: EntityMap;
  private _systemEntityDisplayProperties: {[key: string]: SystemEntityDisplayProperty};

  /**
   * Constructor of entity resolution context.
   * DO NOT USE - INSTANCE IS ALREADY PASSED TO EVENT HANDLERS
   * @param {object} request
   */
  constructor(request: any) {
    // Initilize the response
    const response = Object.assign({}, RESPONSE, {
      entityResolutionStatus: request.entityResolutionStatus,
    });
    super(request, response, EventHandlerRequestSchemaFactory);
    this._entityStatus = response.entityResolutionStatus;
    this._entity = this.getVariable(request.variableName);
    // Initialize display properties
    this._initSystemEntityDisplayProperties();
  }

  /**
   * Returns the value of the composite bag entity currently being resolved
   * @return {object} The JSON object holding the composite bag item values
   */
  getEntity(): EntityMap {
    return this._entity;
  }


  /**
   * Sets the value of the composite bag entity currently being resolved
   * @param {object} newEntity - The JSON object holding the composite bag item values
   */
  setEntity(newEntity: EntityMap): void {
    this._entity = newEntity;
    delete this._entityStatus.resolvingField;
    this.setVariable(this.getRequest().variableName, this._entity);
    this._clearShouldPromptCache();
  }

  /**
   * Returns the name of the composite bag entity type currently being resolved
   * @return {string} name of the composite bag entity type
   */
  getEntityName(): string {
    const varName = this.getRequest().variableName;
    const context = this.getRequest().context;
    let variable;
    // if it is a dialog 2.0 skill-scoped variable, we need to get the variable def from the parent scope
    if (varName.startsWith('skill.') && context.hasOwnProperty('parent') && context.parent.scope === 'skill') {
      variable = context.parent.variables[varName.substring(6)];
    } else {
      variable = context.variables[varName];
    }
    return variable.type.name;
  }

  /**
   * Returns list of composite bag item definitions
   * @return {object[]} list of composite bag item definitions
   */
  getEntityItems(): CompositeBagItem[] {
    const cbvar = this.getRequest().variableName;
    return this.getRequest().context.variables[cbvar].type.compositeBagItems;
  }

  /**
   * Return value of a composite bag item in the composite bag entity currentyly being resolved
   * @return {object} value of the composite bag item
   * @param {string} name - the name of the composite bag item for which the value is returned
   */
  getItemValue(name: string): any {
    return this._entity ? this._entity[name] : undefined;
  }

  /**
   * Set value of a composite bag item in the composite bag entity currentyly being resolved
   * @param {string} name - the name of the composite bag item for which the value is set
   * @param {object} value - value of the composite bag item
   */
  setItemValue(name: string, value: CompositeBagItem): void {
    if (!this._entity) {
      this._entity = {'entityName': this.getEntityName()}
      this.setVariable(this.getRequest().variableName, this._entity);
    }
    this._entity[name] = value;
    this._clearShouldPromptCache();
  }

  /**
   * Remove the value of a composite bag item from the composite bag entity JSON object
   * @param {string} name - name of the composite bag item
   */
  clearItemValue(name: string): void {
    delete this._entity[name];
    this._clearShouldPromptCache();
  }

  /**
   * Add a validation error for a composite bag item. This marks the item invalid and the
   * the item will not be set/updated with the new invalid value. The error mesage will be
   * published as bot message to the user.
   * @param {string} itemName - name of composite bag iten that validation error applies to
   * @param {string} error - the error message
   */
  addValidationError(itemName: string, error: string): void {
    this._entityStatus.validationErrors[itemName] = error;
  }

  /**
   * Returns validation errors
   * @return {object} validation errors keyed by item name
   */
  getValidationErrors(): {[name: string]: string | Error}  {
    return this._entityStatus.validationErrors;
  }

  /**
   * Returns the disambiguation values that are found based on the last user input for a specific bag item
   * @return {object[]} the disambiguations values. This is a string array for bag items that have a custom
   * entity type, and a JSONObject array for bag items with a system entity type
   * @param {string} itemName - name of the composite bag item
   */
  getDisambiguationValues(itemName: string): any[] {
    return this._entityStatus.disambiguationValues[itemName] || [];
  }

  /**
   * Sets the disambiguation values for a specific bag item
   * @param {string} itemName - name of the composite bag item
   * @param {object[]} disambiguationValues - this is a string array for bag items that have a custom
   * entity type, and a JSONObject array for bag items with a system entity type
   */
  setDisambiguationValues(itemName: string, disambiguationValues: any[]) {
    this._entityStatus.disambiguationValues[itemName] = disambiguationValues;
  }

  /**
   * Removes the disambiguation values that are found based on the last user input for a specific bag item
   * @param {string} itemName - name of the composite bag item, if not specified, all disambiguation values
   * of all items will be cleared
   */
  clearDisambiguationValues(itemName: string): void {
    if (itemName) {
      delete this._entityStatus.disambiguationValues[itemName];
    } else {
      // clear all disambiguation values
      this._entityStatus.disambiguationValues = {};
    }
  }

  /**
   * Returns the name of the bag item that is currently being resolved
   * @return {string} the bag item name
   */
  getCurrentItem(): string {
    return this._entityStatus.resolvingField;
  }

  /**
   * Returns the last user input message. If the last message was not a text message, this function returns undefined
   * @return {string} the user text message
   */
  getUserInput(): string {
    return this._entityStatus.userInput;
  }

  /**
   * Returns boolean flag indicating whether the component used to resolve the composite bag entity
   * (System.ResolveEntities or System.CommonResponse) has set the useFullEntityMatches property to true.
   * When set to true, custom entity values are stored as JSON object, similar to the builtin entities
   * that are always stored as JSON object.
   *
   * @return {boolean} fullEntityMatches flag
   */
  isFullEntityMatches(): boolean {
    return this._entityStatus.useFullEntityMatches;
  }

  /**
   * Mark a composite bag item as skipped, which means the ResolveEntities or CommonResponse component
   * will no longer prompt for a value for the bag item
   * @param {string} name - name of the composite bag item
   */
  skipItem(name: string): void {
    this._entityStatus.skippedItems.push(name);
    // clear resolving field if set to item that is now being skipped
    if (name === this._entityStatus.resolvingField) {
      delete this._entityStatus.resolvingField;
    }
  }

  /**
   * Unmark a composite bag item as skipped, which means the ResolveEntities or CommonResponse component
   * will prompt again for a value for the bag item
   * @param {string} name - name of the composite bag item
   */
  unskipItem(name: string): void {
    this._entityStatus.skippedItems =  this._entityStatus.skippedItems.filter(item => item !== name);
  }

  /**
   * Returns true when item is marked as skipped, returns false otherwise
   * @return {boolean} skip item flag
   * @param {string} name - name of the composite bag item
   */
  isSkippedItem(name: string): boolean {
    return this._entityStatus.skippedItems.includes(name);
  }

  /**
   * Returns a list of the candidate bot messages created by the the ResolveEntities or CommonResponse component
   * that will be sent to the user when you use addCandidateMessages() function.
   * @return {NonRawMessagePayload[]} list of candidate messages. Note that these messages are in the format of the conversation
   * message model (CMM), and can be either a text, attachment or card message payload
   */
  getCandidateMessages(): NonRawMessagePayload[] {
    return this.getRequest().candidateMessages;
  }

  /**
   * Add the bot messages created by ResolveEntities or CommomResponse component to the response that will
   * be sent to the user.
   * Note that these messages are in the format of the conversation message model (CMM), and can be either
   * a text, attachment or card message payload
   */
  addCandidateMessages(): void {
    if (this.getRequest().candidateMessages) {
      if (!this.getResponse().messages) {
        this.getResponse().messages = [];
      }
      this._logger.debug('Using candidate bot messages');
      for (let message of this.getRequest().candidateMessages) {
        this.getResponse().messages.push(message);
      }
      this.getResponse().keepProcessing = false;
    } else {
      this._logger.debug('No candidate bot messages found');
    }
  }

  /**
   * Returns the list of messages that will be sent to the user
   * @return list of messages
   */
  getMessages(): MessagePayload[] {
    return this.getResponse().messages || [];
  }

  /**
   * Adds a message to the bot response sent to the user.
   * @param {object} payload - can take a string payload, an object payload or a MessageModel payload.  A string or object
   * payload will be parsed into a MessageModel payload.  If the MessageModel payload has a valid common message format,
   * then reply will use it as messagePayload, else it will use the payload to create a rawConversationMessage
   * (see MessageModel) as messagePayload.
   * @param {boolean} keepProcessing - If set to false (the default), the message will be sent to the user and
   * the ResolveEntities or CommonResponse component will stop any further processing, and wait for user input.
   * If set to true, the component will continue processing, possibly sending more messages to the
   * user before releasing the turn
   */
  addMessage(payload: string | MessagePayload, keepProcessing?: boolean) {
    this.getResponse().keepProcessing = !!keepProcessing;
    this.getResponse().messages = this.getResponse().messages || [];
    this.getResponse().messages.push(super.constructMessagePayload(payload));
  }

  /**
   * Returns the composite bag item definitions that already had a value and have gotten a new value
   * extracted from the last user input.
   * @return {string[]} list of composite bag item names
   */
  getItemsUpdated(): string[] {
    return this._entityStatus.updatedEntities.map(ent => ent.name);
  }

  /**
   * Returns the composite bag item definitions that have gotten a new value
   * extracted from the last user input while the user was prompted for
   * another bag item.
   * @return {string[]} list of composite bag item names
   */
  getItemsMatchedOutOfOrder(): string[] {
    return this._entityStatus.outOfOrderMatches.map(ent => ent.name);
  }

  /**
   * Returns the composite bag item definitions that have gotten a new value
   * extracted from the last user input
   * @return {string[]} list of composite bag item names
   */
  getItemsMatched(): string[] {
    return this._entityStatus.allMatches.map(ent => ent.name);
  }

  /**
   * Returns list of enumeration values for the bag item that is currently being resolved.
   * This list is paginated, it only includes the values in current range
   * @return {object[]} list of enumeration values
   */
  getEnumValues(): object[] {
    return this._entityStatus.enumValues;
  }

  /**
   * A bag item of type system entity, LOCATION and ATTACHMENT has a JSON Object as value.
   * With this function you can override the default display properties of the JSON
   * Object that should be used to print out a string representation of the value.
   * @param {string} entityName - name of the system entity, or 'ATTACHMENT' or 'LOCATION'
   * @param {string[]} properties - array of property names
   */
  setSystemEntityDisplayProperties(entityName: string, properties: string[]): void {
    this._systemEntityDisplayProperties[entityName].properties = properties;
  }

  /**
   * A bag item of type system entity, LOCATION and ATTACHMENT has a JSON Object as value.
   * With this function you can override the default display function that is applied to the
   * display property values. The function is called with each display property as an argument
   * For example, this is the default display function for DURATION:
   * ((startDate,endDate) => new Date(startDate)+" - "+new Date(endDate))
   * If you want to format the dates differently, you can use a library like moments.js
   * and call this function to override the display function
   * Object that should be used to print out a string representation of the value.
   * @param {string} entityName - name of the system entity, or 'ATTACHMENT' or 'LOCATION'
   * @param {object} displayFunction - the display function applied to the display properties
   */
  setSystemEntityDisplayFunction(entityName: string, displayFunction: (...args: string[]) => string): void {
    this._systemEntityDisplayProperties[entityName].function = displayFunction;
  }

  /**
   * Returns the display value for a composite bag item.
   * For bag items with a custom entity type, the display value returned is the value property of the
   * JSON Object value when isFullEntityMatches returns true. When isFullEntityMatches returns false, the actual value is returned.
   * For STRING bag item types, the display value is the same as the actual value.
   * For system entities, and for bag item types LOCATION and ATTACHMENT the configured display
   * properties and display function determine the display value
   * @see isFullEntityMatches
   * @see setSystemEntityDisplayProperties
   * @see setSystemEntityDisplayFunction
   * @return {string} display value of composite bag item
   * @param {string} itemName - name of the composite bag item
   */
  getDisplayValue(itemName: string): string {
    let itemValue = this.getItemValue(itemName);
    for (let item of this.getEntityItems()) {
      if (item.name === itemName) {
        // bag item types ATTACHMENT and LOCATION also have display properties
        let entityName = item.entityName ? item.entityName : item.type + '_ITEM';
        itemValue =  this._getDisplayValue(entityName, itemValue);
      }
    }
    return itemValue;
  }

  /**
   * Returns the display values for a composite bag entity.
   * @see getDisplayValue
   * @see setSystemEntityDisplayProperties
   * @see setSystemEntityDisplayFunction
   * @return {string[]} list of display values of composite bag item
   * @param {string} itemNames - you can specify one or more item names as argument. If you do this, only the display
   * values of these items will be returned. If you do not specify an item name, the display values of all
   * items in the bag will be returned.
   */
  getDisplayValues(): string[] {
    // convert arguments to real array so we can use includes function
    let args = Array.prototype.slice.call(arguments);
    let itemValues = [];
    for (let item of this.getEntityItems()) {
      if (this._entity.hasOwnProperty(item.name) && (args.length === 0 || args.includes(item.name))) {
        let itemValue =  this.getDisplayValue(item.name);
        itemValues.push({name: item.name, value: itemValue});
      }
    }
    return itemValues;
  }

  /**
   * Cancels the entity resolution process and sets the 'cancel' transition on the ResolveEntities or Common Response component.
   */
  cancel(): void {
    this.getResponse().cancel = true;
  }

  /**
   * Set a transition action. When you use this function, the entity resolution process is aborted, and the dialog engine will transition
   * to the state defined for this transition action.
   * @param {string} action - name of the transition action
   */
  setTransitionAction(action: string) {
    this.getResponse().transitionAction = action;
  }

  /**
   * Sets the value of a custom property that is stored in the entity resolution context. A custom property can be
   * used to maintain custom state accross event handler calls while resolving the composite bag entity.
   * If you set the value to null, the custom property will be removed.
   * @param {string} name - name of the custom property
   * @param {object} value - value of the custom property
   */
  setCustomProperty(name: string, value: any) {
    if (value === null) {
      delete this._entityStatus.customProperties[name];
    } else {
      this._entityStatus.customProperties[name] = value;
    }
  }

  /**
   * Returns the value of a custom property that is stored in the entity resolution context. A custom property can be
   * used to maintain custom state accross event handler calls while resolving the composite bag entity.
   * @return {object} value of the custom property
   * @param {string} name - name of the custom property
   */
  getCustomProperty(name: string): any {
    return this._entityStatus.customProperties[name];
  }

  /**
   * Configure default display properties for all system entities, and ATTACHMENT and LOCATION item types
   * INTERNAL ONLY - DO NOT USE
   * @private
   */
  private _initSystemEntityDisplayProperties(): void {
    this._systemEntityDisplayProperties = {
      'EMAIL': {'properties': ['email']}
      , 'CURRENCY': {'properties': ['amount', 'currency']}
      , 'NUMBER': {'properties': ['number']}
      , 'YES_NO': {'properties': ['yesno']}
      , 'DATE': {'properties': ['date'], 'function': (date => new Date(date).toDateString())}
      , 'TIME': {'properties': ['originalString']}
      // tslint:disable-next-line:max-line-length
      , 'DURATION': {'properties': ['startDate', 'endDate'], 'function': ((startDate, endDate) => new Date(startDate).toDateString() + ' - ' + new Date(endDate).toDateString())}
      , 'ADDRESS': {'properties': ['originalString']}
      , 'PERSON': {'properties': ['originalString']}
      , 'PHONE_NUMBER': {'properties': ['completeNumber']}
      , 'SET': {'properties': ['originalString']}
      , 'URL': {'properties': ['fullPath']}
      , 'ATTACHMENT_ITEM': {'properties': ['url']}
      , 'LOCATION_ITEM': {'properties': ['latitude, longitude']}
    };
  }

  /**
   * Returns display value for a composite bag item raw value using the display properties
   * configured for the system entity
   * INTERNAL ONLY - DO NOT USE - Use getDisplayValue(itemName) instead
   * @return {string} the display value
   * @param {string} entityName - name of the bag item entity type
   * @param {object} rawValue - value of the bag item
   * @private
   */
  private _getDisplayValue(entityName: string, rawValue: any) {
    let props = this._systemEntityDisplayProperties[entityName];
    let self = this;
    let getValue = (itemValue: any) => {
      if (props && props.properties) {
        let args = props.properties.map(p => itemValue[p]);
        if (props.hasOwnProperty('function')) {
          return props['function'](...args);
        } else {
          return args.join(' ');
        }
      } else {
        if (self.isFullEntityMatches() && itemValue && itemValue.hasOwnProperty('value')) {
          return itemValue.value;
        } else {
          return itemValue;
        }
      }
    };
    if (Array.isArray(rawValue)) {
      return rawValue.map(v => getValue(v)).join(', ');
    } else {
      return getValue(rawValue);
    }
  }

  /**
   * Clears the cache with information which items should be prompted for a value
   * INTERNAL ONLY - DO NOT USE
   * @private
   */
  _clearShouldPromptCache(): void {
    this._entityStatus.shouldPromptCache = {};
  }

  /**
   * Returns the cache with information which items should be prompted for a value.
   * @return {object} Cache is a JSON object with item names as key and a boolean value as value.
   * INTERNAL ONLY - DO NOT USE
   * @private
   */
  _getShouldPromptCache() {
    return this._entityStatus.shouldPromptCache;
  }

}

