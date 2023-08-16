'use strict';

// const os = require('os');
const fs = require('fs');
const path = require('path');
const util = require('util');
const { camelize } = require('../lib/strings');
const { CommandDelegate } = require('../lib/command');
const { ChildPromise } = require('../lib/spawn');
const { writeTemplate, writeTemplates } = require('../lib/templates');

const sdkName = require('../../package.json').name;

/**
 * Utility for loading a component package metadata
 * @param {string} ccPath 
 */
const loadVerifyComponent = ccPath => {
  const ref = path.basename(ccPath);
  // verify & validate
  if (!fs.existsSync(ccPath)) {
    throw new Error(`Package '${ref}' does not exist`);
  }
  const pkgJsonPath = path.join(ccPath, 'package.json');
  if (!fs.existsSync(pkgJsonPath)) {
    throw new Error(`Package '${ref}' must contain a package.json file`);
  }
  // load package.json and module
  const ccPkgJson = require(pkgJsonPath);
  const ccPkg = require(ccPath);
  // verify components
  if (!ccPkg.components) {
    throw new Error(`Package '${ref}' does not export components`);
  }
  if (Array.isArray(ccPkg.components)) {
    if (ccPkg.components.length < 1) {
      throw new Error(`Package '${ref}' should export 1 or more components`);
    }
  } else if (typeof ccPkg.components === 'object')  {
    if (Object.keys(ccPkg.components).length === 0) {
      throw new Error(`Package '${ref}' should export 1 or more components`);
    }
  } else if (typeof ccPkg.components !== 'string') {
    throw new Error(`Package '${ref}' should export components as an array or object`);
  }

  // check for self
  const sdkVersionSpec = ['dependencies', 'devDependencies', 'peerDependencies']
    .map(scope => ccPkgJson[scope]).filter(deps => !!deps)
    .reduce((spec, deps) => spec || deps[sdkName], null);
  
  // resolve metadata
  return {
    ref,
    path: ccPath,
    json: ccPkgJson,
    module: ccPkg,
    sdkSpec: sdkVersionSpec,
  };
};

const npmCompile = async (dir) => {
  const isTs = fs.existsSync(path.resolve(dir, 'tsconfig.json'));
  if (isTs) {
    // get bin path, command below throws error with latest npm versions: Unknown command: "bin"
    //  const npmbin = await ChildPromise.npm(['bin'], { cwd: dir });
    // get expected tsc bin
    // const tsc = path.join(npmbin, 'tsc');
    const tsc = path.join(dir, 'node_modules/.bin/tsc');
    if (!fs.existsSync(tsc)) {
      throw new Error(`Typescript detected but 'typescript' is not installed`);
    }
    // run tsc
    await ChildPromise.spawn(tsc, ['-p', '.'], { cwd: dir });
  }
};

const OUT_FORMAT = 'service-%s-%s';

/**
 * Command implementation for scaffolding cc package projects
 */
class CCPack extends CommandDelegate {

  constructor(cmd) {
    super(cmd, 'Create a deployable Custom Component artifact');
    this.command
      .argument('path', 'Specify path to Component Package')
      .option('-d --dry-run', 'Perform package validation only')
      .option('-s --service <type>', 'Specify a target service type <embedded|express|mobile-api>', 'embedded', w => w.toLowerCase())
      .option('-e --endpoint <url>', 'Define endpoint/route for custom component service', '/components');
    this.templateRoot = path.resolve(__dirname, '..', 'templates', 'ccservice');
  }

  _npmPack() {
    const { name, version } = this.cc.json;
    return ChildPromise.npm(['pack'], {
      cwd: this.cc.path,
      stdio: 'inherit',
    }).then(() => path.join(this.cc.path, util.format(`%s-%s.tgz`, name, version)));
  }

  _expressPack(outDir, endpoint) {
    const SDK = this.command.project();
    // copy additional templates
    const vars = { endpoint };
    ['api.js', 'index.js']
      .forEach(file => writeTemplate(path.join(this.templateRoot, file), path.join(outDir, file), vars));
    // update package.json
    this.cc.json.main = 'index.js';
    this._setJson({ main: 'index.js' })
      ._assignDep(SDK.name, 'dependencies', `^${SDK.version}`)
      ._assignDep('express', 'dependencies', SDK.devDependencies.express)
      ._setScript('start', 'node index.js')
      ._setScript('prepack', null)
      ._savePkg(outDir);
    return outDir;
  }

