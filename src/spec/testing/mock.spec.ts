import { Conversation } from '../main';
import * as Testing from '../../testing';

describe('Testing harness', () => {

  describe('MockComponent', () => {

    it('should create a request payload', () => {
      const req = Testing.MockRequest();
      expect(req.botId).toBeDefined();
      expect(req.context.variables).toBeDefined();
    })

    it('should extend primary Conversation class', () => {
      const conv = Testing.MockConversation.any();
      expect(conv instanceof Conversation).toBe(true);
    });

  });

});
