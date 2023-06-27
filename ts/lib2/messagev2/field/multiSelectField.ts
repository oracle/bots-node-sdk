import { EditableField, SelectFieldOption, MessageUtil } from '../internal';

/**
 * Represents the layout style of a multi-select field.
 */
export enum MultiSelectLayoutStyle {
  list = 'list',
  checkboxes = 'checkboxes',
}

/**
 * Represents a multi-select field.
 * @extends EditableField
 */
export class MultiSelectField extends EditableField {
  public readonly displayType: string = 'multiSelect';
  private defaultValue?: Object[];
  private options: SelectFieldOption[] = [];
  private layoutStyle: MultiSelectLayoutStyle = MultiSelectLayoutStyle.list;

  /**
   * Deserialize nested object properties into corresponding class instances
   */
  public deserializeNestedProperties(): void {
    super.deserializeNestedProperties();
    if (this.options) {
      this.options = MessageUtil.deserializeSelectFieldOptions(this.options);
    }
  }

  /**
   * Creates an instance of the MultiSelectField class.
   * @param {string} id The unique identifier of the field.
   * @param {string} label The label of the field.
   * @param {SelectFieldOption[]} options The options to of the field.
   */
  constructor(id: string, label: string, options?: SelectFieldOption[]) {
    super(id);
    this.setLabel(label);
    if (options) {
      this.setOptions(options);
    }
  }

  /**
   * Gets the default value.
   * @returns {object[]} The default value.
   */
  public getDefaultValue(): Object[] {
    return this.defaultValue;
  }

  /**
   * Sets the default value.
   * @param {object[]} defaultValue The default value to set.
   * @returns The updated instance of the MultiSelectField.
   */
  public setDefaultValue(defaultValue: Object[]): this {
    this.defaultValue = defaultValue;
    return this;
  }

  /**
   * Gets the options.
   * @returns {SelectFieldOption[]} The options.
   */
  public getOptions(): SelectFieldOption[] {
    return this.options;
  }

  /**
   * Sets the options.
   * @param {SelectFieldOption[]} options The options to set.
   * @returns The updated instance of the MultiSelectField.
   */
  public setOptions(options: SelectFieldOption[]): this {
    this.options = options;
    return this;
  }

  /**
   * Add an option.
   * @param {SelectFieldOption} option The option to add.
   * @returns The updated instance of the MultiSelectField.
   */
  public addOption(option: SelectFieldOption): this {
    this.options.push(option);
    return this;
  }

  /**
   * Gets the layout style.
   * @returns {MultiSelectLayoutStyle} The layout style.
   */
  public getLayoutStyle(): MultiSelectLayoutStyle {
    return this.layoutStyle;
  }

  /**
   * Sets the layout style.
   * @param {MultiSelectLayoutStyle} layoutStyle The layout style to set.
   * @returns The updated instance of the MultiSelectField.
   */
  public setLayoutStyle(layoutStyle: MultiSelectLayoutStyle): this {
    this.layoutStyle = layoutStyle;
    return this;
  }

}


