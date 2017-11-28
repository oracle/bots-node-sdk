#! /usr/bin/env node

const path = require('path');
const Jasmine = require('jasmine');
const SpecReporter = require('jasmine-spec-reporter').SpecReporter;
const runner = new Jasmine();

jasmine.getEnv().addReporter(new SpecReporter());
runner.loadConfigFile(path.resolve(__dirname, 'jasmine.json'));
runner.configureDefaultReporter({
  print: () => {}
});
runner.execute();