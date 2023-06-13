import { Field, FieldAlignment  } from '../internal';

/**
 * Represents a read-only field.
 * @extends Field
 */
export abstract class ReadOnlyField extends Field {
  private value?: any;
  private width?: number;
  private alignment?: FieldAlignment;

  /**
   * Gets the value of the read-only field.
   * @returns {any} The value of the field.
   */
  public getValue(): any {
    return this.value;
  }

  /**
   * Sets the value of the read-only field.
   * @param {any} value The value to set.
   * @returns The current instance of the ReadOnlyField class.
   */
  public setValue(value: any): this {
    this.value = value;
    return this;
  }

  /**
   * Gets the width of the read-only field.
   * @returns {number} The width value.
   */
  public getWidth(): number {
    return this.width;
  }

  /**
   * Sets the width of the read-only field.
   * @param {number} width The width value to set.
   * @returns The current instance of the ReadOnlyField class.
   */
  public setWidth(width: number): this {
    this.width = width;
    return this;
  }

  /**
   * Gets the alignment of the read-only field.
   * @returns {FieldAlignment} The alignment value.
   */
  public getAlignment(): FieldAlignment {
    return this.alignment;
  }

  /**
   * Sets the alignment of the read-only field.
   * @param {FieldAlignment} alignment The alignment value to set.
   * @returns The current instance of the ReadOnlyField class.
   */
  public setAlignment(alignment: FieldAlignment): this {
    this.alignment = alignment;
    return this;
  }

}

