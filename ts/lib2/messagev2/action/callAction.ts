import { Action } from '../internal';

/**
 * Represents a call action.
 * @extends Action
 */
export class CallAction extends Action {
  public readonly type: string = 'call';
  private phoneNumber: string;

  /**
   * Creates an instance of CallAction.
   * @param label - The label of the call action.
   * @param phoneNumber - The phone number associated with the call action.
   */
  constructor(label: string, phoneNumber: string) {
    super(label);
    this.phoneNumber = phoneNumber;
  }

  /**
   * Gets the phone number associated with the call action.
   * @returns The phone number associated with the call action.
   */
  public getPhoneNumber(): string {
    return this.phoneNumber;
  }

  /**
   * Sets the phone number associated with the call action.
   * @param phoneNumber - The phone number to set.
   * @returns The current instance of the CallAction class.
   */
  public setPhoneNumber(phoneNumber: string): this {
    this.phoneNumber = phoneNumber;
    return this;
  }

}




