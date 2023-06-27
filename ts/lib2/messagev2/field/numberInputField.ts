import { EditableField } from '../internal';

/**
 * Represents a number input field.
 * @extends EditableField
 */
export class NumberInputField extends EditableField {
  public readonly displayType: string = 'numberInput';
  private maxValue?: number;
  private minValue?: number;
  private defaultValue?: number;

  /**
   * Creates an instance of the NumberInputField class.
   * @param {string} id The unique identifier of the field.
   * @param {string} label The label of the field.
   */
  constructor(id: string, label: string) {
    super(id);
    this.setLabel(label);
  }

  /**
   * Gets the maximum value of the field.
   * @returns {number} The maximum value of the field.
   */
  public getMaxValue(): number {
    return this.maxValue;
  }

  /**
   * Sets the maximum value of the field.
   * @param {number} maxValue The maximum value to set.
   * @returns The updated instance of the NumberInputField.
   */
  public setMaxValue(maxValue: number): this {
    this.maxValue = maxValue;
    return this;
  }

  /**
   * Gets the minimum value of the field.
   * @returns {number} The minimum value of the field.
   */
  public getMinValue(): number {
    return this.minValue;
  }

  /**
   * Sets the minimum value of the field.
   * @param {number} minValue The minimum value to set.
   * @returns The updated instance of the NumberInputField.
   */
  public setMinValue(minValue: number): this {
    this.minValue = minValue;
    return this;
  }

  /**
   * Gets the default value of the field.
   * @returns {number} The default value of the field.
   */
  public getDefaultValue(): number {
    return this.defaultValue;
  }

  /**
   * Sets the default value of the field.
   * @param {number} defaultValue The default value to set.
   * @returns The updated instance of the NumberInputField.
   */
  public setDefaultValue(defaultValue: number): this {
    this.defaultValue = defaultValue;
    return this;
  }
}
