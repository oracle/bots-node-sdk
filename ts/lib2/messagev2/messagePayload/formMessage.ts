import { NonRawMessage, ReadOnlyForm, PaginationInfo, MessageUtil } from '../internal';

/**
 * Represents a form message.
 * @extends NonRawMessage
 */
export class FormMessage extends NonRawMessage {
  public readonly type: string = 'form';

  private forms: ReadOnlyForm[] = [];
  private formColumns = 1;
  private paginationInfo?: PaginationInfo;

  /**
   * Deserialize nested object properties into corresponding class instances
   */
  public deserializeNestedProperties(): void {
    super.deserializeNestedProperties();
    if (this.forms) {
      this.forms = MessageUtil.deserializeReadOnlyForms(this.forms);
    }
    if (this.paginationInfo) {
      this.paginationInfo = MessageUtil.deserializePaginationInfo(this.paginationInfo);
    }
  }

  /**
   * Creates an instance of the FormMessage class.
   * @param {ReadOnlyForm[]} forms The list of forms in the message.
   */
  constructor(forms?: ReadOnlyForm[]) {
    super();
    if (forms) {
      this.forms = forms;
    }
  }

  /**
   * Gets the list of forms in the message.
   * @returns {ReadOnlyForm[]} The list of forms in the message.
   */
  public getForms(): ReadOnlyForm[] {
    return this.forms;
  }

  /**
   * Sets the forms in the form message.
   * @param {ReadOnlyForm[]} forms The list of forms in the message.
   * @returns {FormMessage} The updated instance of the FormMessage.
   */
  public setForms(forms?: ReadOnlyForm[]): this {
    this.forms = forms;
    return this;
  }

  /**
   * Adds a form to the message.
   * @param {ReadOnlyForm} form The form to add.
   * @returns {FormMessage} The updated instance of the FormMessage.
   */
  public addForm(form: ReadOnlyForm): this {
    this.forms.push(form);
    return this;
  }

  /**
   * Gets the number of form columns.
   * @returns {number} The number of form columns.
   */
  public getFormColumns(): number {
    return this.formColumns;
  }

  /**
   * Sets the number of form columns.
   * @param {number} formColumns The number of form columns to set.
   * @returns {FormMessage} The updated instance of the FormMessage.
   */
  public setFormColumns(formColumns: number): this {
    this.formColumns = formColumns;
    return this;
  }

  /**
   * Gets the pagination information.
   * @returns {PaginationInfo | undefined} The pagination information.
   */
  public getPaginationInfo(): PaginationInfo | undefined {
    return this.paginationInfo;
  }

  /**
   * Sets the pagination information.
   * @param {PaginationInfo} paginationInfo The pagination information to set.
   * @returns {FormMessage} The updated instance of the FormMessage.
   */
  public setPaginationInfo(paginationInfo: PaginationInfo): this {
    this.paginationInfo = paginationInfo;
    return this;
  }
}
