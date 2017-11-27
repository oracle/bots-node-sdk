"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../../../lib");
describe('BotComponentRegistry', () => {
    let registry;
    beforeAll(() => {
        registry = lib_1.ComponentRegistry.assemble(null, '../../support/example/components', __dirname);
    });
    it('should not assemble invalid path', () => {
        expect(lib_1.ComponentRegistry.assemble(registry, 'babytown').isValid()).toBe(false);
    });
    it('should assemble registry', () => {
        expect(registry instanceof lib_1.ComponentRegistry).toBe(true);
        expect(registry.isCollection('foo')).toBe(false);
        expect(registry.isCollection('sub')).toBe(true);
        expect(registry.getRegistry()).toEqual(registry);
        // collections
        expect(registry.getRegistry('sub') instanceof lib_1.ComponentRegistry).toBe(true);
        expect(registry.getCollectionNames().length).toBeGreaterThan(0);
    });
    it('should collect components', () => {
        expect(registry.getComponents().size).toBeGreaterThan(0);
        expect(registry.getComponent('foo')).toBeUndefined();
        expect(registry.getComponent('test.one')).toBeDefined();
        expect(registry.isComponent('test.one')).toBe(true);
    });
    it('should implement components accessor', () => {
        expect(registry.components['test.one']).toBeDefined();
    });
    it('should return metadata', () => {
        expect(registry.getMetadata()).toBeDefined();
        expect(registry.getMetadata('foo').length).toEqual(0);
    });
});
//# sourceMappingURL=registry.spec.js.map