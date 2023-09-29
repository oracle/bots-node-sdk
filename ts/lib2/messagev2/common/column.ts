import { MessageUtil, Field, ChannelCustomizable } from '../internal';

/**
 * Represents a column
 * @extends ChannelCustomizable
 */
export class Column extends ChannelCustomizable {

  private id?: string;
  private fields: Field[] = [];
  private verticalAlignment?: VerticalAlignment;
  private width?: ColumnWidth;

  /**
   * Deserialize nested object properties into corresponding class instances
   */
  public deserializeNestedProperties(): void {
    super.deserializeNestedProperties();
    this.fields = MessageUtil.deserializeFields(this.fields);
  }

  /**
   * Creates an instance of the Column class.
   * @param {Field[]} [fields] The list of fields in the column.
   */
  constructor(fields?: Field[]) {
    super();
    if (fields) {
      this.fields = fields;
    }
  }

  /**
   * Gets the ID of the column.
   * @returns {string} The ID of the column.
   */
  public getId(): string {
    return this.id;
  }

  /**
   * Sets the ID of the column.
   * @param {string} id The ID to set.
   * @returns {Column} The updated instance of the Column.
   */
  public setId(id: string): this {
    this.id = id;
    return this;
  }

  /**
   * Gets the list of fields in the column.
   * @returns {Field[]} The list of fields in the column.
   */
  public getFields(): Field[] {
    return this.fields;
  }

  /**
   * Sets the fields of the column.
   * @param {Field[]} fields The fields to set.
   * @returns {Column} The updated instance of the Column.
   */
  public setFields(fields: Field[]): this {
    this.fields = fields;
    return this;
  }

  /**
   * Adds a field to the column.
   * @param {Field} field The field to add.
   * @returns {Column} The updated instance of the Column.
   */
  public addField(field: Field): this {
    this.fields.push(field);
    return this;
  }

  /**
   * Gets the width of the column.
   * @returns {ColumnWidth} The width.
   */
  public getWidth(): ColumnWidth {
    return this.width;
  }

  /**
   * Sets the width of the column.
   * @param {string} width The width to set.
   * @returns {Column} The updated instance of the Column.
   */
  public setWidth(width: ColumnWidth): this {
    this.width = width;
    return this;
  }

  /**
   * Gets the vertical alignment of the column.
   * @returns {VerticalAlignment} The alignment.
   */
  public getVerticalAlignment(): VerticalAlignment {
    return this.verticalAlignment;
  }

  /**
   * Sets the vertical alignment of the column.
   * @param {string} verticalAlignment The alignment to set.
   * @returns {Column} The updated instance of the Column.
   */
  public setVerticalAlignment(verticalAlignment: VerticalAlignment): this {
    this.verticalAlignment = verticalAlignment;
    return this;
  }


}

/**
 * Represents the column width
 */
export enum ColumnWidth {
  auto = 'auto',
  stretch = 'stretch'
}

/**
 * Represents the vertical column aligment
 */
export enum VerticalAlignment {
  top = 'top',
  center = 'center',
  bottom = 'bottom'
}
