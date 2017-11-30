"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("../../main");
const a_component_1 = require("../../support/example/more.components/a.component");
const b_component_1 = require("../../support/example/more.components/b.component");
describe('ComponentRegistry', () => {
    let registry;
    beforeAll(() => {
        registry = main_1.ComponentRegistry.assemble(null, '../../support/example/components', __dirname);
    });
    // Test manual registry creation
    describe('manual registry', () => {
        it('should create from objects', () => {
            const reg = main_1.ComponentRegistry.create([
                a_component_1.ComponentA,
                require('../../support/example/more.components/b.component') // Object with {[key: string]: component}
            ], __dirname);
            expect(reg.getComponent('more.a') instanceof a_component_1.ComponentA).toBe(true);
            expect(reg.getComponent('more.b') instanceof b_component_1.ComponentB).toBe(true);
        });
        it('should create from strings', () => {
            const reg = main_1.ComponentRegistry.create([
                '../../support/example/more.components/a.component',
                '../../support/example/more.components/b.component.js',
                '../../support/example/more.components/folder',
            ], __dirname);
            expect(reg.getComponent('more.a')).toBeTruthy();
            expect(reg.getComponent('more.b')).toBeTruthy();
            expect(reg.getComponent('more.c')).toBeTruthy();
        });
        it('should be resilient to bad paths', () => {
            const reg = new main_1.ComponentRegistry(null);
            expect(reg['__resolveComponents'].bind(reg, '../funkypath')).not.toThrow();
        });
    });
    describe('filesystem scanning', () => {
        it('should not assemble invalid path', () => {
            expect(main_1.ComponentRegistry.assemble(registry, 'babytown').isValid()).toBe(false);
        });
        it('should assemble registry from fs', () => {
            expect(registry instanceof main_1.ComponentRegistry).toBe(true);
            expect(registry.isCollection('foo')).toBe(false);
            expect(registry.isCollection('sub')).toBe(true);
            expect(registry.getRegistry()).toEqual(registry);
            // collections
            expect(registry.getRegistry('sub') instanceof main_1.ComponentRegistry).toBe(true);
            expect(registry.getCollectionNames().length).toBeGreaterThan(0);
        });
        it('should collect components from fs', () => {
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
    describe('merging', () => {
        it('should shallow merge components', () => {
            const reg = main_1.ComponentRegistry.create([a_component_1.ComponentA]);
            expect(registry.merge(reg, false).getComponent('more.a')).toBeTruthy();
            expect(registry.getRegistry('sub').getComponent('more.a')).toBeFalsy();
        });
        it('should recursively merge components', () => {
            const reg = main_1.ComponentRegistry.create([b_component_1.ComponentB]);
            expect(registry.merge(reg, true).getComponent('more.b')).toBeTruthy();
            expect(registry.getRegistry('sub').getComponent('more.b')).toBeTruthy();
        });
    });
});
//# sourceMappingURL=registry.spec.js.map