import { PostbackAction } from '../internal';

/**
 * Represents a postback action that invokes a custom event handler.
 * @extends Action
 */
export class CustomEventAction extends PostbackAction {

  /**
   * Creates an instance of CustomEventAction.
   * @param label - The label of the CustomEvent postback action.
   * @param event - The name of the event handler that should be invoked
   */
  constructor(label: string, event: string) {
    super(label, {'action': 'system.customEvent', 'event': {'name': event, 'properties': {}}});
  }

  /**
   * Adds a custom property.
   * @param name - The name of the property
   * @param value - The value of the property
   * @returns The current instance of the CustomEventAction class.
   */
  public addCustomProperty(name: string, value: any): this {
    this.getPostback().event.properties[name] = value;
    return this;
  }

}


