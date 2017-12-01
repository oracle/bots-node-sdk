"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("../../main");
const mock_payload_1 = require("./mock.payload");
/**
 * migrated unit tests from source sdk.
 */
describe('Component Conversation SDK', () => {
    it('should fail with expected error with empty request', done => {
        try {
            const sdk = new main_1.Lib.Conversation({});
            done.fail('sdk did not throw error');
        }
        catch (err) {
            expect(err).toBeDefined();
            done();
        }
    });
    it('should fail with expected error without context', done => {
        try {
            const sdk = new main_1.Lib.Conversation(mock_payload_1.Mock.req.nocontext);
            done.fail('sdk did not throw error');
        }
        catch (err) {
            expect(err).toBeDefined();
            done();
        }
    });
    it('should build instance with no variables', () => {
        const sdk = new main_1.Lib.Conversation(mock_payload_1.Mock.req.novars);
        expect(sdk).not.toBeNull();
        expect(sdk.properties().minAge).toBeDefined();
    });
    it('should read and write to response (variables, action, etc)', () => {
        const sdk = new main_1.Lib.Conversation(mock_payload_1.Mock.req.complete);
        expect(sdk).not.toBeNull();
        expect(sdk.response().modifyContext).toEqual(false);
        expect(sdk.variable('name')).toEqual('Joe');
        expect(sdk.variable('age')).toEqual(100.0);
        expect(sdk.variable('hungry')).toEqual(true);
        expect(sdk.variable('nonexistent')).toBeUndefined(); // non-existent properties return undefined
        expect(sdk.response().modifyContext).toEqual(false); // only reading so far
        expect(sdk.channelType()).toEqual('test');
        sdk.variable('name', 'Ken');
        expect(sdk.variable('name')).toEqual('Ken');
        expect(sdk.response().modifyContext).toEqual(true); // wrote to context
        sdk.variable('age', 55.5);
        expect(sdk.variable('age')).toEqual(55.5);
        expect(sdk.response().modifyContext).toEqual(true); // wrote to context
        sdk.variable('hungry', false);
        expect(sdk.variable('hungry')).toEqual(false);
        expect(sdk.response().modifyContext).toEqual(true); // wrote to context
        sdk.action('eatpizza').done(true);
        expect(sdk.response()).toEqual(mock_payload_1.Mock.res.complete, 'Unexpected response');
    });
});
//# sourceMappingURL=sdk.spec.js.map