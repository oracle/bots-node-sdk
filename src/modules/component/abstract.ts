import * as log4js from 'log4js';
import { Conversation } from '../conversation';
import { ICallback } from '../../common/definitions';
import { Component, IComponentMetadata } from './decorator';

export interface IComponentInterface {
  metadata?(): IComponentMetadata; // established by decorator
  invoke(conversation: Conversation, done: ICallback): void;
}

/**
 * Custom component abstract class.
 * @preferred
 * @example export class MyCustomComponent extends ComponentAbstract { ... }
 */
export abstract class ComponentAbstract implements IComponentInterface {
  protected readonly logger: log4js.Logger; // establish a namespaced logger instance
  constructor() {
    this.logger = log4js.getLogger(this.constructor.name);
  }

  /**
   * convenience getter to access decorator annotations.
   * requires the use of @Component({ ... }) decorator
   */
  get annotations(): Component {
    return this['__decoratorMetadata'];
  }

  /**
   * invoke.
   * @desc component invokation method.
   * @param conversation Instantiated Conversation instance
   * @param done Conversation done callback
   * @return void
   */
  public abstract invoke(conversation: Conversation, done: ICallback): void

}
