import { EditableField } from '../internal';

/**
 * Represents a toggle field.
 * @extends EditableField
 */
export class ToggleField extends EditableField {
  public readonly displayType: string = 'toggle';
  private valueOn: any;
  private valueOff: any;
  private defaultValue?: any;
  private labelOn?: string;
  private labelOff?: string;

  /**
   * Creates an instance of the ToggleField class.
   * @param {string} id The unique identifier of the field.
   * @param {string} label The label of the field.
   * @param {any} valueOff The value when the toggle is off.
   * @param {any} valueOn The value when the toggle is on.
   */
  constructor(id: string, label: string, valueOff: any, valueOn: any) {
    super(id);
    this.setLabel(label);
    this.valueOff = valueOff;
    this.valueOn = valueOn;
  }

  /**
   * Gets the valueOn of the field.
   * @returns {any} The valueOn of the field.
   */
  public getValueOn(): any {
    return this.valueOn;
  }

  /**
   * Sets the valueOn of the field.
   * @param {any} valueOn The valueOn to set.
   * @returns The updated instance of the ToggleField.
   */
  public setValueOn(valueOn: any): this {
    this.valueOn = valueOn;
    return this;
  }

  /**
   * Gets the valueOff of the field.
   * @returns {any} The valueOff of the field.
   */
  public getValueOff(): any {
    return this.valueOff;
  }

  /**
   * Sets the valueOff of the field.
   * @param {any} valueOff The valueOff to set.
   * @returns The updated instance of the ToggleField.
   */
  public setValueOff(valueOff: any): this {
    this.valueOff = valueOff;
    return this;
  }

  /**
   * Gets the defaultValue of the field.
   * @returns {any} The defaultValue of the field.
   */
  public getDefaultValue(): any {
    return this.defaultValue;
  }

  /**
   * Sets the defaultValue of the field.
   * @param {any} defaultValue The defaultValue to set.
   * @returns The updated instance of the ToggleField.
   */
  public setDefaultValue(defaultValue: any): this {
    this.defaultValue = defaultValue;
    return this;
  }

  /**
   * Gets the labelOn of the field.
   * @returns {string} The labelOn of the field.
   */
  public getLabelOn(): string {
    return this.labelOn;
  }

  /**
   * Sets the labelOn of the field. This label is used to create a radio button when the channel does not support a toggle field.
   * @param {string} labelOn The labelOn to set.
   * @returns The updated instance of the ToggleField.
   */
  public setLabelOn(labelOn: string): this {
    this.labelOn = labelOn;
    return this;
  }

  /**
   * Gets the labelOff of the field.
   * @returns {string} The labelOff of the field.
   */
  public getLabelOff(): string {
    return this.labelOff;
  }

  /**
   * Sets the labelOff of the field. This label is used to create a radio button when the channel does not support a toggle field.
   * @param {string} labelOff The labelOff to set.
   * @returns The updated instance of the ToggleField.
   */
  public setLabelOff(labelOff: string): this {
    this.labelOff = labelOff;
    return this;
  }

}
