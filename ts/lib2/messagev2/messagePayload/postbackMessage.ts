import { NonRawMessage } from '../internal';

/**
 * Represents a postback message.
 * @extends NonRawMessage
 */
export class PostbackMessage extends NonRawMessage {

  public readonly type: string = 'postback';
  private postback: any;

  /**
   * Creates a new instance of PostbackMessage.
   */
  constructor() {
    super();
  }

  /**
   * Gets the postback.
   * @returns The postback.
   */
  public getPostback(): any {
    return this.postback;
  }

}
