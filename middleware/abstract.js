"use strict";

const { CommonProvider } = require("../common/provider");

/**
 * Embedded middleware abstraction layer.
 * @private
 */
class MiddlewareAbstract {
  constructor(layer, options) {
    this.options = options;
    // setup additional iVars.
    this._logger = CommonProvider.getLogger();
    this._layer = layer;
    this._handlers = new Map();
    // init middleware
    try {
      this._init(layer, options);
    } catch (e) {
      this._logger.error(`Failed to init ${this.constructor.name}`, e);
    }
  }

  /**
   * extend static method. Instantiate the middleware class on the provided router.
   * @param {external:ExpressRouter|external:ExpressApplication} layer: express.Router - main namespace router.
   * @param {*} options: any - Channel specific middleware options.
   * @return instantiated class.
   */
  static extend(layer, options = {}) {
    return new this(layer, options);
  }

  /**
   * get list of handlers for a given method
   * @param method method to handler
   */
  handlers(method) {
    return [].concat(...['use', method]
      .filter(m => !!m)
      .map(m => this._handlers.get(m) || []));
  }

  /**
   * add/register a request handler
   * @param method method to which handler applies
   * @param url url pattern to match
   * @param handler middleware request handler
   */
  _addHandler(method, url, handler) {
    // keep list of handler stack
    let stack = this._handlers.get(method) || [];
    stack.push({
      url,
      handler,
      regexp: url && new RegExp('^' + url.replace(/:([\w-]+)/g, '([^/]+)').replace(/\/$/, '') + '/?$', 'i'),
      params: ((url && url.match(/:([\w-]+)/g)) || []).map(p => p.replace(/^\W/, ''))
    });
    this._handlers.set(method, stack);

    // apply directly to application layer
    if (this._layer) {
      if (url) {
        this._layer[method](url, handler);
      } else {
        this._layer[method](handler);
      }
    }

  }
}

/**
 * return a single request handler for the middleware stack
 * @param layers list of initialized middleware instances
 * @return {external:ExpressRequestHandler} request handler
 * @private
 */
function getStackHandler(...layers) {
  return (req, res, next) => {
    const stack = [].concat(...layers.map(layer => layer.handlers(req.method.toLowerCase())));
    runHandlerStack(stack, req, res, next);
  }
}

/**
 * handler stack executor
 * @param {*} stack 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @private
 */
function runHandlerStack(stack, req, res, next) {
  const layer = stack.shift();
  if (layer) {
    const { handler, url, regexp, params } = layer;
    // add named params to the req
    if (url && regexp) {
      // basic router url pattern matching
      const match = req.url.match(regexp);
      if (match) {
        // add named req params
        params.forEach((param, i) => req.params[param] = match[i + 1]);
      } else {
        // url doesn't match, proceed
        return runHandlerStack(stack, req, res, next); // doesn't match
      }
    }

    handler(req, res, () => runHandlerStack(stack, req, res, next));
  } else {
    next();
  }
}

module.exports = {
  MiddlewareAbstract,
  getStackHandler,
};
