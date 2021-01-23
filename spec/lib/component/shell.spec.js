'use strict';

const { ComponentRegistry, ComponentShell } = require("../../../lib/");
const { EntityResolutionContext } = require("../../../lib/entity/entityResolutionContext");
const { Mock } = require("./mock.payload");
const EventHandlerMockRequest = require('./eh.req.json');

describe('Component Shell', () => {
  
  it('should throw without registry', () => {
    expect(ComponentShell.bind(null, null, null)).toThrow();
  });
  
  it('should support legacy registry', () => {
    const shell = ComponentShell(null, {components: {}});
    const meta = shell.getAllComponentMetadata();
    expect(meta.version).toBeTruthy();
    expect(meta.components.length).toEqual(0);
  });

  it('should handle component invocation errors', done => {
    const fooComponent = {
      metadata: () => ({
        name: 'foo'
      }),
      invoke: (context, done) => { // eslint-disable-line no-unused-vars
        throw new Error('nasty code');
      },
    };

    const registry = ComponentRegistry.create(fooComponent);
    const shell = ComponentShell(null, registry);
    const shellWrap = (cb) => {
      shell.invokeComponentByName('foo', Mock().req.complete, null, cb);
    };

    // case where invoke is called without a callback
    expect(shellWrap).toThrow();
    new Promise(resolve => {
      // case where cc is invoked and throws err
      shellWrap(err => resolve(expect(err).toMatch(/nasty/)));
    }).then(() => new Promise(resolve => {
      // case where unknown component is called
      shell.invokeComponentByName('bar', null, null, err => {
        resolve(expect(err).toMatch(/unknown/i));
      });
    })).then(done).catch(done.fail);
  });

  it('should handle component invocation without callback arg', done => {
    const fooComponent = {
      metadata: () => ({
        name: 'foo'
      }),
      invoke: (context) => { // eslint-disable-line no-unused-vars
        throw new Error('one arg');
      },
    };

    const registry = ComponentRegistry.create(fooComponent);
    const shell = ComponentShell(null, registry);
    const shellWrap = (cb) => {
      shell.invokeComponentByName('foo', Mock().req.complete, null, cb);
    };

    // case where invoke is called without a callback
    expect(shellWrap).toThrow();
    new Promise(resolve => {
      // case where cc is invoked and throws err
      shellWrap(err => resolve(expect(err).toMatch(/one arg/)));
    }).then(done).catch(done.fail);
  });

  it('should report invalid number of invoke args', done => {
    const fooComponent = {
      metadata: () => ({
        name: 'foo'
      }),
      invoke: () => {
        throw new Error('no args');
      },
    };

    const registry = ComponentRegistry.create(fooComponent);
    const shell = ComponentShell(null, registry);
    const shellWrap = (cb) => {
      shell.invokeComponentByName('foo', Mock().req.complete, null, cb);
    };

    // case where invoke is called without a callback
    expect(shellWrap).toThrow();
    new Promise(resolve => {
      // case where cc is invoked and throws err
      shellWrap(err => resolve(expect(err).toMatch(/invalid number of arguments/)));
    }).then(done).catch(done.fail);
  });


  /**
   * Test event handler features of the shell
   */
  describe('Event Handler', () => {
   
    const eventComponent = {
      metadata: () => ({
        name: 'simple',
        eventHandlerType: 'ResolveEntities'
      }),
      handlers: () => ({ 
        entity: {
          validate:async () => {'validateEntity'}
        },  
        items: {
          Type: {
            validate:async () => {'validateType'}
          }
        },
        custom: {
          customEvent:async () => {'customEvent'}
        }  
      })
    };

    class eventClassComponent {

      metadata() {
        return {
          name: 'classtype',
          eventHandlerType: 'ResolveEntities'
        };
      }
      
      handlers() {
        return {
          entity: { // eslint-disable-line no-unused-labels
            validate: () => {'validateEntity'} // eslint-disable-line no-unused-labels
          },  
          items: { // eslint-disable-line no-unused-labels
            Type: { // eslint-disable-line no-unused-labels
              validate: () => {'validateType'} // eslint-disable-line no-unused-labels
            }
          },
          custom: { // eslint-disable-line no-unused-labels
            customEvent: () => {'customEvent'} // eslint-disable-line no-unused-labels
          }  
        }
      }
    }

    // setup for different tests
    let registry, shell;
    beforeAll(() => {
      registry = ComponentRegistry.create([
        eventComponent,
        eventClassComponent,
      ]);
      shell = ComponentShell(null, registry);
    });


    it('should include event handler metadata', done => {
      const allMeta = shell.getAllComponentMetadata();
      const { components } = allMeta;
      const cMeta = components.find(c => c.name === 'simple');

      expect(components.length).toBeGreaterThan(0);
      expect(cMeta.events).toEqual(jasmine.any(Array));
      expect(cMeta.events).toContain('entity.validate');
      expect(cMeta.events).toContain('items.Type.validate');
      expect(cMeta.events).toContain('custom.customEvent');
      done();
    });

    it('should invoke event handler', done => {
      let comp = registry.getComponent('simple')
      // Stub the handlers method to return the same object instance each time
      // otherwise the method returns a new object each time.
      const handlers = comp.handlers();
      spyOn(comp, 'handlers').and.returnValue(handlers);
      let itemEvents = handlers.items.Type;
      let validate = spyOn(itemEvents, 'validate').and.callThrough();      
      shell.invokeResolveEntitiesEventHandler('simple', EventHandlerMockRequest, (err, res) => {
        expect(err).toBeNull();
        expect(res).toEqual(jasmine.any(Object));
        expect(validate).toHaveBeenCalledWith(jasmine.any(Object), jasmine.any(EntityResolutionContext));
        done();
      });
    });
  });

});
