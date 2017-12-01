#! /usr/bin/env node
'use strict';

const fs = require('fs');

const loadCoverage = require('remap-istanbul/lib/loadCoverage');
const remap = require('remap-istanbul/lib/remap');
const writeReport = require('remap-istanbul/lib/writeReport');

let collector = remap(loadCoverage('coverage/coverage.json'));
writeReport(collector, 'text');
writeReport(collector, 'html', null, 'coverage');
writeReport(collector, 'text', null, 'COVERAGE.md').then(() => {
  const md = fs.readFileSync('COVERAGE.md')
    .toString()
    .replace(/\[[\d\;]+m/g, '') // remove colors
    .replace(/^[\|-]+/, '')
    .trim();
  fs.writeFileSync('COVERAGE.md', 
`# Test Coverage Report

${md}
`);
});
