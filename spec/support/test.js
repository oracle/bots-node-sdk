#! /usr/bin/env node

/* global jasmine */
const path = require('path');
const Jasmine = require('jasmine');
const SpecReporter = require('jasmine-spec-reporter').SpecReporter;
const XMLReporter = require('jasmine-reporters').JUnitXmlReporter;
const runner = new Jasmine();

jasmine.getEnv().addReporter(new SpecReporter());
jasmine.getEnv().addReporter(new XMLReporter({
  savePath: path.join(process.cwd(), 'reports/tests'),
  consolidateAll: true,
}));
runner.loadConfigFile(path.resolve(__dirname, 'jasmine.json'));
runner.configureDefaultReporter({
  print: () => {}
});
runner.execute();