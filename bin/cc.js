#! /usr/bin/env node

const self = require('../package.json');
const { Command } = require('./helper/command');
const { CCServiceCommand } = require('./lib/service');

const command = new Command('cc', 'CLI for developing Custom Components');

command
  .project(self)
  .withHelp()
  .version(self.version)
  .option('-p --project <path>', 'Path(s) to the project directory', null, (p, list) => (list || []).concat(p));

CCServiceCommand.extend(command);

command
  .parse(process.argv)
  .then(() => {
    /* done */
  });
