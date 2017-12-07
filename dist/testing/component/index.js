"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("../../");
/**
 * Create a mock request for component middleware handling.
 * Invidual properties and variables may be specified by modifying the result.
 * @param type - channel type
 * @param properties - conversation properties (optional)
 * @param variables - conversation variables (optional)
 */
function MockRequest(type = 'test', properties = {}, variables = {}) {
    function context() {
        return {
            variables: variables,
        };
    }
    function props() {
        return properties;
    }
    function message() {
        return {
            payload: {},
            messagePayload: {},
            retryCount: 0,
            channelConversation: {
                botId: 'mockbot',
                sessionId: '1234',
                type: type,
                userId: '1234',
                channelId: 'mockchannel'
            },
            componentResponse: {},
            executionContext: 'any',
            tenantId: '1234',
            createdOn: new Date().toISOString(),
            id: '1234',
        };
    }
    return {
        botId: 'mockbot',
        platformVersion: '1.1',
        context: context(),
        properties: props(),
        message: message(),
    };
}
exports.MockRequest = MockRequest;
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
class MockConversation extends _1.Conversation {
    /**
     * create a mock conversation with an "empty" valid request.
     * @return Conversation
     */
    static any() {
        return this.fromRequest(MockRequest());
    }
    /**
     * create conversation instance from a request
     * @param req the component invocation request body
     * @return Conversation
     */
    static fromRequest(req) {
        return new this(req);
    }
}
exports.MockConversation = MockConversation;
//# sourceMappingURL=index.js.map