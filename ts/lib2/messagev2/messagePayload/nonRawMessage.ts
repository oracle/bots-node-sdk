import { Voice, ChannelCustomizable, MessageUtil, Action, Keyword, ReadOnlyForm } from '../internal';

/**
 * Base class for all non-raw message types
 */
export class NonRawMessage extends ChannelCustomizable {
  private actions?: Action[];
  private globalActions?: Action[];
  private keywords?: Keyword[];
  private voice?: Voice;
  private footerText?: string;
  private footerForm?: ReadOnlyForm;
  private headerText?: string;
  private properties?: Map<string, any>;

  /**
   * Convert the message to JSON object
   * @returns {object} The message in JSON format
   */
  public toJson(): object {
    return JSON.parse(JSON.stringify(this));
  }

  /**
   * Deserialize nested object properties into corresponding class instances
   */
  public deserializeNestedProperties(): void {
    super.deserializeNestedProperties();
    if (this.actions) {
      this.actions = MessageUtil.deserializeActions(this.actions);
    }
    if (this.globalActions) {
      this.globalActions = MessageUtil.deserializeActions(this.globalActions);
    }
    if (this.keywords) {
      this.keywords = MessageUtil.deserializeKeywords(this.keywords);
    }
    if (this.voice) {
      this.voice = MessageUtil.deserializeVoice(this.voice);
    }
    if (this.footerForm) {
      this.footerForm = MessageUtil.deserializeReadOnlyForm(this.footerForm);
    }
  }

  /**
   * Get the actions associated with the non-raw message.
   * @returns {Action[]} The array of actions.
   */
  public getActions(): Action[] {
    return this.actions;
  }

  /**
   * Set the actions for the non-raw message.
   * @param {Action[]} actions - The array of actions to set.
   * @returns {this} The current instance of the NonRawMessage class.
   */
  public setActions(actions: Action[]): this {
    this.actions = actions;
    return this;
  }

  /**
   * Add an action to the non-raw message.
   * @param {Action} action - The action to add.
   * @returns {this} The current instance of the NonRawMessage class.
   */
  public addAction(action: Action): this {
    if (!this.actions) {
      this.actions = [];
    }
    this.actions.push(action);
    return this;
  }

  /**
   * Get the global actions associated with the non-raw message.
   * @returns {Action[]} The array of global actions.
   */
  public getGlobalActions(): Action[] {
    return this.globalActions;
  }

  /**
   * Set the global actions for the non-raw message.
   * @param {Action[]} globalActions - The array of global actions to set.
   * @returns {this} The current instance of the NonRawMessage class.
   */
  public setGlobalActions(globalActions: Action[]): this {
    this.globalActions = globalActions;
    return this;
  }

  /**
   * Add a global action to the non-raw message.
   * @param {Action} action - The global action to add.
   * @returns {this} The current instance of the NonRawMessage class.
   */
  public addGlobalAction(action: Action): this {
    if (!this.globalActions) {
      this.globalActions = [];
    }
    this.globalActions.push(action);
    return this;
  }

  /**
   * Get the keywords associated with the non-raw message.
   * @returns {Keyword[]} The array of keywords.
   */
  public getKeywords(): Keyword[] {
    return this.keywords;
  }

  /**
   * Set the keywords for the non-raw message.
   * @param {Keyword[]} keywords - The array of keywords to set.
   * @returns {this} The current instance of the NonRawMessage class.
   */
  public setKeywords(keywords: Keyword[]): this {
    this.keywords = keywords;
    return this;
  }

  /**
   * Add a keyword to the non-raw message.
   * @param {Keyword} keyword - The keyword to add.
   * @returns {this} The current instance of the NonRawMessage class.
   */
  public addKeyword(keyword: Keyword): this {
    if (!this.keywords) {
      this.keywords = [];
    }
    this.keywords.push(keyword);
    return this;
  }

  /**
   * Get the voice associated with the non-raw message.
   * @returns {Voice} The voice settings.
   */
  public getVoice(): Voice {
    return this.voice;
  }

  /**
   * Set the voice settings for the non-raw message.
   * @param {Voice} voice - The voice settings to set.
   * @returns {this} The current instance of the NonRawMessage class.
   */
  public setVoice(voice: Voice): this {
    this.voice = voice;
    return this;
  }

  /**
   * Get the footer text of the non-raw message.
   * @returns {string} The footer text.
   */
  public getFooterText(): string {
    return this.footerText;
  }

  /**
   * Set the footer text for the non-raw message.
   * @param {string} footerText - The footer text to set.
   * @returns {this} The current instance of the NonRawMessage class.
   */
  public setFooterText(footerText: string): this {
    this.footerText = footerText;
    return this;
  }

  /**
   * Get the footer form associated with the non-raw message.
   * @returns {ReadOnlyForm} The form
   */
  public getFooterForm(): ReadOnlyForm {
    return this.footerForm;
  }

  /**
   * Set the footer form for the non-raw message.
   * @param {ReadOnlyForm} footerForm - The form to set.
   * @returns {this} The current instance of the NonRawMessage class.
   */
  public setFooterForm(footerForm: ReadOnlyForm): this {
    this.footerForm = footerForm;
    return this;
  }

  /**
   * Get the header text of the non-raw message.
   * @returns {string} The header text.
   */
  public getHeaderText(): string {
    return this.headerText;
  }

  /**
   * Set the header text for the non-raw message.
   * @param {string} headerText - The header text to set.
   * @returns {this} The current instance of the NonRawMessage class.
   */
  public setHeaderText(headerText: string): this {
    this.headerText = headerText;
    return this;
  }

  /**
   * Gets the properties of the message.
   * @returns {Map<string, any>} The properties of the message.
   */
  public getProperties(): Map<string, any> {
    return this.properties;
  }

  /**
   * Gets the value of a property.
   * @param {string} propertyName The name of the property.
   * @returns {any} The property value.
   */
  public getPropertyValue(propertyName: string): any {
    return this.properties ? this.properties[propertyName] : undefined;
  }

  /**
   * Sets the properties of the message.
   * @param {Map<string, any>} properties The properties to set.
   * @returns {this} The current instance of the NonRawMessage class.
   */
  public setProperties(properties: Map<string, any>): this {
    this.properties = properties;
    return this;
  }

  /**
   * Add a property to the message.
   * @param {string} name The name of the property.
   * @param {any} value The value of the property.
   * @returns {this} The current instance of the NonRawMessage class.
   */
  public addProperty(name: string, value: any): this {
    if (!this.properties) {
      this.properties = new Map();
    }
    this.properties[name] = value;
    return this;
  }

}
