
const { ChildPromise } = require('../../bin/lib/spawn');

describe('ChildPromise', () => {

  it('should spawn process as promise', done => {
    const p = ChildPromise.spawn('ls', ['-l'], {
      cwd: __dirname,
    });
    expect(p instanceof Promise).toBe(true);

    p.then(out => expect(out).toMatch(/\w+\.spec\.js/))
      .then(done).catch(done.fail);
  });

  it('should reject on error', done => {
    ChildPromise.spawn('_testunknowncmd', [])
      .then(() => Promise.reject('should not resolve'), () => {})
      .then(done).catch(done.fail)
  });

});