'use strict';

const fs = require('fs');
const path = require('path');
const { CommandDelegate } = require('../lib/command');
const { ChildPromise } = require('../lib/spawn');
const { CCServiceCommand } = require('./service');

function writeTemplates(from, to, vars) {
  fs.readdirSync(from)
    .forEach(filename => {
      const src = path.join(from, filename);
      const stat = fs.statSync(src);
      const dest = path.join(to, filename.replace(/^_+/, ''));
      if (stat.isDirectory()) {
        if (!fs.existsSync(dest)) {
          fs.mkdirSync(dest);
        }
        return writeTemplates(src, dest, vars);
      }
      return writeTemplate(src, dest, vars);
    });
}

function writeTemplate(src, dest, vars) {
  if (fs.existsSync(dest)) {
    console.warn(`WARN: ${dest} already exists`);
    return;
  }
  console.log(`Writing file: ${dest}`);
  const template = fs.readFileSync(src).toString();
  const output = Object.keys(vars).reduce((temp, prop) => {
    return temp.replace(new RegExp(`{{${prop}}}`, 'gi'), vars[prop]);
  }, template);
  return fs.writeFileSync(dest, output);
}

/**
 * Command implementation for scaffolding cc_package projects
 */
class CCInit extends CommandDelegate {
  constructor(cmd) {
    super(cmd, 'Initialize a new Custom Component package');
    this.command
      .argument('dest', 'Path where project should be created (cwd if omitted)')
      .option('-s --skip-install', 'Skip npm install')
      .option('-r --run', 'Start service when init completes (with defaults)')
      .option('-n --name <name>', 'Specify a name for the new project', null, name => name.replace(/[^\w._-]/g, ''))
      .option('-c --component-name <name>', 'Name for the first custom component', 'hello.world', name => name.replace(/[^\w._-]/g, ''));

    this.command.delegate(CCInitComponent, 'component');
    this.templateRoot = path.resolve(__dirname, '..', 'templates', 'ccpackage');
  }

  _initDir(dir) {
    dir = path.resolve(dir);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    const contents = fs.readdirSync(dir);
    if (contents.length) {
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
      } catch (e) {
        this.ui.banner(e.message);
        this._err(`Failed to update existing project`);
      }
    }
  }

  run(options, dir) {
    const { name, skipInstall, componentName } = options;
    const SDK = this.command.project();

    dir = dir || name || process.cwd();
    this.ui.sep();
    const outDir = this._initDir(dir);
    const outDirName = path.basename(outDir);
    const outDirComponent = path.join(outDir, 'components');
    return this._delay(`Create component package in directory '${outDirName}'`, 3e3)
      .then(() => this.ui.sep())
      .then(() => { // write package templates
        this.ui.paragraph('Writing files...');
        return writeTemplates(this.templateRoot, outDir, {
          name: name || 'my-custom-component',
          sdkName: SDK.name,
          sdkVersion: SDK.version,
          sdkBin: this.command.root()._name,
          expressVersion: SDK.devDependencies.express,
        });
      }).then(() => { // run component code generator
        return CCInitComponent.init(this.command).quiet().run({
          name: componentName
        }, outDirComponent);
      }).then(() => { // perform updates (existing package.json)
        return this.update(outDir);
      }).then(() => { // run npm install
        if (!skipInstall) {
          this.ui.paragraph('Installing dependencies...');
          return ChildPromise.spawn('npm', ['install', '--loglevel=error'], {
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
      .argument('dest', 'Destination directory where component should be added', true)
      .option('-n --name <name>', 'Specify a name for the Custom Component', null, name => name.replace(/[^\w._-]/g, ''));

    this.templateRoot = path.resolve(__dirname, '..', 'templates', 'component');
  }

  quiet() {
    this._quiet = true;
    return this;
  }

  run(opts, dir) {
    const { name } = opts;
    if (!name) {
      this._err(`Component name is required`);
    }
    const dest = dir && path.resolve(dir);
    if (!dest) {
      this._err(`Missing output destination`);
    }
    // verify dest exists and is directory
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
    } else if (!fs.statSync(dest).isDirectory()) {
      this._err(`Destination must be a directory`);
    }

    // write file
    const from = path.join(this.templateRoot, 'custom.js');
    const to = path.join(dest, `${name}.js`);
    if (!fs.existsSync(to)) {
      writeTemplate(from, to, { name });
      if (!this._quiet) {
        this.ui.banner(`Added Custom Component: '${name}'`);
      }
    } else if (!this._quiet) {
      this._err(`Component '${name}' already exists`);
    }
  }
}

module.exports = {
  CCInit,
  CCInitComponent,
};
