import { NonRawMessage, Row, TableHeading, PaginationInfo, MessageUtil } from '../internal';

/**
 * Represents a table message.
 * @extends NonRawMessage
 */
export class TableMessage extends NonRawMessage {
  public readonly type: string = 'table';

  private headings: TableHeading[] = [];
  private rows: Row[] = [];
  private paginationInfo?: PaginationInfo;

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
    if (this.paginationInfo) {
      this.paginationInfo = MessageUtil.deserializePaginationInfo(this.paginationInfo);
    }
  }

  /**
   * Creates an instance of TableMessage.
   * @param {TableHeading[]} headings The table headings.
   * @param {Row[]} rows The table rows.
   */
  constructor(headings?: TableHeading[], rows?: Row[]) {
    super();
    if (headings) {
      this.headings = headings;
    }
    if (rows) {
      this.rows = rows;
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
   * @returns {TableMessage} The current instance of TableMessage.
   */
  public setHeadings(headings: TableHeading[]): this {
    this.headings = headings;
    return this;
  }

  /**
   * Adds a heading to the table.
   * @param {TableHeading} heading The heading to add.
   * @returns {TableMessage} The current instance of TableMessage.
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
   * @returns {TableMessage} The current instance of TableMessage.
   */
  public setRows(rows: Row[]): this {
    this.rows = rows;
    return this;
  }

  /**
   * Adds a row to the table.
   * @param {Row} row The row to add.
   * @returns {TableMessage} The current instance of TableMessage.
   */
  public addRow(row: Row): this {
    this.rows.push(row);
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
   * @param {PaginationInfo} paginationInfo The pagination information.
   * @returns {TableMessage} The current instance of TableMessage.
   */
  public setPaginationInfo(paginationInfo: PaginationInfo): this {
    this.paginationInfo = paginationInfo;
    return this;
  }

}
