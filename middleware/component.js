'use strict';

const { MiddlewareAbstract } = require("./abstract");
const { ComponentRegistry } = require("../lib/component/registry");
const { ComponentShell: Shell } = require("../lib/component/shell");
const { STATUS_CODE } = require('./codes');

/**
 * Options for configuring bots custom component middleware.
 * @typedef {Object} ComponentMiddlewareOptions
 * @memberof module:Middleware
 * @property {string} [baseUrl='/'] - Base url for custom component endpoints
 * @property {string} [cwd=process.cwd()] - Working directory from which any component paths are relative.
 * @property {(string[]|Object[]|Function[])} register - Series of paths to components or directories, Objects with name=>component pairs, Objects representing a component, or Component class ctor Functions.
 * @property {*} [mixins] - Any mixin properties for CustomComponentContext
 */

/**
 * define req.param keys
 */
const [PARAM_COMPONENT] = ['component'];

/**
 * ComponentMiddleware.
 * @extends MiddlewareAbstract
 * @memberof module:Middleware
 * @private
 */
class ComponentMiddleware extends MiddlewareAbstract {

  _init(service, options) {
    if (!service || typeof service.get !== 'function' || typeof service.post !== 'function') {
      throw new Error('Cannot initialize component middleware: service argument is required');
    }
    const opts = Object.assign({
      // option defaults
      baseUrl: '/',
      register: [],
      mixins: {}
    }, options);

    /**
     * assemble root registry from provided `register` property
     * merge explicitly provided component registry with the hierarchical fs registry.
     */
    const rootRegistry = ComponentRegistry.create(opts.register, opts.cwd);
    
    const { baseUrl } = opts;
    /**
     * establish component metadata index
     */
    service.get(this.__endpoint(baseUrl, '/'), (req, res) => {
      const meta = this.__getShell(rootRegistry)
        .getAllComponentMetadata();
      res.json(meta);
    });

    /**
     * handle custom component invocation
     */
    service.post(this.__endpoint(baseUrl, `/:${PARAM_COMPONENT}`), (req, res) => {
      const componentName = req.params[PARAM_COMPONENT];
      // invoke
      this.__invoke(componentName, rootRegistry, opts, req, res);
    });

    /**
     * handle ResolveEntities event handler invocation
     */
    service.post(this.__endpoint(baseUrl, `/resolveentities/:${PARAM_COMPONENT}`), (req, res) => {
      const componentName = req.params[PARAM_COMPONENT];
      const mixins = Object.assign({}, opts.mixins);
      this.__getShell(rootRegistry).invokeResolveEntitiesEventHandler(componentName, req.body, this.__invocationCb(res), mixins);      
    });

    /**
     * handle DataQuery event handler invocation
     */
    service.post(this.__endpoint(baseUrl, `/dataquery/:${PARAM_COMPONENT}`), (req, res) => {
      const componentName = req.params[PARAM_COMPONENT];
      const mixins = Object.assign({}, opts.mixins);
      this.__getShell(rootRegistry).invokeDataQueryEventHandler(componentName, req.body, this.__invocationCb(res), mixins);      
    });

    /**
     * handle LLM transformation handler invocation
     */
    service.post(this.__endpoint(baseUrl, `/llmtransformation/:${PARAM_COMPONENT}`), (req, res) => {
      const componentName = req.params[PARAM_COMPONENT];
      const mixins = Object.assign({}, opts.mixins);
      this.__getShell(rootRegistry).invokeLlmTransformationHandler(componentName, req.body, this.__invocationCb(res), mixins);      
    });

    /**
     * handle LLM component handler invocation
     */
    service.post(this.__endpoint(baseUrl, `/llmcomponent/:${PARAM_COMPONENT}`), (req, res) => {
      const componentName = req.params[PARAM_COMPONENT];
      const mixins = Object.assign({}, opts.mixins);
      this.__getShell(rootRegistry).invokeLlmComponentHandler(componentName, req.body, this.__invocationCb(res), mixins);      
    });

  }

  /**
   * construct an endpoint from base and url
   * @param {string} base - base url
   * @param {string} url - endpoint url
   */
  __endpoint(base, url) {
    return '/' + [base, url].map(part => part.replace(/^\/|\/$/g, ''))
      .filter(part => !!part)
      .join('/');
  }

  /**
   * get Shell methods
   * @param registry - The registry for the invocation shell
   * @private
   */
  __getShell(registry) {
    return Shell({
      logger: this._logger
    }, registry);
  }

  /**
   * invoke the component shell.
   * @param componentName: string - component name
   * @param registry - registry to which the component belongs
   * @param options - Middleware options reference.
   * @param req - MobileCloudRequest
   * @param res - express.Response
   * @private
   */
  __invoke(componentName, registry, options, req, res) {
    // apply mixins and invoke component
    const mixins = Object.assign({}, options.mixins);
    if (req.oracleMobile) {
      mixins.oracleMobile = req.oracleMobile;
    }
    this.__getShell(registry)
      .invokeComponentByName(componentName, req.body, mixins, this.__invocationCb(res));
  }
  /**
   * convenience handler for CC invocation
   * @param res: express.Response
   * @private
   */
  __invocationCb(res) {
    return (err, data) => {
      if (!err) {
        res.status(STATUS_CODE.OK).json(data);
      } else {
        switch (err.name) {
        case 'unknownComponent':
          res.status(STATUS_CODE.NOT_FOUND).send(err.message);
          break;
        case 'badRequest':
          res.status(STATUS_CODE.BAD_REQUEST).send(err.message);
          break;
        default:
          res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).send(err.message);
          break;
        }
      }
    };
  }
}

module.exports = {
  ComponentMiddleware,
};
