import { FieldAlignment, ChannelCustomizable } from '../internal';

/**
 * Represents a table heading element.
 * @extends ChannelCustomizable
 */
export class TableHeading extends ChannelCustomizable {
  private label: string;
  private width?: number;
  private alignment: FieldAlignment = FieldAlignment.left;

  /**
   * Creates an instance of the TableHeading class.
   * @param {string} label The label of the table heading.
   */
  constructor(label: string) {
    super();
    this.label = label;
  }

  /**
   * Gets the label of the table heading.
   * @returns {string} The label.
   */
  public getLabel(): string {
    return this.label;
  }

  /**
   * Sets the label of the table heading.
   * @param {string} label The label to set.
   * @returns {TableHeading} The updated instance of the TableHeading.
   */
  public setLabel(label: string): this {
    this.label = label;
    return this;
  }

  /**
   * Gets the width of the table heading.
   * @returns {number} The width.
   */
  public getWidth(): number {
    return this.width;
  }

  /**
   * Sets the width of the table heading.
   * @param {number} width The width to set.
   * @returns {TableHeading} The updated instance of the TableHeading.
   */
  public setWidth(width: number): this {
    this.width = width;
    return this;
  }

  /**
   * Gets the alignment of the table heading.
   * @returns {FieldAlignment} The alignment.
   */
  public getAlignment(): FieldAlignment {
    return this.alignment;
  }

  /**
   * Sets the alignment of the table heading.
   * @param {FieldAlignment} alignment The alignment to set.
   * @returns {TableHeading} The updated instance of the TableHeading.
   */
  public setAlignment(alignment: FieldAlignment): this {
    this.alignment = alignment;
    return this;
  }
}
