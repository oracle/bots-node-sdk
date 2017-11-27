import { Primitive } from '../../common/definitions';
export declare type BotComponentMetaName = string;
/**
 * Component metadata defintion
 */
export interface BotComponentMeta {
    name?: BotComponentMetaName;
    supportedActions?: string[];
    properties?: {
        [property: string]: {
            type: Primitive;
            required?: boolean;
        };
    };
}
export interface BotComponent extends BotComponentMeta {
}
/**
 * BotComponent class decorator function. (TypeScript only)
 * Used to source component metadata object.
 * @param annotations Component metadata object.
 */
export declare const BotComponent: (annotations?: BotComponent) => Function;
