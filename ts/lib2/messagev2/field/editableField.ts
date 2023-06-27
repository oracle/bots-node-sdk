import {Field } from '../internal';


/**
 * Represents an editable field.
 * @extends Field
 */
export abstract class EditableField extends Field {
  private placeholder?: string;
  private required?: boolean;
  private clientErrorMessage?: string;
  private serverErrorMessage?: string;
  private autoSubmit?: boolean;

  /**
   * Creates an instance of EditableField.
   * @param {string} id The ID of the editable field.
   */
  protected constructor(id: string) {
    super();
    this.setId(id);
  }

  /**
   * Gets the placeholder value of the editable field.
   * @returns {string} The placeholder value.
   */
  public getPlaceholder(): string {
    return this.placeholder;
  }

  /**
   * Sets the placeholder value of the editable field.
   * @param {string} placeholder The placeholder value to set.
   * @returns The current instance of the EditableField class.
   */
  public setPlaceholder(placeholder: string): this {
    this.placeholder = placeholder;
    return this;
  }

  /**
   * Gets the required flag of the editable field.
   * @returns {boolean} The required flag value.
   */
  public getRequired(): boolean {
    return this.required;
  }

  /**
   * Sets the required flag of the editable field.
   * @param {boolean} required The required flag value to set.
   * @returns The current instance of the EditableField class.
   */
  public setRequired(required: boolean): this {
    this.required = required;
    return this;
  }

  /**
   * Gets the client error message of the editable field.
   * @returns {string} The client error message.
   */
  public getClientErrorMessage(): string {
    return this.clientErrorMessage;
  }

  /**
   * Sets the client error message of the editable field.
   * @param {string} clientErrorMessage The client error message to set.
   * @returns The current instance of the EditableField class.
   */
  public setClientErrorMessage(clientErrorMessage: string): this {
    this.clientErrorMessage = clientErrorMessage;
    return this;
  }

  /**
   * Gets the server error message of the editable field.
   * @returns {string} The server error message.
   */
  public getServerErrorMessage(): string {
    return this.serverErrorMessage;
  }

  /**
   * Sets the server error message of the editable field.
   * @param {string} serverErrorMessage The server error message to set.
   * @returns The current instance of the EditableField class.
   */
  public setServerErrorMessage(serverErrorMessage: string): this {
    this.serverErrorMessage = serverErrorMessage;
    return this;
  }

  /**
   * Gets the auto submit flag of the editable field.
   * @returns {boolean} The auto submit flag value.
   */
  public getAutoSubmit(): boolean {
    return this.autoSubmit;
  }

  /**
   * Sets the auto submit flag of the editable field.
   * @param {boolean} autoSubmit The auto submit flag value to set.
   * @returns The current instance of the EditableField class.
   */
  public setAutoSubmit(autoSubmit: boolean): this {
    this.autoSubmit = autoSubmit;
    return this;
  }

}
