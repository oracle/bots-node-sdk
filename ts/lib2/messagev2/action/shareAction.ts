import { Action } from '../internal';

/**
 * Represents a share action.
 * @extends Action
 */
export class ShareAction extends Action {
  public readonly type = 'share';

  /**
   * Creates a new instance of the ShareAction class.
   * @param label - The label of the share action.
   */
  constructor(label: string) {
    super(label);
  }

}


