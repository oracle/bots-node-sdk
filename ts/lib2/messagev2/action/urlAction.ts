import { Action } from '../internal';

/**
 * Represents a URL action.
 * @extends Action
 */
export class UrlAction extends Action {
  public readonly type = 'url';
  private url: string;

  /**
   * Creates a new instance of the UrlAction class.
   * @param label - The label of the URL action.
   * @param url - The URL associated with the action.
   */
  constructor(label: string, url: string) {
    super(label);
    this.url = url;
  }

  /**
   * Get the URL associated with the URL action.
   * @returns The URL.
   */
  public getUrl(): string {
    return this.url;
  }

  /**
   * Set the URL for the URL action.
   * @param url - The URL to set.
   * @returns The current instance of the UrlAction class.
   */
  public setUrl(url: string): this {
    this.url = url;
    return this;
  }

}

