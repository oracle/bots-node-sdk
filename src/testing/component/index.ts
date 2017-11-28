import { Conversation as SDK } from '../../';

/**
 * MockComponent Testing Harness
 * @example
 *  import * as Testing from '@oracle/bot-js-sdk/testing';
 *  import { MyCustomComponent } from 'path/to/custom/components';
 *
 *  describe('MyCustomComponent', () => {
 *    it('should reply with message', done => {
 *      const request = Testing.MockComponent.Request();
 *      const conversation = Testing.MockComponent.Conversation.fromRequest(request);
 *      new MyCustomComponent()
 *        .invoke(conversation, err => {
 *          expect(conversation.response().messages).toBeDefined();
 *          return err ? done.fail(err) : done();
 *        });
 *    })
 *  })
 */
export namespace MockComponent {
  export interface RequestBody {
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
  export function Request(type = 'test', properties: any = {}, variables: any = {}): RequestBody {
    function context() {
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
   * extension of the main Conversation class to provide testing conveniences
   * @todo: extend any methods to suppress unwanted testing functionality.
   */
  export class Conversation extends SDK {

    /**
     * create a mock conversation with an "empty" valid request.
     * @return Conversation
     */
    public static any(): Conversation {
      return this.fromRequest(Request());
    }

    /**
     * create conversation instance from a request
     * @param req the component invocation request body
     * @return Conversation
     */
    public static fromRequest(req: RequestBody): Conversation {
      return new this(req);
    }
  }
}
