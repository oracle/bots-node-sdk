import { ReadOnlyField, MessageUtil, ChannelCustomizable, Action } from '../internal';

/**
 * Represents a row in a channel customizable element.
 * @extends ChannelCustomizable
 */
export class Row extends ChannelCustomizable {
  private fields: ReadOnlyField[] = [];
  private selectAction?: Action;

  /**
   * Deserialize nested object properties into corresponding class instances
   */
  public deserializeNestedProperties(): void {
    super.deserializeNestedProperties();
    if (this.fields) {
      this.fields = MessageUtil.deserializeFields(this.fields);
    }
    if (this.selectAction) {
      this.selectAction = MessageUtil.deserializeAction(this.selectAction);
    }
  }

  /**
   * Creates an instance of the Row class.
   * @param {ReadOnlyField[]} fields The list of fields in the row
   */
  constructor(fields?: ReadOnlyField[]) {
    super();
    if (fields) {
      this.fields = fields;
    }
  }

  /**
   * Gets the fields in the row.
   * @returns {ReadOnlyField[]} The array of fields.
   */
  public getFields(): ReadOnlyField[] {
    return this.fields;
  }

  /**
   * Adds a field to the row.
   * @param {ReadOnlyField} field The field to add.
   * @returns {Row} The updated instance of the Row.
   */
  public addField(field: ReadOnlyField): this {
    this.fields.push(field);
    return this;
  }

  /**
   * Gets the select action of the row.
   * @returns The select action.
   */
  public getSelectAction(): Action | undefined {
    return this.selectAction;
  }

  /**
   * Sets the select action of the row.
   * @param selectAction The select action to set.
   * @returns The updated instance of the Row.
   */
  public setSelectAction(selectAction: Action): this {
    this.selectAction = selectAction;
    return this;
  }
}
