"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("../main");
describe('Text Utilities', () => {
    it('should find nearest match', () => {
        const strInput = 'Hello World!';
        const strOptions = ['Hello Child', 'Hello Bird', 'Hello World'];
        let match = main_1.Util.Text.approxTextMatch(strInput, strOptions, true, true, 0.9);
        expect(match).not.toBeNull();
        expect(match.exactMatch).toBe(false);
        expect(match.similarity).toBeGreaterThanOrEqual(0.9);
        expect(match.item).toBeDefined();
    });
});
//# sourceMappingURL=text.spec.js.map