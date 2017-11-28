import { Conversation } from '../main';
import * as BotTesting from '../../testing';

describe('Testing harness', () => {

  describe('MockComponent', () => {

    it('should create a request payload', () => {
      const req = BotTesting.MockComponent.Request();
      expect(req.botId).toBeDefined();
      expect(req.context.variables).toBeDefined();
    })

    it('should extend primary Conversation class', () => {
      const conv = BotTesting.MockComponent.Conversation.any();
      expect(conv instanceof Conversation).toBe(true);
    });

  });

});
