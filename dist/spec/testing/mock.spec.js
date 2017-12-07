"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("../main");
const Testing = require("../../testing");
describe('Testing harness', () => {
    describe('MockComponent', () => {
        it('should create a request payload', () => {
            const req = Testing.MockRequest();
            expect(req.botId).toBeDefined();
            expect(req.context.variables).toBeDefined();
        });
        it('should extend primary Conversation class', () => {
            const conv = Testing.MockConversation.any();
            expect(conv instanceof main_1.Conversation).toBe(true);
        });
    });
});
//# sourceMappingURL=mock.spec.js.map