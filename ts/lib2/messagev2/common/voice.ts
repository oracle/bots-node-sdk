/**
 * Represents the voice settings of a message element.
 */
export class Voice {
  private text: string;
  private soundUrl?: string;
  private longText?: string;

  /**
   * Constructs a Voice object with the specified text.
   * @param {string} text The text of the voice (required).
   */
  constructor(text: string) {
    this.text = text;
  }

  /**
   * Gets the text of the voice.
   * @returns {string} The text of the voice.
   */
  public getText(): string {
    return this.text;
  }

  /**
   * Sets the text of the voice.
   * @param {string} text The text of the voice.
   * @returns {Voice} This Voice instance.
   */
  public setText(text: string): this {
    this.text = text;
    return this;
  }

  /**
   * Gets the sound URL of the voice.
   * @returns {string} The sound URL of the voice.
   */
  public getSoundUrl(): string {
    return this.soundUrl;
  }

  /**
   * Sets the sound URL of the voice.
   * @param {string} soundUrl The sound URL of the voice.
   * @returns {Voice} This Voice instance.
   */
  public setSoundUrl(soundUrl: string): this {
    this.soundUrl = soundUrl;
    return this;
  }

  /**
   * Gets the long text of the voice.
   * @returns {string} The long text of the voice.
   */
  public getLongText(): string {
    return this.longText;
  }

  /**
   * Sets the long text of the voice.
   * @param {string} longText The long text of the voice.
   * @returns {Voice} This Voice instance.
   */
  public setLongText(longText: string): this {
    this.longText = longText;
    return this;
  }
}



