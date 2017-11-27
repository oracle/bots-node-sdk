"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../../lib");
const BotTesting = require("../../testing");
describe('Testing harness', () => {
    describe('MockComponent', () => {
        it('should create a request payload', () => {
            const req = BotTesting.MockComponent.Request();
            expect(req.botId).toBeDefined();
            expect(req.context.variables).toBeDefined();
        });
        it('should extend primary Conversation class', () => {
            const conv = BotTesting.MockComponent.Conversation.any();
            expect(conv instanceof lib_1.Conversation).toBe(true);
        });
    });
});
//# sourceMappingURL=mock.spec.js.map