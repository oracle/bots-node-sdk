'use strict';

// const os = require('os');
const fs = require('fs');
const path = require('path');
const { CommandDelegate } = require('../lib/command');
const { ChildPromise } = require('../lib/spawn');

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
    module: ccPkg,
    sdkSpec: sdkVersionSpec,
  };
};

/**
 * Command implementation for scaffolding cc package projects
 */
class CCPack extends CommandDelegate {

  constructor(cmd) {
    super(cmd, 'Create a deployable Custom Component artifact');
    this.command
      .argument('path', 'Specify path to Component Package')
      .option('-d --dry-run', 'Perform package validation only')
      // .option('-w --wrapper <type>', 'Specify a wrapper type <express|mobile-api>', null, w => w.toLowerCase());
  }

  run(options, pathArg) {
    let dir = pathArg || process.cwd();
    dir = path.resolve(dir);
    const cc = loadVerifyComponent(dir);
    if (options.dryRun) {
      this.ui.banner(`Component Package '${cc.ref}' is valid!`);
      return;
    }
    this.ui.banner(`Preparing artifact from: ${cc.ref}...`);
    // TODO: handle different options.wrapper
    return ChildPromise.spawn('npm', ['pack'], {
      cwd: dir,
      stdio: 'inherit',
    }).then(() => {
      this.ui.banner(`Component package '${cc.ref}' archived successfully!`);
    });
  }
}

module.exports = {
  loadVerifyComponent,
  CCPack,
};
