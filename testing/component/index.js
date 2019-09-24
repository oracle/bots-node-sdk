'use strict';

const Lib = require("../../lib/");

/**
 * Create a mock request for component middleware handling.
 * Individual properties and variables may be specified by modifying the result.
 * @function module:Testing.MockRequest
 * @param {*} [messagePayload] - message payload
 * @param {*} [properties] - conversation properties
 * @param {*} [variables] - conversation variables
 * @param {string} [type] - channel type
 */
function MockRequest(messagePayload = {}, properties = {}, variables = {}, type = 'test') {
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
    };
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
    };
  }
  return {
    botId: 'mockbot',
    platformVersion: '1.1',
    state: "someState",
    context: context(),
    properties: props(),
    message: message(),
  };
}

/**
 * Extension for the main Conversation class with testing conveniences.
 * @memberof module:Testing
 * @example
 * const Testing = require('@oracle/bots-node-sdk/testing');
 * const { MyCustomComponent } = require('path/to/custom/components');
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
 */
class MockConversation extends Lib.Conversation {
  /**
   * create a mock conversation with an "empty" valid request.
   * @return Conversation
   */
  static any() {
    return this.fromRequest(MockRequest());
  }
  /**
   * create conversation instance from a request
   * @param {*} req - the component invocation request body
   * @return Conversation
   */
  static fromRequest(req) {
    return new MockConversation(req);
  }
  /**
   * get conversation reply messages
   * @return - message list returned by the component
   */
  getReplies() {
    return this.response().messages;
  }
}

module.exports = {
  MockRequest,
  MockConversation,
};