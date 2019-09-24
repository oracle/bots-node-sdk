import { CommonProvider } from '../../common/provider';
import { ILogger, ICallback } from '../../common/definitions';

import { CustomComponentContext as Conversation } from './sdk';
import { IComponent, ICustomComponentMetadata } from './kinds';

/**
 * Custom component abstract class.
 * @preferred
 * @example export class MyCustomComponent extends ComponentAbstract { ... }
 */
export abstract class ComponentAbstract implements IComponent<ICustomComponentMetadata> {
  protected readonly logger: ILogger; // establish a logger instance
  constructor() {
    this.logger = CommonProvider.getLogger();
  }

  /**
   * component metadata method.
   * @return - metadata property object for the custom component.
   */
  public abstract metadata(): ICustomComponentMetadata

  /**
   * component invocation method.
   * @param conversation Instantiated Conversation instance
   * @param done Conversation done callback
   * @return void
   */
  public abstract invoke(conversation: Conversation, done: ICallback): void

}
