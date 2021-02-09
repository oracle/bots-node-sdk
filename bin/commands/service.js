'use strict';

const path = require('path');
const OracleBot = require('../../');
const { CommandDelegate } = require('../lib/command');
const { loadVerifyComponent, npmCompile } = require('./pack');

const defaultPort = 3000;

/**
 * Command implementation for running cc package projects as a service.
 */
class CCServiceCommand extends CommandDelegate {
  constructor(cmd) {
    super(cmd, 'Start a service with Custom Component package(s)');
    this.command
      .argument('path', 'Specify path(s) to Component Package')
      .option('-P --port <number>', 'Service port number', defaultPort, p => ~~p)
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
   * @param {*} projects - command arguments, used when options.project is null
   * @returns {object[]} - array of cc hash where each contains its path and module
   */
  _resolveCCs(projects) {
    // self
    const sdkName = this.command.project().name;
    const ccs = (projects || []).map(cc => {
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
   * @param  {...string} projects - all project arguments
   */
  async run(options, ...projects) {
    let dir = path.resolve(process.cwd());
    await npmCompile(dir);
    if (projects && !projects.length) {
      projects.push('.');
    }
    const components = this._resolveCCs(projects);
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
    app.use((req, res, next) => {
      res.set('Access-Control-Allow-Origin', '*');
      res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      next();
    });
    OracleBot.init(app, {
      logger: components.reduce((prev, cc) => cc.module.logger || prev, console), // take last
      parser: components.reduce((prev, cc) => prev || cc.module.parser, null), // take first
    });
    OracleBot.Middleware.customComponent(app, {
      baseUrl: options.route,
      register: registry.components,
    });

    // start the service
    app.listen(port, () => {
      this.ui
        .banner(`Component Service Ready (no auth):
        http://localhost:${port}${options.route}`)
        .outputGrid(components.map(cc => [cc.ref, '=>', cc.cnames.join('\n')]), 2, 0)
        .output();
    });
  }

}

module.exports = {
  CCServiceCommand,
};