  _mobilePack(outDir, endpoint) {
    const SDK = this.command.project();
    const { name } = this.cc.json;
    const apiTitle = camelize(name.replace(/components?$/i, ''));
    const apiName = name.replace(/^\W|\W+/g, (match, index) => index === 0 ? '' : '_');
    endpoint = `/mobile/custom/${apiName}/` + endpoint.replace(/^\/(mobile\/custom\/?)?/i, '');
    // copy additional templates
    const vars = { apiTitle, apiName, endpoint };
    ['api.js', 'component.service.raml']
      .forEach(file => writeTemplate(path.join(this.templateRoot, file), path.join(outDir, file), vars));
    // update package.json
    this._setJson({ main: 'api.js', name: apiName })
      ._assignDep(SDK.name, 'dependencies', `^${SDK.version}`)
      ._setMobile({ configuration: { node: '8.9' }})
      ._setScript('start', null)
      ._setScript('prepack', null)
      ._savePkg(outDir);
    return outDir;
  }

  _prepareOut(name) {
    name = util.format(OUT_FORMAT, name, this.cc.json.version);
    const outDir = path.join(this.cc.path, name);
    if (fs.existsSync(outDir)) {
      this._err(`Output directory ${name} exits. Please remove and try again`);
    }
    // copy cc package to output dir
    writeTemplates(this.cc.path, outDir);
    return outDir;
  }

  _setJson(props) {
    Object.assign(this.cc.json, props);
    return this;
  }

  _assignDep(name, to, fallback) {
    const spec = ['dependencies', 'devDependencies', 'peerDependencies']
      .map(layer => this.cc.json[layer] || {})
      .reduce((prev, deps) => {
        const dep = prev || deps[name];
        delete deps[name];
        return dep;
      }, null);

    this.cc.json[to] = Object.assign(this.cc.json[to] || {}, {
      [name]: spec || fallback
    });
    return this;
  }
  
  // TASK-19013: bundleDependencies
  _setBundled() {  
    const { dependencies } = this.cc.json;
    const bundleDependencies = Object.keys(dependencies || {});
    this._setJson({ bundleDependencies });
    return this;
  }

  _setMobile(config) {
    const om = this.cc.json.oracleMobile || {};
    return this._setJson({ oracleMobile: Object.assign(om, config) });
  }

  _setScript(name, script) {
    return this._setJson({ scripts: Object.assign(this.cc.json.scripts || {}, {
      [name]: script || '',
    })});
  }

  _savePkg(outDir) {
    fs.writeFileSync(path.join(outDir, 'package.json'), JSON.stringify(this.cc.json, null, 2));
    return this;
  }

  _prepack() {
    return this._setBundled()._savePkg(this.cc.path);
  }

  _pack(options) {
    return new Promise((resolve, reject) => {
      const { service, endpoint } = options;
      switch(service) {
      case 'npm':
      case 'embedded':
        return resolve(this._npmPack());
      case 'express':
        return resolve(this._expressPack(this._prepareOut(service), endpoint));
      case 'mobile-api':
        return resolve(this._mobilePack(this._prepareOut(service), endpoint));
      default:
        return reject(`Invalid packaging option '${service}'`);
      }
    });
  }

  async run(options, pathArg) {
    let dir = pathArg || process.cwd();
    dir = path.resolve(dir);
    await npmCompile(dir);
    const cc = this.cc = loadVerifyComponent(dir);
    this._prepack();
    if (options.dryRun) {
      this.ui.banner(`Component Package '${cc.ref}' is valid!`);
      return;
    }
    this.ui.banner(`Preparing artifact from: ${cc.ref}...`);
    
    return this._pack(options).then(artifact => {
      this.ui.banner(`Component package '${path.basename(artifact)}' created successfully!`);
      if (fs.statSync(artifact).isDirectory()) {
        this.ui.outputSection('Next Steps', `Compress the output directory into a .zip and deploy`)
      }
    });      
  }  
}

module.exports = {
  loadVerifyComponent,
  npmCompile,
  CCPack,
};
