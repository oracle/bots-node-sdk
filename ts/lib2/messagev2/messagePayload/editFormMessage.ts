import { NonRawMessage, Field, MessageUtil, FormRow } from '../internal';

/**
 * Represents an edit form message.
 * @extends NonRawMessage
 */
export class EditFormMessage extends NonRawMessage {
  public readonly type: string = 'editForm';
  private title?: string;
  private formColumns = 1;
  private fields: Field[] = [];
  private formRows: FormRow[] = [];
  private errorMessage?: string;

  /**
   * Deserialize nested object properties into corresponding class instances
   */
  public deserializeNestedProperties(): void {
    super.deserializeNestedProperties();
    if (this.fields) {
      this.fields = MessageUtil.deserializeFields(this.fields);
    }
    if (this.formRows) {
      this.formRows = MessageUtil.deserializeFormRows(this.formRows);
    }
  }

  /**
   * Creates an instance of the EditFormMessage class.
   * @param {Field[]} fields The list of fields in the edit form message.
   */
  constructor(fields?: Field[]) {
    super();
    if (fields) {
      this.fields = fields;
    }
  }

  /**
   * Gets the title of the edit form message.
   * @returns {string} The title of the edit form message.
   */
  public getTitle(): string {
    return this.title;
  }

  /**
   * Sets the title of the edit form message.
   * @param {string} title The title to set.
   * @returns {EditFormMessage} The updated instance of the EditFormMessage.
   */
  public setTitle(title: string): this {
    this.title = title;
    return this;
  }

  /**
   * Gets the number of form columns in the edit form message.
   * @returns {number} The number of form columns in the edit form message.
   */
  public getFormColumns(): number {
    return this.formColumns;
  }

  /**
   * Sets the number of form columns in the edit form message.
   * @param {number} formColumns The number of form columns to set.
   * @returns {EditFormMessage} The updated instance of the EditFormMessage.
   */
  public setFormColumns(formColumns: number): this {
    this.formColumns = formColumns;
    return this;
  }

  /**
   * Gets the list of fields in the edit form message.
   * @returns {Field[]} The list of fields in the edit form message.
   */
  public getFields(): Field[] {
    return this.fields;
  }

  /**
   * Sets the fields of the edit form message.
   * @param {Field[]} fields The fields to set.
   * @returns {EditFormMessage} The updated instance of the EditFormMessage.
   */
  public setFields(fields: Field[]): this {
    this.fields = fields;
    return this;
  }

  /**
   * Adds a field to the edit form message.
   * @param {Field} field The field to add.
   * @returns {EditFormMessage} The updated instance of the EditFormMessage.
   */
  public addField(field: Field): this {
    this.fields.push(field);
    return this;
  }

  /**
   * Gets the list of form rows in the edit form message.
   * @returns {FormRow[]} The list of form rows in the edit form message.
   */
  public getFormRows(): FormRow[] {
      return this.formRows;
  }

  /**
   * Sets the form rows of the edit form message.
   * @param {FormRow[]} formRows The form rows to set.
   * @returns {EditFormMessage} The updated instance of the EditFormMessage.
   */
  public setFormRows(formRows: FormRow[]): this {
    this.formRows = formRows;
    return this;
  }

  /**
   * Adds a form row to the edit form message.
   * @param {FormRow} formRow The form row to add.
   * @returns {EditFormMessage} The updated instance of the EditFormMessage.
   */
  public addFormRow(formRow: FormRow): this {
    this.formRows.push(formRow);
    return this;
  }

  /**
   * Gets the error message of the edit form message.
   * @returns {string} The error message of the edit form message.
   */
  public getErrorMessage(): string {
    return this.errorMessage;
  }

  /**
   * Sets the error message of the edit form message.
   * @param {string} errorMessage The error message to set.
   * @returns {EditFormMessage} The updated instance of the EditFormMessage.
   */
  public setErrorMessage(errorMessage: string): this {
    this.errorMessage = errorMessage;
    return this;
  }
}
