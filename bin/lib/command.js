'use strict';

const { EventEmitter } = require('events');
const { UI } = require('./ui');
const { camelize } = require('./strings');

const REG = {
  OPT_MATCH: /^(--?[a-z_-]+)(?:=["']?(.+)["']?)?/i,
  OPT_FLAGS: /--?([a-z_-]+)/ig,
  OPT_SYNTAX: /--?[a-z_-]+(?:[\s=]?([<[])(\w+)[>\]])?$/,
  OPT_DASH: /^-+/,
};

/**
 * Basic CLI parser class
 * @private
 */
class Command extends EventEmitter {

  constructor(name, description, handler) {
    super();
    this.ui = new UI();
    this._name = name;
    this._description = description;
    this._handler = handler;
    this._project = {};
    this._parent = null;

    // pre-parsed configurations
    this.commands = new Map();
    this._config = {
      flags: new Map(), // map flag syntax to an option
      ignore: [],
      options: [],
      args: [],
    };

    // parsed results
    this.options = {};
    this.arguments = [];
  }

  project(project) {
    if (project) {
      this._project = project;
      return this;
    }
    return this._project;
  }

  withHelp() {
    return this.option('-h --help', 'Display help and usage information');
  }

  name(name) {
    this._name = name || this._name;
    return this;
  }

  description(desc) {
    this._description = desc || this._description;
    return this;
  }

  version(ver) {
    this._version = ver;
    return this.option('-v --version', 'Print version information');
  }

  argument(name, description, required) {
    this._config.args.push({
      name,
      description,
      required,
    });
    return this;
  }

  option(syntax, description, defaultValue, handler) {
    const flag = this._flag(syntax, defaultValue, handler);
    // map all flags to the flag definition
    let dupe = false;
    flag.flags.forEach(f => {
      dupe = this._config.flags.has(f);
      return this._config.flags.set(f, flag);
    });
    // capture in options for help
    const { options } = this._config;
    if (dupe) {
      options.forEach((o, i) => o.name === flag.name && options.splice(i, 1));
    }
    options.push({
      name: flag.name,
      syntax,
      description,
      isBool: flag.isBool,
      defaultValue,
      handler,
    });
    return this;
  }

  ignore(name) {
    this._config.ignore.push(name);
    return this;
  }

  handler(cb) {
    this._handler = cb;
    return this;
  }

  /**
   * @param {typeof CommandDelegate} delegate 
   * @param {string} [child] - use subcommand in delegate
   * @returns {Command}
   */
  delegate(delegate, child) {
    if (delegate.prototype instanceof CommandDelegate) {
      return delegate.init(child ? this.subcommand(child) : this).command;
    }
    this.ui.output(`WARN: Ignoring unrecognized delegate ${delegate}`);
    return this;
  }

  /**
   * set/get parent command
   * @param {Command} parent 
   */
  parent(parent) {
    if (parent && parent instanceof Command) {
      this._parent = parent;
      return this;
    }
    return this._parent;
  }

  root() {
    let command = this;
    while (!command._isRoot()) {
      command = command.parent();
    }
    return command;
  }

  subcommand(name, description, handler) {
    const command = new Command(name, description, handler)
      .parent(this)
      .project(this.project());
    this.commands.set(name, command);
    return command;
  }

  runChild(name, options, args) {
    const command = this._resolveCommand([name]);
    command.options = options || {};
    command.arguments = args || [];
    command._defaults();
    return command._run(command.options, command.arguments);
  }

  /**
   * parse argv into options/arguments
   */
  parse(argv) {
    return new Promise(resolve => {
      if (!this._isRoot()) {
        return resolve(this.parent().parse(argv));
      }
      const all = argv.slice(2);
      // resolve the command from the args
      const command = this._resolveCommand(all);
      const hasArgs = all.length > 0;
      // intake all args/options
      while (all.length) {
        const next = all.shift();
        command._ingest(next, all);
      }
      // fill with defaults
      command._defaults();

      if (command.options.help || (!hasArgs && !command._handler)) {
        command._renderHelp();
        return resolve();
      }
      if (command.options.version) {
        this._renderVersion();
        return resolve();
      }
      
      resolve({
        command,
        args: command.arguments,
        options: command.options,
      });

    }).then(result => result && result.command._run(result.options, result.args))
      .then(() => this.emit(Command.RAN))
      .catch(e => {
        this.ui.output(`ERROR: ${e.message || e}`);
        process.exit(1);
        throw e;
      });
  }

  _run(options, args) {
    if (this._handler) {
      return this._handler.apply(this._handler, [options].concat(args));
    }
    return { args, options };
  }

  _defaults() {
    this._config.options.forEach(opt => {
      if (typeof this.options[opt.name] === 'undefined') {
        this.options[opt.name] = opt.isBool ? false : opt.defaultValue;
      }
    });
  }

  _inherit(config) {
    const { options } = config;
    const { ignore } = this._config;
    
    // reset options and combine with parent first
    this._config.flags.clear();
    const own = this._config.options.splice(0);
    [options, own].forEach(group => {
      group
        .filter(opt => !~ignore.indexOf(opt.name))
        .forEach(opt => this.option(opt.syntax, opt.description, opt.defaultValue, opt.handler));
    });
  }

  _resolveCommand(args) {
    const next = args[0];
    const command = this.commands.get(next);
    if (command) {
      args.shift();
      command._inherit(this._config);
      return command._resolveCommand(args);
    }
    return this;
  }

  _ingest(current, next) {
    // handle option
    if (this._isOpt(current)) {
      const flagMatch = current.match(REG.OPT_MATCH);
      const key = flagMatch[1];
      let val = flagMatch[2]; // if provided as --opt="val"
      const opt = this._config.flags.get(key);
      const name = opt ? opt.name : camelize(key);
      if (!opt) {
        // console.warn(`Unknown option: ${key}`);
        val = val || true;
      } else {
        if (!val && !opt.isBool) { // expects a value
          val = !this._isOpt(next[0]) ? next.shift() : opt.defaultValue; 
        } else if (!val && !opt.valName) { // no val and value not expected
          val = typeof opt.defaultValue !== 'undefined' ? opt.defaultValue : true; // boolean
        }

        if (!val && opt.valRequired) {
          this._err(`Option '${name}' requires a value: '${opt.valName}'`);
        }

        // call handler with current val and previous
        if (opt.handler) {
          val = opt.handler(val, this.options[name]);
        }
      }

      this.options[name] = val;
      this.emit(Command.OPTION, name, val);
      this.emit(`${Command.OPTION}:${name}`, val);
    } else { // assume argument
      this.arguments.push(current);
    }
  }

  _flag(syntax, defaultValue, handler) {
    const match = syntax.match(REG.OPT_SYNTAX);
    if (!match) {
      this._err(`Invalid option syntax: ${syntax}`);
    }
    const [valName, valRequired] = [match[2] || null, match[1] === '<'];
    const flags = syntax.match(REG.OPT_FLAGS);
    const name = camelize(flags[flags.length - 1]);
    return {
      name,
      flags,
      isBool: !valName,
      valName,
      valRequired,
      defaultValue,
      handler,
    };
  }

  _isOpt(arg) {
    return REG.OPT_MATCH.test(arg || '');
  }

  _err(msg) {
    throw new Error(msg);
  }

  _isRoot() {
    return !this._parent;
  }

  _commandPath() {
    let command = this;
    const paths = [this._name];
    while (!command._isRoot()) {
      command = command.parent();
      paths.unshift(command._name);
    }
    return paths.join(' ');
  }

  _renderDescription() {
    if (this._description) {
      this.ui.output(this._description).output('');
    }
  }

  _renderVersion() {
    this.ui.output(`Version: ${this._version}`);
    this.emit(Command.VERSION);
  }

  _renderHelp() {
    const { args, options } = this._config;
    
    this._renderDescription();

    const argFormat = arg => {
      return  `${arg.required?'<':'['}${arg.name}${arg.required?'>':']'}`;
    }

    // usage
    this.ui.output(['Usage:', this._commandPath(), (this.commands.size ? '[options] <subcommand>' : null), '[options]']
      .concat(args.map(a => argFormat(a)))
      .filter(p => !!p).join(' '));

    if (args.length) {
      this.ui.outputSection(`Arguments`, this.ui.grid(args.map(arg => {
        return [argFormat(arg), arg.description, arg.required ? '(required)' : '']
      })));
    }

    if (options.length) {
      this.ui.outputSection(`Options`, this.ui.grid(options.map(opt => {
        return [opt.syntax, opt.description, opt.defaultValue ? opt.defaultValue + ' (default)' : '' ]
      })));
    }

    if (this.commands.size) {
      const grid = [];
      this.commands.forEach(cmd => grid.push([cmd._name, cmd._description]));
      this.ui.outputSection(`Subcommands`, this.ui.grid(grid));
    }

    this.emit(Command.HELP);
  }
}

// specific events
Command.HELP = 'help';
Command.VERSION = 'version';
Command.OPTION = 'option';
Command.RAN = 'ran';

/**
 * basic abstract for subcommand implementations
 */
class CommandDelegate {
  /**
   * init command
   * @param {Command} cmd 
   */
  static init(cmd) {
    return new this(cmd);
  }

  /**
   * @param {Command} cmd 
   * @param {string} [description] 
   */
  constructor(cmd, description) {
    this.command = cmd
      .description(description)
      .handler(this.run.bind(this));
    this.ui = this.command.ui;
  }

  run() {
    this._err(`"${this.command.name()}" command must implement a "run" method`);
  }

  _delay(msg, delay) {
    return new Promise(resolve=> {
      const line = this.ui.append(msg).append('.');
      const i = setInterval(() => line.append('.'), 1e3);
      const deferred = ok => {
        clearInterval(i);
        clearTimeout(t);
        t = null;
        line.output();
        return ok !== false && resolve();
      };
      let t = setTimeout(deferred, delay);
      process.on('SIGINT', () => {
        if (t) {
          line.append('[CANCEL]');
          deferred(false);
        }
        process.exit(2);
      });
    });
  }

  _err(msg) {
    throw new Error(msg);
  }

}

module.exports = {
  Command,
  CommandDelegate,
};
