'use strict';

const fs = require('fs');
const path = require('path');
const { CommandDelegate } = require('../lib/command');
const { ChildPromise } = require('../lib/spawn');
const { CCServiceCommand } = require('./service');
const { writeTemplate, writeTemplates } = require('../lib/templates');

function nameOpt(name) {
  return name.replace(/[^\w._-]/g, '');
}

function componentTypeOpt(type) {
  let t = type.toLowerCase();
  if (t === 'c') {
    t = 'custom';
  } else if (t === 'e') {
    t = 'entityeventhandler';
  } else if (t === 's') {
    t = 'sqlqueryeventhandler';
  } else if (t === 't') {
    t = 'llmtransformationeventhandler';
  } else if (t === 'l') {
    t = 'llmcomponenteventhandler';
  }
  if (!~['custom', 'entityeventhandler', 'sqlqueryeventhandler', 'llmtransformationeventhandler', 'llmcomponenteventhandler'].indexOf(t)) {
    throw new Error(`Invalid component type: ${type}, allowable values are [c]ustom or [e]ntityEventHandler or [s]qlQueryEventHandler or llm[T]ransformationEventHandler or [l]lmComponentEventHandler.`);
  }
  return t;
}

function languageOpt(type) {
  let t = type.toLowerCase();
  t = t === 't' ? 'typescript' : (t === 'j' ? 'javascript' : t);
  if (!~['typescript', 'javascript'].indexOf(t)) {
    throw new Error(`Invalid language: ${type}, allowable values are [t]ypescript and [j]avascript.`);
  }
  return t;
}

/**
 * Command implementation for scaffolding cc package projects
 */
class CCInit extends CommandDelegate {
  constructor(cmd) {
    super(cmd, 'Initialize a new Custom Component package!');
    this.command
      .argument('dest', 'Path where project should be created (cwd if omitted)')
      .option('-l --language <language>', 'Specify the language to use [t]ypescript or [j]avascript', 'javascript', languageOpt)
      .option('-s --skip-install', 'Skip npm install')
      .option('-r --run', 'Start service when init completes (with defaults)')
      .option('-n --name <name>', 'Specify a name for the new project', null, nameOpt)
      .option('-c --component-name <name>', 'Name for the first custom component', 'helloWorld', nameOpt)
      .option('-t --component-type <type>', 'Specify the component type [c]ustom or [e]ntityEventHandler or [s]qlQueryEventHandler or [r]estServiceEventHandler  or [l]lmEventHandler', 'custom', componentTypeOpt);
    // add child command 'init component'
    this.command.delegate(CCInitComponent, 'component');
  }

  _initDir(dir) {
    dir = path.resolve(dir);
    const contents = fs.existsSync(dir) && fs.readdirSync(dir);
    if (contents && contents.length) {
      this.ui.output(`Will update contents in directory '${path.basename(dir)}'`);
      if (~contents.indexOf('package.json')) {
        this.flagUpdate();
      }
    }
    return dir;
  }

  flagUpdate() {
    this._update = true;
  }

  update(dir) {
    if (this._update) {
      const SDK = this.command.project();
      const binName = this.command.root()._name;
      const pkgFile = path.join(dir, 'package.json');
      try {
        const pkgJson = require(pkgFile);
        let { scripts, devDependencies } = pkgJson;
        // inject modifications
        scripts = Object.assign(scripts || {}, {
          [binName]: binName,
          help: `npm run ${binName} -- --help`,
          prepack: `npm run ${binName} -- --pack --dry-run`,
          start: `npm run ${binName} -- --service .`,
        });
        devDependencies = Object.assign(devDependencies || {}, {
          [SDK.name]: `^${SDK.version}`,
          express: SDK.devDependencies.express,
        });
        // update and write
        Object.assign(pkgJson, {
          main: 'main.js',
          scripts,
          devDependencies
        });
        fs.writeFileSync(pkgFile, JSON.stringify(pkgJson, null, 2));
        // check legacy files
        const deprecated = ['sdk', 'shell', 'components', 'mcebots', 'registry', 'MessageModel']
          .map(name => name + '.js')
          .filter(file => fs.existsSync(path.join(dir, file)));
        if (deprecated.length) {
          this.ui.outputSection('Deprecated', deprecated);
        }
      } catch (e) {
        this.ui.banner(e.message);
        this._err(`Failed to update existing project`);
      }
    }
  }

