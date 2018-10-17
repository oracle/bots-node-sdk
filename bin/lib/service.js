const fs = require('fs');
const path = require('path');
const { ChildCommand } = require('../helper/command');
const OracleBot = require('../../');

const defaultPort = 3000;

/**
 * Command implementation for running cc_package projects as a service.
 */
class CCServiceCommand extends ChildCommand {

  /**
   * @param {Command} root - the main CLI program
   */
  constructor(root) {
    super(root, 'service', 'Start a service with Custom Component package(s)');
    this.command
      .option('-P --port <number>', 'Service port number', null, p => ~~p)
      .option('-r --route <path>', 'Path for service endpoint', '/components');
  }

  _err(msg) {
    throw new Error(msg);
  }

  /**
   * resolve express from a custom component package
   * @param {object[]} components 
   */
  _getExpress(components) {
    const express = components.reduce((express, cc) => {
      return express || (() => {
        try {
          return require(path.join(cc.path, 'node_modules', 'express'));
        } catch (e) { /*noop*/ }
      })();
    }, null);

    if (!express) {
      this.command.ui.output(`Missing module: 'express'. Try running \`npm install --save-dev express\``);
      this._err(`'express' must be installed to run the component service.`);
    }
    return express;
  }

  /**
   * resolve cc packages from command inputs
   * @param {object} options - command options
   * @param {*} args - command arguments, used when options.project is null
   * @returns {object[]} - array of cc hash where each contains its path and module
   */
  _resolveCCs(options, args) {
    // self
    const sdkName = this.command.project().name;

    const ccs = (options.project || args).map(cc => {
      const ccPath = path.resolve(process.cwd(), cc);
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
        this._err(`Package '${ref}' does not export components`);
      }
      if (Array.isArray(ccPkg.components)) {
        if (ccPkg.components.length < 1) {
          this._err(`Package '${ref}' should export 1 or more components`);
        }
      } else if (typeof ccPkg.components === 'object')  {
        if (Object.keys(ccPkg.components).length === 0) {
          this._err(`Package '${ref}' should export 1 or more components`);
        }
      } else if (typeof ccPkg.components !== 'string') {
        this._err(`Package '${ref}' should export components as an array or object`);
      }

      // check for self
      let sdkVersionSpec = (ccPkgJson.devDependencies ? ccPkgJson.devDependencies[sdkName] : null);
      if (!sdkVersionSpec) {
        sdkVersionSpec = (ccPkgJson.peerDependencies ? ccPkgJson.peerDependencies[sdkName] : null);
      }
      if (!sdkVersionSpec) {
        this.command.ui.output(`Package '${ref}' does not list ${sdkName} as dev or peer dependency. It may not be portable to other runtime environments.`)
      }
      // resolve metadata
      return {
        ref,
        path: ccPath,
        module: ccPkg,
        spec: sdkVersionSpec,
      };
    });

    return ccs.length ? ccs : this._err(`A valid custom component package is required`);
  }

  /**
   * CLI invocation handler
   * @param {*} options - parsed options
   * @param  {...any} args - additional arguments passed
   */
  run(options, ...args) {
    const components = this._resolveCCs(options, args);
    const express = this._getExpress(components);
    const { ComponentRegistry } = OracleBot.Lib;

    // create a combined registry with resolved components from all packages
    const registry = components.reduce((prev, cc) => {
      const reg = ComponentRegistry.create(cc.module.components, cc.module.cwd || cc.path);
      return reg.merge(prev);
    }, null);

    const app = express();
    app.use((req, res, next) => {
      this.command.ui.output(`${req.method}: ${req.url}`);
      next();
    });
    OracleBot.Middleware.customComponent(app, {
      baseUrl: options.route,
      register: registry.components,
    });

    const port = options.port || process.env.PORT || defaultPort;
    app.listen(port, () => {
      this.command.ui.output(`Component Service online http://localhost:${port}${options.route}`);
    });
  }
}

module.exports = {
  CCServiceCommand,
};
