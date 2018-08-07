/**
 * Add detailed spec reporter
 */
const path = require('path');
const { SpecReporter } = require('jasmine-spec-reporter');
const { JUnitXmlReporter } = require('jasmine-reporters');

jasmine.getEnv().clearReporters();
jasmine.getEnv().addReporter(new SpecReporter());
jasmine.getEnv().addReporter(new JUnitXmlReporter({
  savePath: path.join(__dirname, '../../../reports/tests'),
  consolidateAll: true,
}));
