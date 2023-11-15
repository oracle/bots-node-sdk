import { Action, NonRawMessage, MessageUtil } from '../internal';

/**
 * Represents a popup action. When clicked a popup dialog opens that shows the popup content
 * @extends Action
 */
export class PopupAction extends Action {
  public readonly type: string = 'popup';
  private popupContent: NonRawMessage;

  /**
   * Creates an instance of PopupAction.
   * @param label - The label of the popup action.
   * @param popupContent - The popup content associated with the popup action.
   */
  constructor(label: string, popupContent: NonRawMessage) {
    super(label);
    this.popupContent = popupContent;
  }

  /**
   * Deserialize nested object properties into corresponding class instances
   */
  public deserializeNestedProperties(): void {
    super.deserializeNestedProperties();
    if (this.popupContent) {
      this.popupContent = MessageUtil.deserializeMessage(this.popupContent);
    }
  }

  /**
   * Gets the popup content associated with the popup action.
   * @returns The popup content associated with the popup action.
   */
  public getPopupContent(): NonRawMessage {
    return this.popupContent;
  }

  /**
   * Sets the popup content associated with the popup action.
   * @param popupContent - The popup content to set.
   * @returns The current instance of the PopupAction class.
   */
  public setPopupContent(popupContent: NonRawMessage): this {
    this.popupContent = popupContent;
    return this;
  }

}




