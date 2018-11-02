#! /usr/bin/env node

const self = require('../package.json');
const { Command } = require('./lib/command');
const { CCInit } = require('./commands/init');
const { CCPack } = require('./commands/pack');
const { CCServiceCommand } = require('./commands/service');

const command = new Command('bots-node-sdk', `Developer tools for ${self.name}`);

command
  .project(self)
  .withHelp()
  .version(self.version)
  // add subcommand delegates
  .delegate(CCInit, 'init').root()
  .delegate(CCServiceCommand, 'service').root()
  .delegate(CCPack, 'pack').root()
  // parse process args
  .parse(process.argv)
  .then(() => {
    /* done */
  });

/**
 * Command line developer tools for @oracle/bots-node-sdk
 * @module CLI
 * @see https://github.com/oracle/bots-node-sdk/tree/master/bin/README.md
 * @example
 * 
 * Usage: bots-node-sdk [options] <subcommand> [options]
 *
 * Options:
 *
 *   -h --help       Display help and usage information
 *   -v --version    Print version information
 *
 * Subcommands:
 *
 *   init       Initialize a new Custom Component package
 *   service    Start a service with Custom Component package(s)
 *   pack       Create a deployable Custom Component artifact
 * 
 */