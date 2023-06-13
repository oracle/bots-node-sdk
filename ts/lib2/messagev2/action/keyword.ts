/**
 * Represents a keyword.
 */
export class Keyword {
  private postback: any;
  private keywords?: string[];
  private skipAutoNumber?: boolean;

  /**
   * Creates an instance of Keyword.
   * @param postback - The postback to set.
   * @param keywords - The keywords to set.
   */
  constructor(postback: any, keywords?: string[]) {
    this.postback = postback;
    if (keywords) {
      this.keywords = keywords
    }
  }

  /**
   * Gets the postback associated with the keyword.
   * @returns The postback associated with the keyword.
   */
  public getPostback(): any {
    return this.postback;
  }

  /**
   * Sets the postback associated with the keyword.
   * @param postback - The postback to set.
   * @returns The current instance of the Keyword class.
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
   * @returns The current instance of the Keyword class.
   */
  public setKeywords(keywords: string[]): this {
    this.keywords = keywords;
    return this;
  }

  /**
   * Adds a keyword.
   * @param keyword - The keyword to add.
   * @returns The current instance of the Keyword class.
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
   * @returns The current instance of the Keyword class.
   */
  public setSkipAutoNumber(skipAutoNumber: boolean): this {
    this.skipAutoNumber = skipAutoNumber;
    return this;
  }

}



