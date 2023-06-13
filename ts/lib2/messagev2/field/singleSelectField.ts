import { EditableField, SelectFieldOption, MessageUtil } from '../internal';

/**
 * Represents the layout style for a single select field.
 */
export enum SingleSelectLayoutStyle {
  list = 'list',
  radioGroup = 'radioGroup',
}

/**
 * Represents a single select field.
 * @extends EditableField
 */
export class SingleSelectField extends EditableField {
  public readonly displayType: string = 'singleSelect';
  private options: SelectFieldOption[] = [];
  private defaultValue?: any;
  private layoutStyle: SingleSelectLayoutStyle = SingleSelectLayoutStyle.list;

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
   * Creates an instance of the SingleSelectField class.
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
   * Gets the options of the field.
   * @returns {SelectFieldOption[]} The options of the field.
   */
  public getOptions(): SelectFieldOption[] {
    return this.options;
  }

  /**
   * Sets the options of the field.
   * @param {SelectFieldOption[]} options The options to set.
   * @returns The updated instance of the SingleSelectField.
   */
  public setOptions(options: SelectFieldOption[]): this {
    this.options = options;
    return this;
  }

  /**
   * Add an option.
   * @param {SelectFieldOption} option The option to add.
   * @returns The updated instance of the SingleSelectField.
   */
  public addOption(option: SelectFieldOption): this {
    this.options.push(option);
    return this;
  }

  /**
   * Gets the default value of the field.
   * @returns {any} The default value of the field.
   */
  public getDefaultValue(): any {
    return this.defaultValue;
  }

  /**
   * Sets the default value of the field.
   * @param {any} defaultValue The default value to set.
   * @returns The updated instance of the SingleSelectField.
   */
  public setDefaultValue(defaultValue: any): this {
    this.defaultValue = defaultValue;
    return this;
  }

  /**
   * Gets the layout style of the field.
   * @returns {SingleSelectLayoutStyle} The layout style of the field.
   */
  public getLayoutStyle(): SingleSelectLayoutStyle {
    return this.layoutStyle;
  }

  /**
   * Sets the layout style of the field.
   * @param {SingleSelectLayoutStyle} layoutStyle The layout style to set.
   * @returns The updated instance of the SingleSelectField.
   */
  public setLayoutStyle(layoutStyle: SingleSelectLayoutStyle): this {
    this.layoutStyle = layoutStyle;
    return this;
  }

}
