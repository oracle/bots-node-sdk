import { EditableField } from '../internal';

/**
 * Represents a time picker field.
 * @extends EditableField
 */
export class TimePickerField extends EditableField {
  public readonly displayType: string = 'timePicker';
  private minTime?: string;
  private maxTime?: string;
  private defaultValue?: string;

  /**
   * Creates an instance of the TimePickerField class.
   * @param {string} id The unique identifier of the field.
   * @param {string} label The label of the field.
   */
  constructor(id: string, label: string) {
    super(id);
    this.setLabel(label);
  }

  /**
   * Gets the minTime value of the field.
   * @returns {string} The minTime value of the field.
   */
  public getMinTime(): string {
    return this.minTime;
  }

  /**
   * Sets the minTime value of the field. Time format should be hh:mm.
   * @param {string} minTime The minTime value to set, using format hh:mm.
   * @returns The updated instance of the TimePickerField.
   */
  public setMinTime(minTime: string): this {
    this.minTime = minTime;
    return this;
  }

  /**
   * Gets the maxTime value of the field.
   * @returns {string} The maxTime value of the field.
   */
  public getMaxTime(): string {
    return this.maxTime;
  }

  /**
   * Sets the maxTime value of the field. Time format should be hh:mm.
   * @param {string} maxTime The maxTime value to set, using format hh:mm.
   * @returns The updated instance of the TimePickerField.
   */
  public setMaxTime(maxTime: string): this {
    this.maxTime = maxTime;
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
   * @returns The updated instance of the TimePickerField.
   */
  public setDefaultValue(defaultValue: string): this {
    this.defaultValue = defaultValue;
    return this;
  }

}
