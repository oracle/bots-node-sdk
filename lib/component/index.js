"use strict";

const { ComponentAbstract } = require('./abstract');
const { ComponentRegistry } = require('./registry');
const { ComponentInvocation } = require('./sdk');
const ComponentShell = require('./shell');

module.exports = {
  ComponentAbstract,
  ComponentRegistry,
  ComponentInvocation,
  Conversation: ComponentInvocation, // alias
  ComponentShell,
};
