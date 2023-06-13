import { ChannelCustomizable } from '../internal';

/**
 * Represents an abstract field.
 * @extends ChannelCustomizable
 */
export abstract class Field extends ChannelCustomizable {
  private label?: string;
  private id?: string;
  // properties below will be added in 23.08
  // private marginTop: Margin;
  // private labelFontSize: FontSize;
  // private labelFontWeight: FontWeight;

  /**
   * Gets the label of the field.
   * @returns {string} The label of the field.
   */
  public getLabel(): string {
    return this.label;
  }

  /**
   * Sets the label of the field.
   * @param {string} label The label of the field.
   * @returns This Field instance.
   */
  public setLabel(label: string): this {
    this.label = label;
    return this;
  }

  /**
   * Gets the ID of the field.
   * @returns {string} The ID of the field.
   */
  public getId(): string {
    return this.id;
  }

  /**
   * Sets the ID of the field.
   * @param {string} id The ID of the field.
   * @returns This Field instance.
   */
  public setId(id: string): this {
    this.id = id;
    return this;
  }

  // /**
  //  * Gets the margin top value of the field.
  //  * @returns The margin top value of the field.
  //  */
  // public getMarginTop(): Margin {
  //   return this.marginTop;
  // }

  // /**
  //  * Sets the margin top value of the field.
  //  * @param marginTop The margin top value of the field.
  //  * @returns This Field instance.
  //  */
  // public setMarginTop(marginTop: Margin): this {
  //   this.marginTop = marginTop;
  //   return this;
  // }

  // /**
  //  * Gets the label font size of the field.
  //  * @returns The label font size of the field.
  //  */
  // public getLabelFontSize(): FontSize {
  //   return this.labelFontSize;
  // }

  // /**
  //  * Sets the label font size of the field.
  //  * @param labelFontSize The label font size of the field.
  //  * @returns This Field instance.
  //  */
  // public setLabelFontSize(labelFontSize: FontSize): this {
  //   this.labelFontSize = labelFontSize;
  //   return this;
  // }

  // /**
  //  * Gets the label font weight of the field.
  //  * @returns The label font weight of the field.
  //  */
  // public getLabelFontWeight(): FontWeight {
  //   return this.labelFontWeight;
  // }

  // /**
  //  * Sets the label font weight of the field.
  //  * @param labelFontWeight The label font weight of the field.
  //  * @returns This Field instance.
  //  */
  // public setLabelFontWeight(labelFontWeight: FontWeight): this {
  //   this.labelFontWeight = labelFontWeight;
  //   return this;
  // }

}

/**
 * Represents the font size options for a field.
 */
export enum FontSize {
  small = 'small',
  medium = 'medium',
  large = 'large',
}

/**
 * Represents the font weight options for a field.
 */
export enum FontWeight {
  light = 'light',
  medium = 'medium',
  bold = 'bold',
}

/**
 * Represents the margin options for a field.
 */
export enum Margin {
  none = 'none',
  medium = 'medium',
  large = 'large',
}

