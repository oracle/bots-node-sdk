import { ReadOnlyField } from '../internal';

/**
 * Represents a link field.
 * @extends ReadOnlyField
 */
export class LinkField extends ReadOnlyField {
  public readonly displayType: string = 'link';
  private linkLabel?: string;
  // properties below will be added in 23.08
  // private imageUrl?: string;

  /**
   * Creates an instance of the LinkField class.
   * @param {string} label The label of the link field.
   * @param {string} value The value of the link field.
   * @param {string} linkLabel The link label of the link field.
   */
  constructor(label: string, value: string, linkLabel?: string) {
    super();
    this.setLabel(label);
    this.setValue(value);
    this.linkLabel = linkLabel;
  }

  /**
   * Gets the link label of the link field.
   * @returns {string} The link label of the link field.
   */
  public getLinkLabel(): string {
    return this.linkLabel;
  }

  /**
   * Sets the link label of the link field.
   * @param {string} linkLabel The link label to set.
   * @returns The updated instance of the LinkField.
   */
  public setLinkLabel(linkLabel: string): this {
    this.linkLabel = linkLabel;
    return this;
  }

  // /**
  //  * Gets the image URL of the link field.
  //  * @returns The image URL of the link field.
  //  */
  // public getImageUrl(): string {
  //   return this.imageUrl;
  // }

  // /**
  //  * Sets the image URL of the link field.
  //  * @param imageUrl The image URL to set.
  //  * @returns The updated instance of the LinkField.
  //  */
  // public setImageUrl(imageUrl: string): this {
  //   this.imageUrl = imageUrl;
  //   return this;
  // }
}
