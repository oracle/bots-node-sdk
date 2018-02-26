import * as path from 'path';

/**
 * test export structure such as:
 * import { Lib } from '@oracle/bots-node-sdk';
 * vs.
 * import * as Lib from '@oracle/bots-node-sdk/lib';
 */
describe('Main module', () => {
  const top = '../../';
  const main = require(top); // main package.json
  const submodules: string[] = ['config', 'lib', 'middleware', 'util'];

  submodules.forEach(name => {
    const alias = name.charAt(0).toUpperCase() + name.slice(1); // lib ==> Lib
    describe(`${alias} and /${name}`, () => {
      // require by top-level directory package.json
      const submodule = require(path.join(top, name));
      Object.keys(submodule).forEach(key => {
        it(`should expose '${key}' equally`, () => {
          expect(main[alias][key]).toBeDefined();
          const equals = submodule[key] === main[alias][key];
          expect(equals || main[alias][key].prototype instanceof submodule[key]).toBe(true, `${submodule[key]} mismatch`);
        });
      })
    });
  });
});
