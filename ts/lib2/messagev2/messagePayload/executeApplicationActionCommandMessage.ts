import { CommandMessage, CommandType } from '../internal';

/**
 * Represents an execute application action command message.
 * This message is used in co-pilot where this message is sent from the skill to the client to trigger a specific action in a
 * page, e.g. updateing fields.
 *
 * @extends CommandMessage
 */
export class ExecuteApplicationActionCommandMessage extends CommandMessage {
  public readonly type: string = 'executeApplicationActionCommand';
  private applicationName: string;
  private pageName?: string;
  private action: string;

  /**
   * Creates an instance of the ExecuteApplicationActionCommandMessage class.
   * @param {string} applicationName The name of the application
   */
  constructor(applicationName: string, action: string) {
    super(CommandType.executeApplicationAction);
    this.applicationName = applicationName;
    this.action = action;
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
   * @returns {this} The updated instance of the ExecuteApplicationActionCommandMessage.
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
   * @returns {this} The updated instance of the ExecuteApplicationActionCommandMessage.
   */
  public setPageName(pageName: string): this {
    this.pageName = pageName;
    return this;
  }

  /**
   * Gets the action
   * @returns {string} The action
   */
  public getAction(): string {
    return this.action;
  }

  /**
   * Sets the action
   * @param {string} The action
   * @returns {this} The updated instance of the ExecuteApplicationActionCommandMessage.
   */
  public setAction(action: string): this {
    this.action = action;
    return this;
  }

}
