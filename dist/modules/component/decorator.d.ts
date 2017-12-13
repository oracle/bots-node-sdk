import { Primitive } from '../../common/definitions';
export declare type ComponentMetadataName = string;
/**
 * Component metadata defintion
 */
export interface IComponentMetadata {
    name?: ComponentMetadataName;
    supportedActions?: string[];
    properties?: {
        [property: string]: {
            type: Primitive;
            required?: boolean;
        };
    };
}
export interface Component extends IComponentMetadata {
}
/**
 * @preferred
 * Component class decorator function. (`TypeScript` only)
 * Used to source component annotations (metadata) object.
 * @param annotations - Component metadata object.
 *
 * ```javascript
 * import * as OracleBot from '@oracle/bots-js-sdk';
 *
 * @OracleBot.Lib.Component({
 *   name: 'my.custom.component',
 *   properties: {},
 *   supportedActions: []
 * })
 * export class MyCustomComponent {
 *   invoke(conversation: OracleBot.Lib.Conversation, done) {
 *     // ...
 *   }
 * }
 * ```
 */
export declare const Component: (annotations?: Component) => Function;
