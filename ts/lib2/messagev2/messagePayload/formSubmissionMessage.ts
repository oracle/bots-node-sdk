import { NonRawMessage } from '../internal';

/**
 * Represents a form submission message sent by the user.
 * @extends NonRawMessage
 */
export class FormSubmissionMessage extends NonRawMessage {
  /**
   * The type of the message.
   */
  public readonly type: string = 'formSubmission';

  private submittedFields: Map<string, any>;
  private partialSubmitField: string;
  private postback: object;

  /**
   * Creates a new instance of FormSubmissionMessage.
   */
  constructor() {
    super();
  }

  /**
   * Gets the submitted fields.
   * @returns The submitted fields.
   */
  public getSubmittedFields(): Map<string, any> {
    return this.submittedFields;
  }

  /**
   * Get a submitted field value.
   * @param {string} id The id of the field.
   * @returns The submitted field value.
   */
  public getSubmittedField(id: string): any {
    return this.submittedFields ? this.submittedFields[id] : undefined;
  }

  /**
   * Gets the partial submit field.
   * @returns The partial submit field.
   */
  public getPartialSubmitField(): string {
    return this.partialSubmitField;
  }

  /**
   * Gets the postback.
   * @returns The postback.
   */
  public getPostback(): object {
    return this.postback;
  }
}
