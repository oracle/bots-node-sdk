import { ReadOnlyField } from '../internal';

/**
 * Represents a text field.
 * @extends ReadOnlyField
 */
export class TextField extends ReadOnlyField {
  public readonly displayType: string = 'text';
  // properties below will be added in 23.08
  // private truncateAt?: number;
  // private fontSize?: FontSize;
  // private fontWeight?: FontWeight;

  /**
   * Creates an instance of the TextField class.
   * @param {string} id The unique identifier of the field.
   * @param {string} label The label of the field.
   * @param {any} value The value of the field
   */
  constructor(label: string, value: any) {
    super();
    this.setLabel(label);
    this.setValue(value);
  }

  // /**
  //  * Gets the truncateAt value of the field.
  //  * @returns The truncateAt value of the field.
  //  */
  // public getTruncateAt(): number {
  //   return this.truncateAt;
  // }

  // /**
  //  * Sets the truncateAt value of the field.
  //  * @param truncateAt The truncateAt value to set.
  //  * @returns The updated instance of the TextField.
  //  */
  // public setTruncateAt(truncateAt: number): this {
  //   this.truncateAt = truncateAt;
  //   return this;
  // }

  // /**
  //  * Gets the fontSize value of the field.
  //  * @returns The fontSize value of the field.
  //  */
  // public getFontSize(): FontSize {
  //   return this.fontSize;
  // }

  // /**
  //  * Sets the fontSize value of the field.
  //  * @param fontSize The fontSize value to set.
  //  * @returns The updated instance of the TextField.
  //  */
  // public setFontSize(fontSize: FontSize): this {
  //   this.fontSize = fontSize;
  //   return this;
  // }

  // /**
  //  * Gets the fontWeight value of the field.
  //  * @returns The fontWeight value of the field.
  //  */
  // public getFontWeight(): FontWeight {
  //   return this.fontWeight;
  // }

  // /**
  //  * Sets the fontWeight value of the field.
  //  * @param fontWeight The fontWeight value to set.
  //  * @returns The updated instance of the TextField.
  //  */
  // public setFontWeight(fontWeight: FontWeight): this {
  //   this.fontWeight = fontWeight;
  //   return this;
  // }
}

