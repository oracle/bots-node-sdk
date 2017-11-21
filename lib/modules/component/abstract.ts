import * as log4js from 'log4js';
import { Conversation } from '../conversation';
import { Callback } from '../../common/definitions';
import { BotComponent, BotComponentMeta } from './decorator';

export interface ComponentInterface {
  metadata?(): BotComponentMeta; // established by decorator
  invoke(conversation: Conversation, done: Callback): void;
}

/**
 * Custom component abstract class.
 * @preferred
 * @example export class MyCustomComponent extends ComponentAbstract { ... }
 */
export abstract class ComponentAbstract implements ComponentInterface {
  protected readonly logger: log4js.Logger; // establish a namespaced logger instance
  constructor() {
    this.logger = log4js.getLogger(this.constructor.name);
  }

  /**
   * convenience getter to access decorator annotations.
   * requires the use of @BotComponent({ ... }) decorator
   */
  get annotations(): BotComponent {
    return this['__decoratorMetadata'];
  }

  /**
   * invoke.
   * @desc component invokation method.
   * @param conversation Instantiated Conversation instance
   * @param done Conversation done callback
   * @return void
   */
  public abstract invoke(conversation: Conversation, done: Callback): void

}
