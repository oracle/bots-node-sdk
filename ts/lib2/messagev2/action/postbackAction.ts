import { Action } from '../internal';

/**
 * Represents a postback action.
 * @extends Action
 */
export class PostbackAction extends Action {
  public readonly type: string = 'postback';
  private postback: any;
  private keywords?: string[];
  private skipAutoNumber?: boolean;

  /**
   * Creates an instance of PostbackAction.
   * @param label - The label of the postback action.
   * @param postback - The postback associated with the action.
   */
  constructor(label: string, postback: any) {
    super(label);
    this.postback = postback;
  }

  /**
   * Gets the postback associated with the action.
   * @returns The postback associated with the action.
   */
  public getPostback(): any {
    return this.postback;
  }

  /**
   * Sets the postback associated with the action.
   * @param postback - The postback to set.
   * @returns The current instance of the PostbackAction class.
   */
  public setPostback(postback: any): this {
    this.postback = postback;
    return this;
  }

  /**
   * Gets the keywords.
   * @returns The keywords.
   */
  public getKeywords(): string[] {
    return this.keywords;
  }

  /**
   * Sets the keywords.
   * @param keywords - The keywords to set.
   * @returns The current instance of the PostbackAction class.
   */
  public setKeywords(keywords: string[]): this {
    this.keywords = keywords;
    return this;
  }

  /**
   * Adds a keyword.
   * @param keyword - The keyword to add.
   * @returns The current instance of the PostbackAction class.
   */
  public addKeyword(keyword: string): this {
    if (!this.keywords) {
      this.keywords = [];
    }
    this.keywords.push(keyword);
    return this;
  }

  /**
   * Gets the skipAutoNumber flag.
   * @returns The skipAutoNumber flag.
   */
  public getSkipAutoNumber(): boolean {
    return this.skipAutoNumber;
  }

  /**
   * Sets the skipAutoNumber flag.
   * @param skipAutoNumber - The skipAutoNumber flag to set.
   * @returns The current instance of the PostbackAction class.
   */
  public setSkipAutoNumber(skipAutoNumber: boolean): this {
    this.skipAutoNumber = skipAutoNumber;
    return this;
  }

}


