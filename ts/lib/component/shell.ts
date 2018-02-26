/* tslint:disable */

// External deps
import { ComponentInvocation as SDK } from './sdk';

export = function ComponentShell(config, registry) {

  let logger = (config ? config.logger : null);
  if (!logger) {
    logger = console;
    logger.info("shell.js create console logger");
  }

  return {

    /**
     * Returns an array of metadata for all components.
     */
    getAllComponentMetadata: function () {
      const allComponents = [];
      if (registry.components) {
        for (var componentName in registry.components) {
          allComponents.push(registry.components[componentName].metadata());
        }
      }
      var allMetadata = { version: SDK.sdkVersion(), components: allComponents };
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
     */
    invokeComponentByName: function (componentName, requestBody, sdkMixin, callback) {

      sdkMixin = sdkMixin ? sdkMixin : {};

      // Resolve component
      const component = (registry.components ? registry.components[componentName] : null);
      var sdk;

      if (!component) {
        logger.error('Unknown component ' + componentName);
        let err = new Error('Unknown component ' + componentName);
        err.name = 'unknownComponent';
        callback(err);
        return;
      }

      // Build an SDK object for this invocation, applying mixin
      try {
        sdk = Object.assign(new SDK(requestBody), sdkMixin);
      } catch (err) {
        logger.info('Error in request, details=' + JSON.stringify(err.details, null, 2));
        callback(err);
        return;
      }

      // Invoke component
      logger.info('Invoking component=' + componentName);
      logger.debug('with reqBody=' + JSON.stringify(requestBody, null, 2));
      try {
        // for now we check if the error is the sdk (old way of using done(sdk)) to be backward compat
        component.invoke(sdk, (componentErr) => {
          if (!componentErr || componentErr === sdk) {
            logger.debug('Component response=' + JSON.stringify(sdk.response(), null, 2));
            callback(null, sdk.response());
          } else {
            callback(componentErr, null);
          }
        });
      } catch (err) {
        logger.error('Error in component, details=' + JSON.stringify(err, null, 2));
        if (err.stack) {
          logger.error(err, err.stack.split("\n"));
        } else {
          logger.error(err);
        }
        callback(err);
      }
    }
  };
};
