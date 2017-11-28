import * as log4js from 'log4js';
import { Conversation } from '../conversation';
import { ICallback } from '../../common/definitions';
import { Component, IComponentMetadata } from './decorator';
export interface IComponentInterface {
    metadata?(): IComponentMetadata;
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
     * requires the use of @Component({ ... }) decorator
     */
    readonly annotations: Component;
    /**
     * invoke.
     * @desc component invokation method.
     * @param conversation Instantiated Conversation instance
     * @param done Conversation done callback
     * @return void
     */
    abstract invoke(conversation: Conversation, done: ICallback): void;
}
