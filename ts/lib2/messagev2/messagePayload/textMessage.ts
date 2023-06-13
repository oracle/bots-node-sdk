import { NonRawMessage } from '../internal';

/**
 * Represents a text message.
 * @extends NonRawMessage
 */
export class TextMessage extends NonRawMessage {
  public readonly type: string = 'text';
  private text: string;


  /**
   * Create a new TextMessage object.
   * @param {string} text - The text content of the message.
   */
  constructor(text: string) {
    super();
    this.text = text;
  }

  /**
   * Get the text content of the message.
   * @returns {string} The message text.
   */
  public getText(): string {
    return this.text;
  }

  /**
   * Set the text content of the message.
   * @param {string} text - The text to set.
   * @returns {TextMessage} The current instance of the TextMessage class.
   */
  public setText(text: string): this {
    this.text = text;
    return this;
  }
}
