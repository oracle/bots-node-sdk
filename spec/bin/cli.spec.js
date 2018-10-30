const fs = require('fs');
const path = require('path');
const child_process = require('child_process');

const CONF = require('../support/spec.config');
const { ChildPromise } = require('../../bin/lib/spawn');
const { loadVerifyComponent } = require('../../bin/commands/pack');
const { mkTempDir } = require('./helper');
const { httpClient } = require('../../common/http');

const bin = require.resolve('../../bin/sdk');
const run = (cwd, ...args) => {
  return ChildPromise.spawn(bin, args, { cwd });
};

describe(`CLI: bots-node-sdk`, () => {

  it('should show help', done => {
    run(null, '--help')
      .then(out => {
        expect(out).toContain('Subcommands:');
        expect(out).toContain('init');
        expect(out).toContain('service');
        expect(out).toContain('pack');
      }).then(done).catch(done.fail);
  });

  describe('Command: init', () => {

    it('should show help', done => {
      run(null, 'init', '--help')
        .then(out => {
          expect(out).toContain('-r --run');
          expect(out).toContain('-s --skip-install');
          expect(out).toContain('Subcommands:');
          expect(out).toContain('component');
        }).then(done).catch(done.fail);
    });

    it('should init a cc package', done => {
      const tmp = mkTempDir();
      const [pName, ccName] = ['test_p', 'test_cc'];
      const outDir = path.join(tmp, pName);
      const init = ['init', '--skip-install'];
      run(tmp, ...init.concat('--name', pName, '-c', ccName))
        .then(() => {
          // anticipated outDir is created
          expect(fs.existsSync(outDir)).toBe(true);
          expect(fs.existsSync(path.join(outDir, 'components', `${ccName}.js`))).toBe(true);
          expect(loadVerifyComponent.bind(null, outDir)).not.toThrow();
        })
        .then(() => run(outDir, ...init)) // run again as update
        .then(() => {
          expect(fs.existsSync(path.join(outDir, 'components', `hello.world.js`))).toBe(true);
        }).then(done).catch(done.fail);
    }, 1e4);

    describe('Subcommand: component', () => {
      const initc = ['init', 'component'];

      it('should require a name', done => {
        run(null, ...initc)
          .catch(e => {
            expect(e).toContain('name is required');
            done();
          });
      });

      it('should require a destination', done => {
        run(null, ...initc.concat('--name', 'foo'))
          .catch(e => {
            expect(e).toContain('Missing output destination');
            done();
          });
      });
    });

    // TODO standalone component init...
  });

  describe('Command: service', () => {
    const tmp = mkTempDir();
    const ccName = 'test_cc';
    it('should run a cc package', done => {
      run(tmp, 'init', '--skip-install', '-c', ccName) // create new package
        .then(() => {
          return new Promise(resolve => {
            let sOut = '';
            const service = child_process.spawn(bin, ['service', '.', '--port', CONF.port], { cwd: tmp });
            // detect readystate
            service.stdout.on('data', d => {
              sOut += `${d}`;
              if (~sOut.indexOf('Ready')) {
                resolve(service);
              }
            });
          });
        }).then(service => {
          const fetch = httpClient();
          return fetch(`http://127.0.0.1:${CONF.port}/components`)
            .then(res => res.json())
            .then(r => {
              expect(r.components && r.components.some(cc => cc.name === ccName)).toBe(true);
            })
            // cleanup & shutdown
            .then(() => service.kill())
            .catch(e => { service.kill(); throw e;});
        })
        .then(done).catch(done.fail);
    });
  });

});
