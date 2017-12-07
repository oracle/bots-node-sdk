import { Conversation as SDK } from '../../';
/**
 * Component Testing Harness
 *
 */
export interface IMockRequestBody {
    botId?: any;
    platformVersion?: any;
    context?: any;
    properties?: any;
    message?: any;
}
/**
 * Create a mock request for component middleware handling
 * @param type - channel type
 * @param properties - conversation properties (optional)
 * @param variables - conversation variables (optional)
 */
export declare function MockRequest(type?: string, properties?: any, variables?: any): IMockRequestBody;
/**
 * Extension for the main Conversation class with testing conveniences.
 *
 * ```javascript
 * import * as Testing from '@oracle/bot-js-sdk/testing';
 * import { MyCustomComponent } from 'path/to/custom/components';
 *
 * describe('MyCustomComponent', () => {
 *   it('should reply with message', done => {
 *     const request = Testing.MockRequest();
 *     const conversation = Testing.MockConversation.fromRequest(request);
 *     new MyCustomComponent()
 *       .invoke(conversation, err => {
 *         expect(conversation.response().messages).toBeDefined();
 *         return err ? done.fail(err) : done();
 *       });
 *   })
 * })
 * ```
 */
export declare class MockConversation extends SDK {
    /**
     * create a mock conversation with an "empty" valid request.
     * @return Conversation
     */
    static any(): MockConversation;
    /**
     * create conversation instance from a request
     * @param req the component invocation request body
     * @return Conversation
     */
    static fromRequest(req: IMockRequestBody): MockConversation;
}
