import { Action } from '../internal';

/**
 * Represents a geo location action.
 * @extends Action
 */
export class LocationAction extends Action {
  public readonly type: string = 'location';

  /**
   * Creates an instance of LocationAction.
   * @param label - The label of the location action.
   */
  constructor(label: string) {
    super(label);
  }

}


