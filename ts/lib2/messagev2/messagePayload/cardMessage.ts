import { NonRawMessage, MessageUtil, Action, Voice, ChannelCustomizable } from '../internal';

/**
 * Represents the layout of a card.
 */
export enum CardLayout {
  horizontal = 'horizontal',
  vertical = 'vertical',
}

/**
 * Represents a card message.
 * @extends NonRawMessage
 */
export class CardMessage extends NonRawMessage {
  public readonly type: string = 'card';
  private layout: CardLayout = CardLayout.horizontal;
  private cards: Card[] = [];

  /**
   * Deserialize nested object properties into corresponding class instances
   */
  public deserializeNestedProperties(): void {
    super.deserializeNestedProperties();
    if (this.cards) {
      this.cards = MessageUtil.deserializeCards(this.cards);
    }
  }

  /**
   * Creates a new card message.
   * @param {Card[]} cards The cards of the message.
   * @returns {CardMessage} A new instance of the CardMessage.
   */
  constructor(cards?: Card[]) {
    super();
    if (cards) {
      this.cards = cards;
    }
  }

  /**
   * Gets the layout of the card message.
   * @returns {CardLayout} The layout of the card message.
   */
  public getLayout(): CardLayout {
    return this.layout;
  }

  /**
   * Sets the layout of the card message.
   * @param {CardLayout} layout The layout of the card message.
   * @returns {CardMessage} This card message instance.
   */
  public setLayout(layout: CardLayout): this {
    this.layout = layout;
    return this;
  }

  /**
   * Gets the list of cards in the card message.
   * @returns {Card[]} The list of cards in the card message.
   */
  public getCards(): Card[] {
    return this.cards;
  }

  /**
   * Sets the cards of the card message.
   * @param {Card[]} cards The cards of the card message.
   * @returns {CardMessage} This card message instance.
   */
  public setCards(cards: Card[]): this {
    this.cards = cards;
    return this;
  }

  /**
   * Adds a card to the card message.
   * @param {Card} card The card to add.
   * @returns {CardMessage} This card message instance.
   */
  public addCard(card: Card): this {
    this.cards.push(card);
    return this;
  }
}

/**
 * Represents a card.
 * @extends ChannelCustomizable
 */
export class Card extends ChannelCustomizable {
  private id: string;
  private title: string;
  private description: string;
  private voice: Voice;
  private imageUrl: string;
  private url: string;
  private actions: Action[];

  /**
   * Deserialize nested object properties into corresponding class instances
   */
  public deserializeNestedProperties(): void {
    super.deserializeNestedProperties();
    if (this.voice) {
      this.voice = MessageUtil.deserializeVoice(this.voice);
    }
    if (this.actions) {
      this.actions = MessageUtil.deserializeActions(this.actions);
    }
  }

  /**
   * Constructs a Card object with the specified title.
   * @param {string} title The title of the card (required).
   */
  constructor(title: string) {
    super();
    this.title = title;
  }

  /**
   * Gets the ID of the card.
   * @returns {string} The ID of the card.
   */
  public getId(): string {
    return this.id;
  }

  /**
   * Sets the ID of the card.
   * @param {string} id The ID of the card.
   * @returns {Card} This Card instance.
   */
  public setId(id: string): this {
    this.id = id;
    return this;
  }

  /**
   * Gets the title of the card.
   * @returns {string} The title of the card.
   */
  public getTitle(): string {
    return this.title;
  }

  /**
   * Sets the title of the card.
   * @param {string} title The title of the card.
   * @returns {Card} This Card instance.
   */
  public setTitle(title: string): this {
    this.title = title;
    return this;
  }

  /**
   * Gets the description of the card.
   * @returns {string} The description of the card.
   */
  public getDescription(): string {
    return this.description;
  }

  /**
   * Sets the description of the card.
   * @param {string} description The description of the card.
   * @returns {Card} This Card instance.
   */
  public setDescription(description: string): this {
    this.description = description;
    return this;
  }

  /**
   * Gets the voice settings of the card.
   * @returns {Voice} the voice settings of the card.
   */
  public getVoice(): Voice {
    return this.voice;
  }

  /**
   * Sets the voice settings of the card.
   * @param {Voice} voice the voice settings of the card.
   * @returns {Card} This Card instance.
   */
  public setVoice(voice: Voice): this {
    this.voice = voice;
    return this;
  }

  /**
   * Gets the image URL of the card.
   * @returns {string} The image URL of the card.
   */
  public getImageUrl(): string {
    return this.imageUrl;
  }

  /**
   * Sets the image URL of the card.
   * @param {string} imageUrl The image URL of the card.
   * @returns {Card} This Card instance.
   */
  public setImageUrl(imageUrl: string): this {
    this.imageUrl = imageUrl;
    return this;
  }

  /**
   * Gets the URL of the card.
   * @returns {string} The URL of the card.
   */
  public getUrl(): string {
    return this.url;
  }

  /**
   * Sets the URL of the card.
   * @param {string} url The URL of the card.
   * @returns {Card} This Card instance.
   */
  public setUrl(url: string): this {
    this.url = url;
    return this;
  }

  /**
   * Gets the actions of the card.
   * @returns {Action[]} The actions of the card.
   */
  public getActions(): Action[] {
    return this.actions;
  }

  /**
   * Adds an action to the card.
   * @param {Action} action The action to add.
   * @returns {Card} This Card instance.
   */
  public addAction(action: Action): this {
    if (!this.actions) {
      this.actions = [];
    }
    this.actions.push(action);
    return this;
  }

}
