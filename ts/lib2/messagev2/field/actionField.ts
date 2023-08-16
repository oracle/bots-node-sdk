import { ReadOnlyField, Action, MessageUtil } from '../internal';

/**
 * Represents an action field.
 * @extends ReadOnlyField
 */
export class ActionField extends ReadOnlyField {
  public readonly displayType: string = 'action';
  private action: Action;

  /**
   * Creates an instance of the ActionField class.
   * @param {Action} action The action of the action field.
   */
  constructor(action: Action) {
    super();
    this.action = action;
  }

  /**
   * Deserialize nested object properties into corresponding class instances
   */
  public deserializeNestedProperties(): void {
    super.deserializeNestedProperties();
    this.action = MessageUtil.deserializeAction(this.action);
  }

  /**
   * Gets the action associated with the field.
   * @returns {Action} The action.
   */
  public getAction(): Action {
    return this.action;
  }

  /**
   * Sets the action associated with the field.
   * @param {Action} action The action to set.
   * @returns The updated instance of the ActionField.
   */
  public setAction(action: Action): this {
    this.action = action;
    return this;
  }

}
