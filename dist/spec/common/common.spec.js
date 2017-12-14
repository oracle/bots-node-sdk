"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../common/constants");
const definitions_1 = require("../../common/definitions");
describe('Common', () => {
    describe('CONSTANTS', () => {
        it('should declare constants', () => {
            expect(constants_1.CONSTANTS.WEBHOOK_HEADER).toEqual('X-Hub-Signature');
            expect(constants_1.CONSTANTS.DEFAULT_COMPONENT_DIR).toContain('components');
        });
    });
    describe('definitions', () => {
        it('should test for type', () => {
            expect(definitions_1.isType(SomeClass)).toBe(true);
            expect(definitions_1.isType({})).toBe(false);
        });
    });
});
class SomeClass {
}
//# sourceMappingURL=common.spec.js.map