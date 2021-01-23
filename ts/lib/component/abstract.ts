import { CommonProvider } from '../../common/provider';
import { Logger, InvocationCallback } from '../../common/definitions';

import { CustomComponentContext } from './sdk';
import { CustomComponent, CustomComponentMetadata } from './kinds';

/**
 * Custom component abstract class.
 * @preferred
 * @example export class MyCustomComponent extends ComponentAbstract { ... }
 */
export abstract class ComponentAbstract implements CustomComponent {
  protected readonly logger: Logger; // establish a logger instance
  constructor() {
    this.logger = CommonProvider.getLogger();
  }

  /**
   * component metadata method.
   * @return - metadata property object for the custom component.
   */
  public abstract metadata(): CustomComponentMetadata

  /**
   * component invocation method.
   * @param conversation Instantiated Conversation instance
   * @param done Conversation done callback
   * @return void
   */
  public abstract invoke(conversation: CustomComponentContext, done: InvocationCallback): void

}
