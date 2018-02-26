"use strict";

const express = require("express");
const { ParserMiddleware } = require("./parser");
const { ComponentMiddleware } = require("./component");

/**
 * init middleware function. Add bot middleware to the app router stack.
 * @param {Object} [options={}] - Middleware configuration options.
 * @param {Object} [options.component] - Custom component middleware options.
 * @param {string} [options.component.cwd=process.cwd()] - Working directory from which any component paths are relative.
 * @param {(string|Object|Function)[]} [options.component.register] - Series of paths to components or directories, Objects with name=>component pairs, Objects representing a component, or Component class ctor Functions.
 * @param {*} [options.component.mixins] - Any mixin properties for ComponentInvocation
 * @param {Object} [options.parser] - Body parser middleware options.
 * @param {boolean} [options.parser.json=true] - Parse JSON body payload
 * @param {boolean} [options.parser.urlencoded=true] - Parse urlencoded body payload
 * @param {string} [options.parser.limit='5mb'] - Parser body size limit
 * @return express.Router
 */
function init(options = {}) {
  const router = express.Router();
  // create iterable map
  const mwMap = new Map([
    ['parser', ParserMiddleware],
    ['component', ComponentMiddleware],
  ]);
  // iterate and apply the middleware layers
  // middleware without options is ignored, unless the middleware class is flagged as "required" (as is body-parser)
  mwMap.forEach((mw, key) => {
    if (mw.required || !!options[key]) {
      mw.extend(router, options[key]);
    }
  });
  return router;
}

/**
 * parser function exposes a router with configurable body-parser middleware applied.
 * @param {Object} [options] - Body parser middleware options.
 * @param {boolean} [options.json=true] - Parse JSON body payload
 * @param {boolean} [options.urlencoded=true] - Parse urlencoded body payload
 * @param {string} [options.limit='5mb'] - Parser body size limit
 */
function getRouter(options = {}) {
  return init({
    parser: options
  });
}

module.exports = {
  init,
  getRouter,
}