  run(options, dir) {
    const { name, skipInstall, componentName, componentType, language } = options;

    const templateRoot = path.resolve(__dirname, '..', 'templates', language === 'javascript' ? 'ccpackage/js' : 'ccpackage/ts');
    const SDK = this.command.project();

    dir = dir || name || process.cwd();
    this.ui.sep();
    const outDir = this._initDir(dir);
    const outDirName = path.basename(outDir);
    const outDirComponent = path.join(outDir, language === 'javascript' ? 'components' : 'src/components');
    return this._delay(`Create component package in directory '${outDirName}'`, 3e3)
      .then(() => this.ui.sep())
      .then(() => { // write package templates
        this.ui.paragraph('Writing files...');
        return writeTemplates(templateRoot, outDir, {
          name: name || 'my-component-service',
          date: new Date().toDateString(),
          componentName,
          sdkName: SDK.name,
          sdkVersion: SDK.version,
          sdkBin: this.command.root()._name,
          expressVersion: SDK.devDependencies.express,
          expressTypesVersion: SDK.devDependencies['@types/express'],
          nodeFetchTypesVersion: "^2.6.1", // SDK.devDependencies['@types/node-fetch'] TODO figure out why hudson build fails when this dev dep is added
          typescriptVersion: SDK.devDependencies.typescript
        });
      }).then(() => { // run component code generator
        return this.command.runChild('component', {
          quiet: true,
          rootDir: outDir 
        }, [componentName, componentType, outDirComponent]);
      }).then(() => { // perform updates (existing package.json)
        return this.update(outDir);
      }).then(() => { // run npm install
        if (!skipInstall) {
          this.ui.paragraph('Installing dependencies...');
          return ChildPromise.npm(['install', '--loglevel=error'], {
            cwd: outDir,
            stdio: 'inherit',
          });
        }
      }).then(() => {
        this.ui.banner(`Custom Component package '${outDirName}' created successfully!`);
      }).then(() => {
        if (options.run && !skipInstall) {
          this.ui.output();
          return CCServiceCommand.init(this.command).run({
            route: '/components',
            project: [outDir],
          });
        } else {
          this.ui.outputSection('Usage', this.ui.grid([
            [`cd ${outDirName}`],
            ['npm start', 'Start a dev server with the component package'],
          ]));
        }
      });
  }
}


/**
 * Generator command for custom components
 */
class CCInitComponent extends CommandDelegate {
  constructor(cmd) {
    super(cmd, 'Add a Custom Component to your package');
    this.command
      .ignore('componentName').ignore('run').ignore('skipInstall') // inherited from parent
      .argument('name', 'Specify a name for the component', true, nameOpt)
      .argument('type', 'Specify the component type [c]ustom or [e]ntityEventHandler or [s]qlQueryEventHandler or [r]estServiceEventHandler  or [l]lmEventHandler', true, componentTypeOpt)
      .argument('dest', 'Destination directory where component should be added', false)
      .option('-q --quiet', 'Suppress outputs')

  }

  quiet() {
    this._quiet = true;
    return this;
  }

  run(opts, ...args) {
    let { quiet, rootDir } = opts;
    this._quiet = !!quiet;
    rootDir = rootDir ? rootDir : this._getRootDir();
    if (!rootDir) {
      this._err(`Cannot find package.json, please run this command in the project root dir.`);
    } 

    const name = args.length > 0 ?  nameOpt(args[0]) : undefined;
    const type = args.length > 1 ?  componentTypeOpt(args[1]) : undefined;
    let dir = args.length > 2 ?  args[2] : undefined;

    if (!name) {
      this._err(`Please specify component name as first argument in 'init component <name> <type> <dest>' command.`);
    } 

    if (!type) {
      this._err(`Please specify component type as second argument in 'init component <name> <type> <dest>' command.`);
    } 
    
    const language = fs.existsSync(path.resolve(rootDir,'tsconfig.json')) ? 'typescript' : 'javascript';

    dir = dir ? dir : (language === 'javascript' ? 'components' : 'src/components');
    let dest = path.resolve(rootDir, dir);
    // create components dir if needed and verify it is directory
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
    } else if (!fs.statSync(dest).isDirectory()) {
      this._err(`Destination must be a directory`);
    }

    const templateRoot = path.resolve(__dirname, '..', 'templates', 'components');

    // write file
    const extension = language === 'javascript' ? 'js' : 'ts';
    const from = path.join(templateRoot, type, `template.${extension}`);
    const to = path.join(dest, `${name}.${extension}`);
    if (!fs.existsSync(to)) {
      let className = name.charAt(0).toUpperCase() + name.slice(1);
      className = className.replace('.','');
      let eventHandlerType;
      if (type === 'entityeventhandler') {
        eventHandlerType = 'ResolveEntities';
      } else if (type === 'sqlqueryeventhandler') {
        eventHandlerType = 'DataQuery';
      } else if (type === 'llmtransformationeventhandler') {
        eventHandlerType = 'LlmTransformation';
      } else if (type === 'llmcomponenteventhandler') {
        eventHandlerType = 'LlmComponent';
      } 
      writeTemplate(from, to, {
        name,
        className: className,
        eventHandlerType: eventHandlerType
      });
      if (!this._quiet) {
        this.ui.banner(`Added ${type} component: '${name}'`);
      }
    } else if (!this._quiet) {
      this._err(`Component '${name}' already exists`);
    }
  }

  _getRootDir() {
    let dir = process.cwd();
    while (dir && !fs.existsSync(path.resolve(dir,'package.json'))) {
      if (dir === path.sep ) {
        // we are at root, stop it.
        dir = undefined;
      } else {
        dir = path.join(dir, '..');
      }  
    }
    return dir;
  }

}

module.exports = {
  CCInit,
  CCInitComponent,
};
