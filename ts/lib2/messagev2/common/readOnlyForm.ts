import { ReadOnlyField, Action, Voice, MessageUtil, ChannelCustomizable } from '../internal';

/**
 * Represents a read-only form.
 * @extends ChannelCustomizable
 */
export class ReadOnlyForm extends ChannelCustomizable {
  private id?: string;
  private title?: string;
  private voice?: Voice;
  private fields: ReadOnlyField[] = [];
  private actions?: Action[];
  // properties below will be added in 23.08
  // private selectAction?: Action;

  /**
   * Deserialize nested object properties into corresponding class instances
   */
  public deserializeNestedProperties(): void {
    super.deserializeNestedProperties();
    if (this.voice) {
      this.voice = MessageUtil.deserializeVoice(this.voice);
    }
    if (this.fields) {
      this.fields = MessageUtil.deserializeFields(this.fields);
    }
    if (this.actions) {
      this.actions = MessageUtil.deserializeActions(this.actions);
    }
  }

  /**
   * Creates an instance of the ReadOnlyForm class.
   * @param {ReadOnlyField[]} [fields] The list of fields in the read-only form.
   */
  constructor(fields?: ReadOnlyField[]) {
    super();
    if (fields) {
      this.fields = fields;
    }
  }

  /**
   * Gets the ID of the read-only form.
   * @returns {string} The ID of the read-only form.
   */
  public getId(): string {
    return this.id;
  }

  /**
   * Sets the ID of the read-only form.
   * @param {string} id The ID to set.
   * @returns {ReadOnlyForm} The updated instance of the ReadOnlyForm.
   */
  public setId(id: string): this {
    this.id = id;
    return this;
  }

  /**
   * Gets the title of the read-only form.
   * @returns {string} The title of the read-only form.
   */
  public getTitle(): string {
    return this.title;
  }

  /**
   * Sets the title of the read-only form.
   * @param {string} title The title to set.
   * @returns {ReadOnlyForm} The updated instance of the ReadOnlyForm.
   */
  public setTitle(title: string): this {
    this.title = title;
    return this;
  }

  /**
   * Gets the voice settings of the read-only form.
   * @returns {Voice} the voice settings of the read-only form.
   */
  public getVoice(): Voice {
    return this.voice;
  }

  /**
   * Sets the voice settings of the read-only form.
   * @param {Voice} voice The voice to set.
   * @returns {ReadOnlyForm} The updated instance of the ReadOnlyForm.
   */
  public setVoice(voice: Voice): this {
    this.voice = voice;
    return this;
  }

  /**
   * Gets the list of fields in the read-only form.
   * @returns {ReadOnlyField[]} The list of fields in the read-only form.
   */
  public getFields(): ReadOnlyField[] {
    return this.fields;
  }

  /**
   * Sets the fields of the read-only form.
   * @param {ReadOnlyField[]} fields The fields to set.
   * @returns {ReadOnlyForm} The updated instance of the ReadOnlyForm.
   */
  public setFields(fields: ReadOnlyField[]): this {
    this.fields = fields;
    return this;
  }

  /**
   * Adds a field to the read-only form.
   * @param {ReadOnlyField} field The field to add.
   * @returns {ReadOnlyForm} The updated instance of the ReadOnlyForm.
   */
  public addField(field: ReadOnlyField): this {
    this.fields.push(field);
    return this;
  }

  /**
   * Gets the list of actions in the read-only form.
   * @returns {Action[]} The list of actions in the read-only form.
   */
  public getActions(): Action[] {
    return this.actions;
  }

  /**
   * Adds an action to the read-only form.
   * @param {Action} action The action to add.
   * @returns {ReadOnlyForm} The updated instance of the ReadOnlyForm.
   */
  public addAction(action: Action): this {
    if (!this.actions) {
      this.actions = [];
    }
    this.actions.push(action);
    return this;
  }

  // /**
  //  * Gets the select action of the read-only form.
  //  * @returns The select action of the read-only form.
  //  */
  // public getSelectAction(): Action {
  //   return this.selectAction;
  // }

  // /**
  //  * Sets the select action of the read-only form.
  //  * @param selectAction The select action to set.
  //  * @returns The updated instance of the ReadOnlyForm.
  //  */
  // public setSelectAction(selectAction: Action): this {
  //   this.selectAction = selectAction;
  //   return this;
  // }

}
