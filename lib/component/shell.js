'use strict';

const { CommonProvider } = require('../../common/provider');
const { CustomComponentContext } = require("./sdk");
const { EntityResolutionContext } = require("../entity/entityResolutionContext");
const entityUtil = require('../entity/utils');

/**
 * Component invocation shell. Applies handling and invocation methods to a registry.
 * @memberof module:Lib
 * @param {*} config 
 * @param {ComponentRegistry} registry
 * @private
 */
function ComponentShell(config, registry) {
  let logger = (config ? config.logger : null);
  if (!logger) {
    logger = CommonProvider.getLogger();
  }

  // Registry validation
  if (!(registry && registry.components)) {
    throw new Error('Invalid component registry');
  }

  /**
   * resolve the component object and its context
   * @param {string} componentName - name of component to invoke
   * @param {object} requestBody - Invocation request payload
   * @param {Function} ContextCtor - Either CustomComponentContext or EntityResolutionContext constructors
   * @param {object} [mixins] - any object mixins to assign to the component object
   */
  function resolveInvocation(componentName, requestBody, ContextCtor, mixins) {
    // Resolve component
    const component = registry.getComponent(componentName);
    if (!component) {
      logger.error('Unknown component: ' + componentName);
      let err = new Error('Unknown component ' + componentName);
      err.name = 'unknownComponent';
      throw err;
    }

    // Build a context object for this invocation, applying mixins if provided
    let context;
    try {
      context = Object.assign(new ContextCtor(requestBody), mixins || {});
    } catch (err) {
      logger.error('Invocation construct error: ' + err.message);
      throw err;
    }

    return {
      component,
      context,
    };
  }

  return {
    /**
     * Returns an array of metadata for all components.
     * @private
     */
    getAllComponentMetadata: function () {
      const allComponents = [];
      if (registry.components) {
        for (var componentName in registry.components) {
          const component = registry.getComponent(componentName);
          let metadata = component.metadata();
          // if component is event handler, then auto-register event handlers in metadata
          if (metadata.eventHandlerType==='ResolveEntities') {
            metadata.events = entityUtil.getResolveEntitiesEventHandlers(component);
          }
          allComponents.push(metadata);
        }
      }
      var allMetadata = {
        version: CustomComponentContext.sdkVersion(),
        components: allComponents
      };
      logger.debug("Component service metadata:\n"+JSON.stringify(allMetadata));
      return allMetadata;
    },

    /**
     * Invokes the named component.
     *
     * componentName is the name of the component (as a string) [required].
     * requestBody is the body of the invocation request (as an object) [required].
     * sdkMixin is an object that will be mixed in with the SDK instance that is made
     *  available to the invoked component [optional].  This mixin allows environment
     *  specific functionality to be made available to component implementations,
     *  and the ability override or extend existing SDK functionality.
     *
     *  For example, if a component service is built in MCS custom code, the MCS
     *  custom code SDK can be passed as a property in sdkMixin, and then component
     *  implementations can check for its existence and use it as desired.
     *
     * callback is a standard error-first callback [required].
     *   On success, the data passed to the callback is the invocation response.
     *   On error, the following error names may be used:
     *     'unknownComponent'
     *     'badRequest'
     *   Component implementations may cause arbitrary errors to be propagated
     *   through.
     * @private
     */
    invokeComponentByName: function (componentName, requestBody, sdkMixin, callback) {
      // assert invocation callback
      if (typeof callback !== 'function') {
        throw new Error('Invocation callback is required');
      }

      try {
        const { component, context } = resolveInvocation(componentName, requestBody, CustomComponentContext, sdkMixin);
        // invoke custom component
        // for now we check if the error is the sdk (old way of using done(sdk)) to be backward compatible
        logger.debug('Invoking component ' + componentName);
        component.invoke(context, (componentErr) => {
          if (!componentErr || componentErr === context) {
            callback(null, context.response());
          } else {
            callback(componentErr, null);
          }
        });  
      } catch (err) {
        logger.error('Invocation error: ' + err.message);
        callback(err);
      }
    },

    /**
     * Invokes the event handler.
     *
     * componentName is the name of the component (as a string) [required].
     * requestBody is the body of the invocation request (as an object) [required].     *
     * callback is a standard error-first callback [required].
     *   On success, the data passed to the callback is the invocation response.
     *   On error, the following error names may be used:
     *     'unknownComponent'
     *     'badRequest'
     *   Component implementations may cause arbitrary errors to be propagated
     *   through.
     * @private
     */
    invokeResolveEntitiesEventHandler: function (componentName, requestBody, callback) {
      // assert invocation callback                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
      if (typeof callback !== 'function') {
        throw new Error('Invocation callback is required');
      }

      // Invoke component, check whether we need to invoke entity resolve event handlers,
      // or it is regular CC invocation
      try {
        const { component, context } = resolveInvocation(componentName, requestBody, EntityResolutionContext);

        entityUtil.invokeResolveEntitiesEventHandlers(component, context, logger).then(() => {        
          callback(null, context.getResponse());
        }).catch(err => {
          if (!(err instanceof Error)) {         
            err = new Error(err);         
          }
          logger.debug("Error invoking event handlers: "+err.message);
          callback(err)
        });
      } catch (err) {
        logger.error('Invocation error: ' + err.message);
        callback(err);
      }
    }

  };
}

module.exports = {
  ComponentShell,
};