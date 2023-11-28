import { CommandMessage, CommandType } from '../internal';

/**
 * Represents the context source that initiates the application context update
 */
export enum ContextSource {
  chatWindow = 'chatWindow',
  UIWidget = 'UIWidget',
  skill = 'skill'
}

/**
 * Represents an update context command message.
 * This message is used in co-pilot where the application context can be sent from the client to the skill to
 * invoke or resume a flow, or it is sent from the skill to the client to trigger application navigation.
 *
 * @extends CommandMessage
 */
export class UpdateApplicationContextCommandMessage extends CommandMessage {
  public readonly type: string = 'updateApplicationContextCommand';
  private applicationName: string;
  private pageName?: string;
  private fieldName?: string;
  private parameters?: Map<string, any>;
  private source: ContextSource;
  private reset?: boolean;

  /**
   * Creates an instance of the UpdateContextCommandMessage class.
   * @param {string} applicationName The command type.
   */
  constructor(applicationName: string) {
    super(CommandType.updateApplicationContext);
    this.source = ContextSource.skill;
    this.applicationName = applicationName;
  }

  /**
   * Gets the context source
   * @returns {ContextSource} The context source
   */
  public getSource(): ContextSource {
    return this.source;
  }

  /**
   * Sets the context source
   * @param {ContextSource} The context source
   * @returns {this} The updated instance of the UpdateContextCommandMessage.
   */
  public setSource(source: ContextSource): this {
    this.source = source;
    return this;
  }

  /**
   * Gets the application name
   * @returns {string} The name of the application
   */
  public getApplicationName(): string {
    return this.applicationName;
  }

  /**
   * Sets the application name
   * @param {string} The name of the application
   * @returns {this} The updated instance of the UpdateContextCommandMessage.
   */
  public setApplicationName(applicationName: string): this {
    this.applicationName = applicationName;
    return this;
  }

  /**
   * Gets the page name
   * @returns {string} The name of the page
   */
  public getPageName(): string {
    return this.pageName;
  }

  /**
   * Sets the page name
   * @param {string} The name of the page
   * @returns {this} The updated instance of the UpdateContextCommandMessage.
   */
  public setPageName(pageName: string): this {
    this.pageName = pageName;
    return this;
  }

  /**
   * Gets the field name
   * @returns {string} The name of the field
   */
  public getFieldName(): string {
    return this.fieldName;
  }

  /**
   * Sets the field name
   * @param {string} The name of the field
   * @returns {this} The updated instance of the UpdateContextCommandMessage.
   */
  public setFieldName(fieldName: string): this {
    this.fieldName = fieldName;
    return this;
  }

  /**
   * Gets the parameters of the message.
   * @returns {Map<string, any>} The parameters of the message.
   */
  public getParameters(): Map<string, any> {
    return this.parameters;
  }

  /**
   * Gets the value of a parameter.
   * @param {string} parameterName The name of the parameter.
   * @returns {any} The parameter value.
   */
  public getParameterValue(parameterName: string): any {
    return this.parameters ? this.parameters[parameterName] : undefined;
  }

  /**
   * Sets the parameters of the message.
   * @param {Map<string, any>} parameters The parameters to set.
   * @returns {this} The current instance of the UpdateContextCommandMessage class.
   */
  public setParameters(parameters: Map<string, any>): this {
    this.parameters = parameters;
    return this;
  }

  /**
   * Add a parameter to the message.
   * @param {string} name The name of the parameter.
   * @param {any} value The value of the parameter.
   * @returns {this} The current instance of the UpdateContextCommandMessage class.
   */
  public addParameter(name: string, value: any): this {
    if (!this.parameters) {
      this.parameters = new Map();
    }
    this.parameters[name] = value;
    return this;
  }

  /**
   * Returns the flow reset flag
   * @returns {boolean} flow reset flag
   */
  public getReset(): boolean {
    return this.reset;
  }

  /**
   * Set the flow reset flag
   * @param {boolean} reset The reset flag
   * @returns {this} The current instance of the UpdateContextCommandMessage class.
   */
  public setReset(reset: boolean): this {
    this.reset = reset;
    return this;
  }

}
