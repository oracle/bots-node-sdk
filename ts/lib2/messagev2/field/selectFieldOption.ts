import { ChannelCustomizable } from '../internal';

/**
 * Represents an option for a select field.
 */
export class SelectFieldOption extends ChannelCustomizable {
  private label: string;
  private value: any;
  private imageUrl?: string;

  /**
   * Creates an instance of the SelectFieldOption class.
   * @param {string} label The label of the option.
   * @param {any} value The value of the option. If not specified, the label is used as value.
   */
  constructor(label: string, value?: any) {
    super();
    this.label = label;
    this.value = value || label;
  }

  /**
   * Gets the label of the option.
   * @returns {string} The label of the option.
   */
  public getLabel(): string {
    return this.label;
  }

  /**
   * Sets the label of the option.
   * @param {string} label The label to set.
   * @returns The updated instance of the SelectFieldOption.
   */
  public setLabel(label: string): this {
    this.label = label;
    return this;
  }

  /**
   * Gets the value of the option.
   * @returns {any} The value of the option.
   */
  public getValue(): any {
    return this.value;
  }

  /**
   * Sets the value of the option.
   * @param {any} value The value to set.
   * @returns The updated instance of the SelectFieldOption.
   */
  public setValue(value: any): this {
    this.value = value;
    return this;
  }

  /**
   * Gets the image URL of the option.
   * @returns {string} The image URL of the option.
   */
  public getImageUrl(): string {
    return this.imageUrl;
  }

  /**
   * Sets the image URL of the option.
   * @param {string} imageUrl The image URL to set.
   * @returns The updated instance of the SelectFieldOption.
   */
  public setImageUrl(imageUrl: string): this {
    this.imageUrl = imageUrl;
    return this;
  }

}
