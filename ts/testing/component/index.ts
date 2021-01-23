import { CustomComponentContext as SDK, ComponentRequestBody, MessagePayload } from '../../lib/';

/**
 * Create a mock request for component middleware handling.
 * Individual properties and variables may be specified by modifying the result.
 * @param {*} [messagePayload] - message payload
 * @param {*} [properties] - conversation properties
 * @param {*} [variables] - conversation variables
 * @param {string} [type] - channel type
 */
export function MockRequest(messagePayload = {}, properties: any = {}, variables: any = {}, type = 'test'): ComponentRequestBody {
  function context() {
    Object.keys(variables)
      .forEach(k => {
        let v = variables[k];
        if (!(v.type && v.value)) {
          variables[k] = {
            entity: false,
            type: 'object',
            value: v,
          }
        }
      });
    return {
      variables: variables,
    }
  }
  function props() {
    return properties;
  }
  function message() {
    return {
      payload: {},
      messagePayload: messagePayload,
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
    }
  }
  return {
    botId: 'mockbot',
    platformVersion: '1.1',
    context: context(),
    properties: props(),
    message: message(),
  };
}

/**
 * Extension for the main Conversation class with testing conveniences.
 *
 * ```javascript
 * import * as Testing from '@oracle/bots-node-sdk/testing';
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
export class MockConversation extends SDK {

  /**
   * create a mock conversation with an "empty" valid request.
   * @return Conversation
   */
  public static any(): MockConversation {
    return this.fromRequest(MockRequest());
  }

  /**
   * create conversation instance from a request
   * @param req the component invocation request body
   * @return Conversation
   */
  public static fromRequest(req: ComponentRequestBody): MockConversation {
    return new MockConversation(req);
  }

  /**
   * get conversation reply messages
   * @return - message list returned by the component
   */
  public getReplies(): MessagePayload[] {
    return this.response().messages;
  }

}
