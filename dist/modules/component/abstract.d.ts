import * as log4js from 'log4js';
import { Conversation } from '../conversation';
import { ICallback } from '../../common/definitions';
import { BotComponent, IBotComponentMeta } from './decorator';
export interface IComponentInterface {
    metadata?(): IBotComponentMeta;
    invoke(conversation: Conversation, done: ICallback): void;
}
/**
 * Custom component abstract class.
 * @preferred
 * @example export class MyCustomComponent extends ComponentAbstract { ... }
 */
export declare abstract class ComponentAbstract implements IComponentInterface {
    protected readonly logger: log4js.Logger;
    constructor();
    /**
     * convenience getter to access decorator annotations.
     * requires the use of @BotComponent({ ... }) decorator
     */
    readonly annotations: BotComponent;
    /**
     * invoke.
     * @desc component invokation method.
     * @param conversation Instantiated Conversation instance
     * @param done Conversation done callback
     * @return void
     */
    abstract invoke(conversation: Conversation, done: ICallback): void;
}
