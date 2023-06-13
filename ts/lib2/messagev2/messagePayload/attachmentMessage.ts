import { NonRawMessage, MessageUtil } from '../internal';

/**
 * Represents an attachment message.
 */
export class AttachmentMessage extends NonRawMessage {
  public readonly type: string = 'attachment';
  private attachment: Attachment;

  /**
   * Deserialize nested object properties into corresponding class instances
   */
  public deserializeNestedProperties(): void {
      super.deserializeNestedProperties();
      this.attachment = MessageUtil.deserializeAttachment(this.attachment);
  }

  /**
   * Constructs an AttachmentMessage object with the specified attachment.
   * @param {Attachment} attachment The attachment of the message (required).
   */
  constructor(attachment: Attachment) {
    super();
    this.attachment = attachment;
  }

  /**
   * Gets the attachment of the message.
   * @returns {Attachment} The attachment of the message.
   */
  public getAttachment(): Attachment {
    return this.attachment;
  }

  /**
   * Sets the attachment of the message.
   * @param {Attachment} attachment The attachment of the message.
   * @returns This AttachmentMessage instance.
   */
  public setAttachment(attachment: Attachment): this {
    this.attachment = attachment;
    return this;
  }

}

/**
 * Represents an attachment.
 */
export class Attachment {
  private type: AttachmentType;
  private url: string;
  private title?: string;

  /**
   * Constructs an Attachment object with the specified type and URL.
   * @param type The type of the attachment (required).
   * @param url The URL of the attachment (required).
   */
  constructor(type: AttachmentType, url: string) {
    this.type = type;
    this.url = url;
  }

  /**
   * Gets the type of the attachment.
   * @returns The type of the attachment.
   */
  public getType(): AttachmentType {
    return this.type;
  }

  /**
   * Sets the type of the attachment.
   * @param type The type of the attachment.
   * @returns This Attachment instance.
   */
  public setType(type: AttachmentType): this {
    this.type = type;
    return this;
  }

  /**
   * Gets the URL of the attachment.
   * @returns The URL of the attachment.
   */
  public getUrl(): string {
    return this.url;
  }

  /**
   * Sets the URL of the attachment.
   * @param url The URL of the attachment.
   * @returns This Attachment instance.
   */
  public setUrl(url: string): this {
    this.url = url;
    return this;
  }

  /**
   * Gets the title of the attachment.
   * @returns The title of the attachment.
   */
  public getTitle(): string | undefined {
    return this.title;
  }

  /**
   * Sets the title of the attachment.
   * @param title The title of the attachment.
   * @returns This Attachment instance.
   */
  public setTitle(title: string): this {
    this.title = title;
    return this;
  }
}

/**
 * Represents the type of an attachment.
 */
export enum AttachmentType {
  file = 'file',
  video = 'video',
  audio = 'audio',
  image = 'image',
}
