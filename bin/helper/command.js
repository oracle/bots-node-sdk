const { EventEmitter } = require('events');
const { UI } = require('./ui');

function camelize(str) {
  return str.replace(/^\W+/, '').replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
    if (+match === 0) return "";
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  }).replace(/\W/g, '');
}

const REG = {
  OPT_MATCH: /^(--?[a-z_-]+)(?:=["']?(.+)["']?)?/,
  OPT_FLAGS: /--?([a-z_-]+)/g,
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
    this.name = name;
    this.description = description;
    this.handler = handler;

    // pre-parsed configurations
    this._config = {
      flags: new Map(), // map flag syntax to an option
      options: [],
      args: [],
    };

    // parsed results
    this.parent = null;
    this.commands = new Map();
    this.options = {};
    this.arguments = [];
  }

  withHelp() {
    return this.option('-h, --help', 'Display help and usage information');
  }

  description(desc) {
    this.description = desc;
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
    // console.log(flag);
    // map all flags to the flag definition
    flag.flags.forEach(f => {
      this._config.flags.set(f, flag);
    });
    // capture in options for help
    this._config.options.push({
      name: flag.name,
      syntax,
      description,
      isBool: flag.isBool,
      defaultValue,
    });
    return this;
  }

  handler(cb) {
    this.handler = cb;
    return this;
  }

  subcommand(name, description, handler) {
    const command = new Command(name, description, handler);
    command.parent = this;
    this.commands.set(name, command);
    return command;
  }

  /**
   * parse argv into options/arguments
   */
  parse(argv) {
    return new Promise(resolve => {
      if (!this._isRoot()) {
        return resolve(this.parent.parse(argv));
      }
      const all = argv.slice(2);
      const command = this._resolveCommand(all);
      while (all.length) {
        const next = all.shift();
        command._ingest(next, all);
      }

      command._defaults();

      if (command.options.help) {
        return command._renderHelp();
      }

      resolve({
        args: command.arguments,
        options: command.options,
      });

    }).then(result => {
      if (this.handler) {
        this.handler.apply(this.handler, [result.options].concat(result.args));
      }
      return result;
    });
  }

  _defaults() {
    this._config.options.forEach(opt => {
      if (typeof this.options[opt.name] === 'undefined') {
        this.options[opt.name] = opt.isBool ? false : opt.defaultValue;
      }
    });
  }

  _resolveCommand(args) {
    const next = args[0];
    const command = this.commands.get(next);
    if (command) {
      args.shift();
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
          this._err(`Option ${name} requires a value: ${opt.valName}`);
        }

        // call handler with current val and previous
        if (opt.handler) {
          val = opt.handler(val, this.options[name]);
        }
      }

      this.options[name] = val;
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
    return !this.parent;
  }

  _renderHelp() {
    const { args, options } = this._config;
    
    if (this.description) {
      this.ui.output(this.description).output('');
    }

    // usage
    this.ui.output(['Usage:', this.name, (this.commands.size ? '<subcommand>' : null), '[options]']
      .concat(args.map(a => `${a.requied?'<':'['}${a.name}${a.requied?'>':']'}`))
      .filter(p => !!p).join(' '));

    if (args.length) {
      this.ui.outputSection(`Arguments`, this.ui.grid([['Name:', 'Description:', 'Required:']].concat(args.map(arg => {
        return [arg.name, arg.description, arg.required ? 'true' : 'false']
      }))));
    }

    if (options.length) {
      this.ui.outputSection(`Options`, this.ui.grid([['Flag:', 'Description:', 'Default:']].concat(options.map(opt => {
        return [opt.syntax, opt.description, opt.defaultValue ? opt.defaultValue : '' ]
      }))));
    }

    if (this.commands.size) {
      const grid = [];
      this.commands.forEach(cmd => grid.push([cmd.name, cmd.description]));
      this.ui.outputSection(`Subcommands`, this.ui.grid(grid));
    }

    this.emit(Command.HELP);
  }
}

// specific events
Command.HELP = 'help';

module.exports = {
  Command,
}