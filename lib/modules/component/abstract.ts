import * as log4js from 'log4js';
import { SDK } from '../../sdk';
import { BotComponent, BotComponentMeta } from './decorator';

export interface BotComponentInterface {
  metadata?(): BotComponentMeta; // established by decorator
  invoke(conversation: SDK.Conversation, done: SDK.Callback): void;
}

export interface BotConversationHandler {
  (conversation: SDK.Conversation, done: SDK.Callback): void;
}

/**
 * Custom compononent abstract class.
 * @preferred
 * @example export class MyCustomComponent extends OracleBot.ComponentAbstract { ... }
 */
export abstract class BotComponentAbstract implements BotComponentInterface {
  protected readonly logger: log4js.Logger; // establish a namespaced logger instance
  constructor() {
    this.logger = log4js.getLogger(this.constructor.name);
  }

  /**
   * convenience getter to access decorator annotations.
   */
  get annotations(): BotComponent {
    return this['__decoratorMetadata'];
  }

  /**
   * invoke.
   * @desc component invokation method.
   * @param conversation: SDK.Conversation
   * @param done: SDK.callback - sdk done callback.
   * @return void
   */
  public abstract invoke(conversation: SDK.Conversation, done: SDK.Callback): void


}
