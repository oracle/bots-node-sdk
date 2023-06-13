import { ReadOnlyField } from '../internal';

/**
 * Represents a media field.
 * @extends ReadOnlyField
 */
export class MediaField extends ReadOnlyField {
  public readonly displayType: string = 'media';
  private mediaType: MediaType;

  /**
   * Creates an instance of the MediaField class.
   * @param {string} label The label of the field.
   * @param {string} value The URL value of the field
   * @param {MediaType} mediaType The media type for the field.
   */
  constructor(label: string, value: string, mediaType: MediaType) {
    super();
    this.setLabel(label);
    this.setValue(value);
    this.mediaType = mediaType;
  }

  /**
   * Gets the media type.
   * @returns {MediaType} The media type.
   */
  public getMediaType(): MediaType {
    return this.mediaType;
  }

  /**
   * Sets the media type.
   * @param {MediaType} mediaType The media type to set.
   * @returns The updated instance of the MediaField.
   */
  public setMediaType(mediaType: MediaType): this {
    this.mediaType = mediaType;
    return this;
  }

}

/**
 * Represents the media type.
 */
export enum MediaType {
  image = 'image',
  video = 'video',
  audio = 'audio',
}
