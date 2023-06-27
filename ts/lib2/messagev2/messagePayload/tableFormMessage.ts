import { NonRawMessage, ReadOnlyForm, TableHeading, Row, PaginationInfo, MessageUtil } from '../internal';

/**
 * Represents a table form message.
 * @extends NonRawMessage
 */
export class TableFormMessage extends NonRawMessage {
  public readonly type: string = 'tableForm';

  private headings: TableHeading[] = [];
  private rows: Row[] = [];
  private forms: ReadOnlyForm[] = [];
  private formColumns = 1;
  private showFormButtonLabel?: string;
  private paginationInfo?: PaginationInfo;
  private disclosedFormIndex?: number;

  /**
   * Deserialize nested object properties into corresponding class instances
   */
  public deserializeNestedProperties(): void {
    super.deserializeNestedProperties();
    if (this.headings) {
      this.headings = MessageUtil.deserializeTableHeadings(this.headings);
    }
    if (this.rows) {
      this.rows = MessageUtil.deserializeRows(this.rows);
    }
    if (this.forms) {
      this.forms = MessageUtil.deserializeReadOnlyForms(this.forms);
    }
    if (this.paginationInfo) {
      this.paginationInfo = MessageUtil.deserializePaginationInfo(this.paginationInfo);
    }
  }

  /**
   * Creates an instance of TableFormMessage.
   * @param {TableHeading[]} headings The table headings.
   * @param {Row[]} rows The table rows.
   * @param {ReadOnlyForm[]} forms The read-only forms.
   */
  constructor(headings?: TableHeading[], rows?: Row[], forms?: ReadOnlyForm[]) {
    super();
    if (headings) {
      this.headings = headings;
    }
    if (rows) {
      this.rows = rows;
    }
    if (forms) {
      this.forms = forms;
    }
  }

  /**
   * Gets the table headings.
   * @returns {TableHeading[]} The table headings.
   */
  public getHeadings(): TableHeading[] {
    return this.headings;
  }

  /**
   * Sets the table headings.
   * @param {TableHeading[]} headings The table headings.
   * @returns {this} The current instance of TableFormMessage.
   */
  public setHeadings(headings: TableHeading[]): this {
    this.headings = headings;
    return this;
  }

  /**
   * Adds a heading to the table.
   * @param {TableHeading} heading The heading to add.
   * @returns {this} The current instance of TableFormMessage.
   */
  public addHeading(heading: TableHeading): this {
    this.headings.push(heading);
    return this;
  }

  /**
   * Gets the table rows.
   * @returns {Row[]} The table rows.
   */
  public getRows(): Row[] {
    return this.rows;
  }

  /**
   * Sets the table rows.
   * @param {Row[]} rows The table rows.
   * @returns {this} The current instance of TableFormMessage.
   */
  public setRows(rows: Row[]): this {
    this.rows = rows;
    return this;
  }

  /**
   * Adds a row to the table.
   * @param {Row} row The row to add.
   * @returns {this} The current instance of TableFormMessage.
   */
  public addRow(row: Row): this {
    this.rows.push(row);
    return this;
  }

  /**
   * Gets the read-only forms.
   * @returns {ReadOnlyForm[]} The read-only forms.
   */
  public getForms(): ReadOnlyForm[] {
    return this.forms;
  }

  /**
   * Sets the read-only forms.
   * @param {ReadOnlyForm[]} forms The read-only forms.
   * @returns {this} The current instance of TableFormMessage.
   */
  public setForms(forms: ReadOnlyForm[]): this {
    this.forms = forms;
    return this;
  }

  /**
   * Adds a read-only form.
   * @param {ReadOnlyForm} form The form to add.
   * @returns {this} The current instance of TableFormMessage.
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
   * @param {number} formColumns The number of form columns.
   * @returns {this} The current instance of TableFormMessage.
   */
  public setFormColumns(formColumns: number): this {
    this.formColumns = formColumns;
    return this;
  }

  /**
   * Gets the label for the show form button.
   * @returns {string} The label for the show form button.
   */
  public getShowFormButtonLabel(): string {
    return this.showFormButtonLabel;
  }

  /**
   * Sets the label for the show form button.
   * @param {string} showFormButtonLabel The label for the show form button.
   * @returns {this} The current instance of TableFormMessage.
   */
  public setShowFormButtonLabel(showFormButtonLabel: string): this {
    this.showFormButtonLabel = showFormButtonLabel;
    return this;
  }

  /**
   * Gets the pagination information.
   * @returns {PaginationInfo} The pagination information.
   */
  public getPaginationInfo(): PaginationInfo {
    return this.paginationInfo;
  }

  /**
   * Sets the pagination information.
   * @param {PaginationInfo} paginationInfo The pagination information.
   * @returns {this} The current instance of TableFormMessage.
   */
  public setPaginationInfo(paginationInfo: PaginationInfo): this {
    this.paginationInfo = paginationInfo;
    return this;
  }

  /**
   * Gets the index of the disclosed form.
   * @returns {number} The index of the disclosed form.
   */
  public getDisclosedFormIndex(): number {
    return this.disclosedFormIndex;
  }

  /**
   * Sets the index of the disclosed form.
   * @param {number} disclosedFormIndex The index of the disclosed form.
   * @returns {this} The current instance of TableFormMessage.
   */
  public setDisclosedFormIndex(disclosedFormIndex: number): this {
    this.disclosedFormIndex = disclosedFormIndex;
    return this;
  }
}
