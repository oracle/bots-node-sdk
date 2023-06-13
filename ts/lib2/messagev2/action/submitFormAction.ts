import { Action } from '../internal';

/**
 * Represents a submit form action.
 * @extends Action
 */
export class SubmitFormAction extends Action {
  public readonly type = 'submitForm';
  private postback?: object;

  /**
   * Creates a new instance of the SubmitFormAction class.
   * @param label - The label of the submit form action.
   * @param postback - The postback object associated with the action.
   */
  constructor(label: string, postback?: object) {
    super(label);
    this.postback = postback;
  }

  /**
   * Get the postback object associated with the submit form action.
   * @returns The postback object.
   */
  public getPostback(): object {
    return this.postback;
  }

  /**
   * Set the postback object for the submit form action.
   * @param postback - The postback object to set.
   * @returns The current instance of the SubmitFormAction class.
   */
  public setPostback(postback: object): this {
    this.postback = postback;
    return this;
  }

}


