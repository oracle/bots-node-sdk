import { Voice, ChannelCustomizable, MessageUtil } from '../internal';

/**
 * Represents an action.
 * @extends ChannelCustomizable
 */
export class Action extends ChannelCustomizable {
  private id?: string;
  private label?: string;
  private voice?: Voice;
  private imageUrl?: string;
  private style?: ActionStyle;
  private displayType?: DisplayType;

  /**
   * Deserialize nested object properties into corresponding class instances
   */
  public deserializeNestedProperties(): void {
    super.deserializeNestedProperties();
    if (this.voice) {
      this.voice = MessageUtil.deserializeVoice(this.voice);
    }
  }

  /**
   * Creates an instance of Action.
   * @param {string} label - The label of the action.
   */
  constructor(label?: string) {
    super();
    this.label = label;
  }

  /**
   * Gets the ID of the action.
   * @returns {string} The ID of the action.
   */
  public getId(): string {
    return this.id;
  }

  /**
   * Sets the ID of the action.
   * @param {string} id - The ID to set.
   */
  public setId(id: string): this {
    this.id = id;
    return this;
  }

  /**
   * Gets the label of the action.
   * @returns {string} The label of the action.
   */
  public getLabel(): string {
    return this.label;
  }

  /**
   * Sets the label of the action.
   * @param {string} label - The label to set.
   * @returns The current instance of the Action class.
   */
  public setLabel(label: string): this {
    this.label = label;
    return this;
  }

  /**
   * Gets the voice settings associated with the action.
   * @returns {Voice} The voice settings associated with the action.
   */
  public getVoice(): Voice {
    return this.voice;
  }

  /**
   * Sets the voice settings associated with the action.
   * @param {Voice} voice - The voice to set.
   * @returns The current instance of the Action class.
   */
  public setVoice(voice: Voice): this {
    this.voice = voice;
    return this;
  }

  /**
   * Gets the image URL of the action.
   * @returns {string} The image URL of the action.
   */
  public getImageUrl(): string {
    return this.imageUrl;
  }

  /**
   * Sets the image URL of the action.
   * @param {string} imageUrl - The image URL to set.
   * @returns The current instance of the Action class.
   */
  public setImageUrl(imageUrl: string): this {
    this.imageUrl = imageUrl;
    return this;
  }

  /**
   * Gets the style of the action.
   * @returns {string} The style of the action.
   */
  public getStyle(): ActionStyle {
    return this.style;
  }

  /**
   * Sets the style of the action.
   * @param {string} style - The style to set.
   * @returns The current instance of the Action class.
   */
  public setStyle(style: ActionStyle): this {
    this.style = style;
    return this;
  }

  /**
   * Gets the style of the action.
   * @returns {DisplayType} The display type of the action.
   */
  public getDisplayType(): DisplayType {
    return this.displayType;
  }

  /**
   * Sets the display type of the action.
   * @param {DisplayType} displayType - The display type to set.
   * @returns The current instance of the Action class.
   */
  public setDisplayType(displayType: DisplayType): this {
    this.displayType = displayType;
    return this;
  }

}

/**
 * Represents the style of an action.
 */
export enum ActionStyle {
  primary = 'primary',
  danger = 'danger',
}

/**
 * Represents the display type of an action.
 */
export enum DisplayType {
  button = 'button',
  link = 'link',
  icon = 'icon',
}

