import _conversation = require('./sdk');
import _shell = require('./shell');

/**
 * SDK namespace wrapper around ibcs files.
 */
export namespace SDK {
  export const Shell = _shell;

  /**
   * Conversation class.
   */
  // export const Conversation = _conversation;
  // export type Conversation = _conversation;
  export class Conversation extends _conversation { }

}
