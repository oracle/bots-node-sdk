import { Conversation as SDK } from '../../';
/**
 * MockComponent Testing Harness
 *
 * ```javascript
 * import * as Testing from '@oracle/bot-js-sdk/testing';
 * import { MyCustomComponent } from 'path/to/custom/components';
 *
 * describe('MyCustomComponent', () => {
 *   it('should reply with message', done => {
 *     const request = Testing.MockComponent.Request();
 *     const conversation = Testing.MockComponent.Conversation.fromRequest(request);
 *     new MyCustomComponent()
 *       .invoke(conversation, err => {
 *         expect(conversation.response().messages).toBeDefined();
 *         return err ? done.fail(err) : done();
 *       });
 *   })
 * })
 * ```
 */
export declare namespace MockComponent {
    interface IRequestBody {
        botId?: any;
        platformVersion?: any;
        context?: any;
        properties?: any;
        message?: any;
    }
    /**
     * Request
     * @description create a mock request for component middleware handling
     * @param type - channel type
     * @param properties - conversation properties (optional)
     * @param variables - conversation variables (optional)
     */
    function Request(type?: string, properties?: any, variables?: any): IRequestBody;
    /**
     * extension of the main Conversation class to provide testing conveniences
     * @todo: extend any methods to suppress unwanted testing functionality.
     */
    class Conversation extends SDK {
        /**
         * create a mock conversation with an "empty" valid request.
         * @return Conversation
         */
        static any(): Conversation;
        /**
         * create conversation instance from a request
         * @param req the component invocation request body
         * @return Conversation
         */
        static fromRequest(req: IRequestBody): Conversation;
    }
}
