import { EditableField } from '../internal';

/**
 * Represents a text input field.
 * @extends EditableField
 */
export class TextInputField extends EditableField {
  public readonly displayType: string = 'textInput';
  private validationRegularExpression?: string;
  private multiLine?: boolean;
  private minLength?: number;
  private maxLength?: number;
  private defaultValue?: string;
  private inputStyle?: InputStyle;

  /**
   * Creates an instance of the TextInputField class.
   * @param {string} id The unique identifier of the field.
   * @param {string} label The label of the field.
   */
  constructor(id: string, label?: string) {
    super(id);
    this.setLabel(label);
  }

  /**
   * Gets the validationRegularExpression value of the field.
   * @returns {string} The validationRegularExpression value of the field.
   */
  public getValidationRegularExpression(): string {
    return this.validationRegularExpression;
  }

  /**
   * Sets the validationRegularExpression value of the field.
   * @param {string} validationRegularExpression The validationRegularExpression value to set.
   * @returns The updated instance of the TextInputField.
   */
  public setValidationRegularExpression(validationRegularExpression: string): this {
    this.validationRegularExpression = validationRegularExpression;
    return this;
  }

  /**
   * Gets the multiLine value of the field.
   * @returns {Boolean} The multiLine value of the field.
   */
  public getMultiLine(): boolean {
    return this.multiLine;
  }

  /**
   * Sets the multiLine value of the field.
   * @param {boolean} multiLine The multiLine value to set.
   * @returns The updated instance of the TextInputField.
   */
  public setMultiLine(multiLine: boolean): this {
    this.multiLine = multiLine;
    return this;
  }

  /**
   * Gets the minLength value of the field.
   * @returns {number} The minLength value of the field.
   */
  public getMinLength(): number {
    return this.minLength;
  }

  /**
   * Sets the minLength value of the field.
   * @param {number} minLength The minLength value to set.
   * @returns The updated instance of the TextInputField.
   */
  public setMinLength(minLength: number): this {
    this.minLength = minLength;
    return this;
  }

  /**
   * Gets the maxLength value of the field.
   * @returns {number} The maxLength value of the field.
   */
  public getMaxLength(): number {
    return this.maxLength;
  }

  /**
   * Sets the maxLength value of the field.
   * @param {number} maxLength The maxLength value to set.
   * @returns The updated instance of the TextInputField.
   */
  public setMaxLength(maxLength: number): this {
    this.maxLength = maxLength;
    return this;
  }

  /**
   * Gets the defaultValue value of the field.
   * @returns {string} The defaultValue value of the field.
   */
  public getDefaultValue(): string {
    return this.defaultValue;
  }

  /**
   * Sets the defaultValue value of the field.
   * @param {string} defaultValue The defaultValue value to set.
   * @returns The updated instance of the TextInputField.
   */
  public setDefaultValue(defaultValue: string): this {
    this.defaultValue = defaultValue;
    return this;
  }

  /**
   * Gets the inputStyle value of the field.
   * @returns {InputStyle} The inputStyle value of the field.
   */
  public getInputStyle(): InputStyle {
    return this.inputStyle;
  }

  /**
   * Sets the inputStyle value of the field.
   * @param {InputStyle} inputStyle The inputStyle value to set.
   * @returns The updated instance of the TextInputField.
   */
  public setInputStyle(inputStyle: InputStyle): this {
    this.inputStyle = inputStyle;
    return this;
  }
}

/**
 * Represents the input style options for a text input field.
 */
export enum InputStyle {
  text = 'text',
  tel = 'tel',
  url = 'url',
  email = 'email',
  password = 'password',
}
