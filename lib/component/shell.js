'use strict';

const { ComponentInvocation } = require("./sdk");
const { CommonProvider } = require('../../common/provider');

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

  return {
    /**
     * Returns an array of metadata for all components.
     * @private
     */
    getAllComponentMetadata: function () {
      const allComponents = [];
      if (registry.components) {
        for (var componentName in registry.components) {
          allComponents.push(registry.components[componentName].metadata());
        }
      }
      var allMetadata = {
        version: ComponentInvocation.sdkVersion(),
        components: allComponents
      };
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

      // Resolve component
      const component = (registry.components ? registry.components[componentName] : null);
      if (!component) {
        logger.error('Unknown component: ' + componentName);
        let err = new Error('Unknown component ' + componentName);
        err.name = 'unknownComponent';
        callback(err);
        return;
      }

      // Build an SDK object for this invocation, applying mixin
      let sdk;
      try {
        sdk = Object.assign(new ComponentInvocation(requestBody), sdkMixin || {});
      } catch (err) {
        logger.error('Invocation construct error: ' + err.message);
        callback(err);
        return;
      }

      // Invoke component
      logger.debug('Invoking component ' + componentName);
      try {
        // for now we check if the error is the sdk (old way of using done(sdk)) to be backward compat
        component.invoke(sdk, (componentErr) => {
          if (!componentErr || componentErr === sdk) {
            callback(null, sdk.response());
          } else {
            callback(componentErr, null);
          }
        });
      } catch (err) {
        logger.error('Invocation error: ' + err.message);
        callback(err);
      }
    }
  };
}

module.exports = ComponentShell;