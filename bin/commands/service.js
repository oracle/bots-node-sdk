'use strict';

const path = require('path');
const OracleBot = require('../../');
const { CommandDelegate } = require('../lib/command');
const { loadVerifyComponent } = require('./pack');

const defaultPort = 3000;

/**
 * Command implementation for running cc_package projects as a service.
 */
class CCServiceCommand extends CommandDelegate {
  constructor(cmd) {
    super(cmd, 'Start a service with Custom Component package(s)');
    this.command
      .option('-p --project <path>', 'Path(s) to the package directory', null, (p, list) => (list || []).concat(p))
      .option('-P --port <number>', 'Service port number', null, p => ~~p)
      .option('-r --route <path>', 'Path for service endpoint', '/components');
  }

  /**
   * resolve express from a custom component package
   * @param {object[]} components 
   */
  _getExpress(components) {
    let express;
    try {
      express = require('express');
    } catch (e) {
      express = components.reduce((express, cc) => {
        return express || (() => {
          try {
            return require(path.join(cc.path, 'node_modules', 'express'));
          } catch (e) { /*noop*/ }
        })();
      }, null);
    }

    if (!express) {
      this.ui.output(`Missing module: 'express'. Try running \`npm install --save-dev express\``);
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
      const loaded = loadVerifyComponent(ccPath);
      
      if (!loaded.sdkSpec) {
        this.ui.output(`Package '${loaded.ref}' does not list ${sdkName} as dev or peer dependency. It may not be portable to other runtime environments.`)
      }
      // resolve metadata
      return loaded;
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
    const port = options.port || process.env.PORT || defaultPort;

    // create a combined registry with resolved components from all packages
    const { ComponentRegistry } = OracleBot.Lib;
    const registry = components.reduce((prev, cc) => {
      const reg = ComponentRegistry.create(cc.module.components, cc.module.cwd || cc.path);
      cc.cnames = Object.keys(reg.components); // for printout later
      return reg.merge(prev);
    }, null);

    // setup express & middleware
    const app = express();
    OracleBot.init(app, { logger: console });
    OracleBot.Middleware.customComponent(app, {
      baseUrl: options.route,
      register: registry.components, // :)
    });

    // start the service
    app.listen(port, () => {
      this.ui
        .paragraph(`Component Service loaded on http://localhost:${port}${options.route}`)
        .outputGrid(components.map(cc => [cc.ref, '=>', cc.cnames.join('\n')]), 2, 1);
    });
  }
}

module.exports = {
  CCServiceCommand,
};
