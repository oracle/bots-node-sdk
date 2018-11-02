const { Command, CommandDelegate } = require('../../bin/lib/command');
const { UI } = require('../../bin/lib/ui');
const { Writable } = require('stream');

class NoopStream extends Writable {
  _write(chunk, encoding, cb) {
    cb();
  }
}

function stubUi(ui, cb) {
  const stream = new NoopStream();
  ui.stream = stream;
  return spyOn(stream, 'write').and.callFake(msg => cb && cb(msg));
}

describe('CLI foundation', () => {

  describe('UI', () => {
    
    let ui;
    let out;
    beforeEach(() => {
      out = '';
      ui = new UI();
      stubUi(ui, msg => out += msg);
    });

    it('should write to stream', () => {
      ui.write('one', 'two');
      expect(out).toMatch(/one\s+two\n/);
    });

    it('should format outputs', () => {
      ui.output('line')
        .outputLines(`multiline\noutput`)
        .paragraph('paragraph')
        .banner('banner')
        .sep()
        .outputGrid([['col', 'col2'], ['value', 'value2']]);
      expect(out).toMatch(/\s+value\s{2,}value2/);
    });

  });

  describe('Command', () => {
    let cmd;
    let out;
    beforeEach(() => {
      cmd = new Command();
      out = '';
      stubUi(cmd.ui, m => out += m);
    });

    // intercept exits
    beforeAll(() => spyOn(process, 'exit').and.callFake(() => {}))

    it('should support basic usage configurations', () => {

      cmd.withHelp()
        .project({name: 'tester'})
        .name('cmd').description('test cmd')
        .option('-o, --opt <name>')
        .argument('arg', 'an argument')
        .argument('req', 'required argument', true)
        ._renderHelp();

      expect(out).toContain('Usage:');
      expect(out).toContain('Arguments:');
      expect(out).toContain('Options:');
      expect(cmd.project().name).toBe('tester');
    });

    it('should error invalid flags', () => {
      const err = () => cmd.option('invalid syntax');
      expect(err).toThrow();
    });

    it('should support extensibility', () => {
      const root = cmd;
      const parent = root.subcommand('parent', 'a parent command');
      const child = parent.subcommand('child', 'a child command');

      root.version('0.0.0');
      parent.option('--foo', 'parent foo');
      parent.option('--bar', 'parent bar');
      child.option('--bar', 'child bar').ignore('foo');

      expect(child.root()).toEqual(root);
      expect(parent._isRoot()).toBe(false);
      expect(root._isRoot()).toBe(true);

      const inherit = spyOn(child, '_inherit').and.callThrough();
      expect(root._resolveCommand(['parent', 'child']));
      expect(inherit).toHaveBeenCalledWith(parent._config);

      root._renderHelp();
      expect(out).toContain('<subcommand>');
    });

    it('should parse inputs', done => {
      const hndl = {
        root: null,
        sub: null,
        opt: null,
      };
      const spies = Object.keys(hndl).map(k => spyOn(hndl, k));
      const runs = [];
      const run = (command, ...args) => {
        const r = command.parse(new Array(2).concat(args)).catch(e => e);
        runs.push(r);
        return r;
      };
      const [CHILD, CHILD2] = ['child', 'two'];
      // setup
      cmd.withHelp()
        .version('1.2.3')
        .option('-o, --opt [val]', '', 'defaultValue')
        .handler(hndl.root)
        .subcommand(CHILD, 'child cmd', hndl.sub)
        .option('-c, --child', 'option')
        .option('-r, --required <val>', 'required option', null, hndl.opt)
        .argument('foo').root()
        .subcommand(CHILD2, 'another child');
      
      stubUi(cmd.commands.get(CHILD).ui);
      stubUi(cmd.commands.get(CHILD2).ui);

      const child = cmd.commands.get(CHILD);
      // run root with single option
      run(cmd, '-o', '--unknown', 'arg')
        .then(() => {
          expect(spies[0]).toHaveBeenCalled();
          expect(cmd.options.opt).toEqual('defaultValue');
          expect(cmd.options.unknown).toBe(true);
          expect(cmd.arguments.length).toBeGreaterThanOrEqual(1);
        });
      // run with version option
      run(cmd, '--version')
        .then(() => expect(out).toContain('1.2.3'));

      run(child, CHILD, '-c')
        .then(() => expect(child.options.child).toBe(true));
      
      run(cmd, CHILD, '--required')
        .then(e => expect(e instanceof Error).toBe(true));
      
      run(cmd, CHILD, '--required', 'value')
        .then(() => expect(hndl.opt).toHaveBeenCalled());

      run(cmd, CHILD2, 'an arg')
        .then(() => expect(cmd.commands.get(CHILD2).arguments).toContain('an arg'));

      const helpspy = spyOn(cmd.commands.get(CHILD2), '_renderHelp').and.callThrough();
      run(cmd, CHILD2) // no args no handler
        .then(() => expect(helpspy).toHaveBeenCalled());

      Promise.all(runs)
        .then(() => done()).catch(done.fail);
    });

    it('should support delegate', done => {
      class Delegate extends CommandDelegate {
        run() { }
      }
      const run = spyOn(Delegate.prototype, 'run').and.callThrough();
      cmd.delegate(Delegate)
        .delegate(Delegate, 'child')
        .parse(new Array(2).concat('child'))
        .then(() => {
          expect(run).toHaveBeenCalled();
        }).then(done).catch(done.fail);
    })

  });

});
