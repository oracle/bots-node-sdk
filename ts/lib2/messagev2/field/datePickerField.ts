import { EditableField } from '../internal';

/**
 * Represents a date picker field.
 * @extends EditableField
 */
export class DatePickerField extends EditableField {
  public readonly displayType: string = 'datePicker';
  private minDate?: string;
  private maxDate?: string;
  private defaultValue?: string;

  /**
   * Creates an instance of the DatePickerField class.
   * @param {string} id The ID of the date picker field.
   */
  constructor(id: string, label: string) {
    super(id);
    this.setLabel(label);
  }

  /**
   * Gets the minimum date value.
   * @returns {string} The minimum date.
   */
  public getMinDate(): string {
    return this.minDate;
  }

  /**
   * Sets the minimum date value. Date format should be yyyy-mm-dd.
   * @param {string} minDate The minimum date to set, using format yyyy-mm-dd.
   * @returns The updated instance of the DatePickerField.
   */
  public setMinDate(minDate: string): this {
    this.minDate = minDate;
    return this;
  }

  /**
   * Gets the maximum date value.
   * @returns {string} The maximum date.
   */
  public getMaxDate(): string {
    return this.maxDate;
  }

  /**
   * Sets the maximum date value. Date format should be yyyy-mm-dd.
   * @param {string} maxDate The maximum date to set, using format yyyy-mm-dd.
   * @returns The updated instance of the DatePickerField.
   */
  public setMaxDate(maxDate: string): this {
    this.maxDate = maxDate;
    return this;
  }

  /**
   * Gets the default value of the field.
   * @returns {string} The default value.
   */
  public getDefaultValue(): string {
    return this.defaultValue;
  }

  /**
   * Sets the default value of the field.
   * @param {string} defaultValue The default value to set.
   * @returns The updated instance of the DatePickerField.
   */
  public setDefaultValue(defaultValue: string): this {
    this.defaultValue = defaultValue;
    return this;
  }

}
