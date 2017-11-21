import { ComponentRegistry } from '../../../lib';

describe('BotComponentRegistry', () => {
  let registry: ComponentRegistry;

  beforeAll(() => {
    registry = ComponentRegistry.assemble(null, '../../support/example/components', __dirname);
  });

  it('should not assemble invalid path', () => {
    expect(ComponentRegistry.assemble(registry, 'babytown').isValid()).toBe(false);
  });

  it('should assemble registry', () => {
    expect(registry instanceof ComponentRegistry).toBe(true);
    expect(registry.isCollection('foo')).toBe(false);
    expect(registry.isCollection('sub')).toBe(true);
    expect(registry.getRegistry()).toEqual(registry);
    // collections
    expect(registry.getRegistry('sub') instanceof ComponentRegistry).toBe(true);
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
  })

});
