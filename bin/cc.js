#! /usr/bin/env node

const self = require('../package.json');
const { Command } = require('./lib/command');
const { CCInit } = require('./commands/init');
const { CCPack } = require('./commands/pack');
const { CCServiceCommand } = require('./commands/service');

const command = new Command('cc', 'CLI for developing Custom Components');

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
