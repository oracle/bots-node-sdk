import {  Action, MessageUtil, ChannelCustomizable, Column } from '../internal';

/**
 * Represents a form row
 * @extends ChannelCustomizable
 */
export class FormRow extends ChannelCustomizable {

  private id?: string;
  private columns: Column[] = [];
  private selectAction?: Action;
  private separator?: boolean;

  /**
   * Deserialize nested object properties into corresponding class instances
   */
  public deserializeNestedProperties(): void {
    super.deserializeNestedProperties();
    this.columns = MessageUtil.deserializeColumns(this.columns);
    if (this.selectAction) {
      this.selectAction = MessageUtil.deserializeAction(this.selectAction);
    }
  }

  /**
   * Creates an instance of the FormRow class.
   * @param {Column[]} [columns] The list of columns in the form row
   */
  constructor(columns?: Column[]) {
    super();
    if (columns) {
      this.columns = columns;
    }
  }

  /**
   * Gets the ID of the form row.
   * @returns {string} The ID of the form row.
   */
  public getId(): string {
    return this.id;
  }

  /**
   * Sets the ID of the form row.
   * @param {string} id The ID to set.
   * @returns {FormRow} The updated instance of the FormRow.
   */
  public setId(id: string): this {
    this.id = id;
    return this;
  }

  /**
   * Gets the separator of the form row.
   * @returns {boolean} The separator
   */
  public getSeparator(): boolean {
    return this.separator;
  }

  /**
   * Sets the separator of the form row.
   * @param {boolean} flag to add separator
   * @returns {FormRow} The updated instance of the FormRow.
   */
  public setSeparator(separator: boolean): this {
    this.separator = separator;
    return this;
  }

  /**
   * Gets the list of columns in the form row.
   * @returns {Column[]} The list of columns in the form row.
   */
  public getColumns(): Column[] {
    return this.columns;
  }

  /**
   * Sets the columns of the form row.
   * @param {Column[]} columns The columns to set.
   * @returns {FormRow} The updated instance of the FormRow.
   */
  public setColumns(columns: Column[]): this {
    this.columns = columns;
    return this;
  }

  /**
   * Adds a column to the form row.
   * @param {Column} column The column to add.
   * @returns {FormRow} The updated instance of the FormRow.
   */
  public addColumn(column: Column): this {
    this.columns.push(column);
    return this;
  }

  /**
   * Gets the select action of the form row.
   * @returns The select action of the form row.
   */
  public getSelectAction(): Action {
    return this.selectAction;
  }

  /**
   * Sets the select action of the form row.
   * @param selectAction The select action to set.
   * @returns The updated instance of the FormRow.
   */
  public setSelectAction(selectAction: Action): this {
    this.selectAction = selectAction;
    return this;
  }

}
