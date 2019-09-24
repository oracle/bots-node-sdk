'use strict';

const { ComponentAbstract } = require('./abstract');
const { ComponentRegistry } = require('./registry');
const { CustomComponentContext } = require('./sdk');
const { ComponentShell } = require('./shell');

/**
 * SDK 'Lib' exposing core classes, etc.
 * @module Lib
 * @example
 *  const OracleBot = require('@oracle/bots-node-sdk');
 *
 *  export class MyCustomComponent extends OracleBot.Lib.ComponentAbstract {
 *    metadata() {
 *      return {
 *        name: 'my.custom.component',
 *        properties: {},
 *        supportedActions: []
 *      };
 *    }
 *    invoke(conversation, done) {
 *      // ...
 *    }
 *  }
 */
module.exports = {
  ComponentAbstract,
  ComponentRegistry,
  CustomComponentContext,
  Conversation: CustomComponentContext, // alias
  ComponentShell,
};
