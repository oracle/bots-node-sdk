'use strict';

const { ComponentRegistry, ComponentShell } = require("../../../lib/");
const { Mock } = require("./mock.payload");

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
      invoke: (conv, cb) => {
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
    }))
    .then(done).catch(done.fail);
  });

});
