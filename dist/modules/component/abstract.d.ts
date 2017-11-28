import * as log4js from 'log4js';
import { Conversation } from '../conversation';
import { Callback } from '../../common/definitions';
import { BotComponent, BotComponentMeta } from './decorator';
export interface ComponentInterface {
    metadata?(): BotComponentMeta;
    invoke(conversation: Conversation, done: Callback): void;
}
/**
 * Custom component abstract class.
 * @preferred
 * @example export class MyCustomComponent extends ComponentAbstract { ... }
 */
export declare abstract class ComponentAbstract implements ComponentInterface {
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
    abstract invoke(conversation: Conversation, done: Callback): void;
}
