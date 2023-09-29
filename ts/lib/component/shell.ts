// NOTE: this file is NOT up-todate with latest version of shell.js, but doesn't matter because
// components are always invoked through shell.js (shell.js is NOT generated from this ts version)

import { CommonProvider } from '../../common/provider';
import { CustomComponentContext } from './sdk';
import { EntityResolutionContext } from '../entity';
import * as entityUtil from '../entity/utils';
import { Component, CustomComponent, EntityEventHandler } from './kinds';

type ContextType = CustomComponentContext | EntityResolutionContext;
type ComponentType = Component | CustomComponent;
type Ctor<T> = new (...args: any[]) => T;

export function ComponentShell(config, registry) {
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
  function resolveInvocation<T extends ContextType, C extends ComponentType> (
    componentName: string,
    requestBody: any,
    ContextCtor: Ctor<T>,
    mixins?: any): { context: T, component: C} {
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
        // tslint:disable-next-line:forin
        for (let componentName in registry.components) {
          const component = registry.getComponent(componentName);
          let metadata = (typeof component.metadata === 'function') ? component.metadata() : component.metadata;
          // if component is event handler, then auto-register event handlers in metadata
          if (metadata.eventHandlerType === 'ResolveEntities') {
            metadata.events = entityUtil.getResolveEntitiesEventHandlers(component);
          }
          allComponents.push(metadata);
        }
      }
      let allMetadata = {
        version: CustomComponentContext.sdkVersion(),
        components: allComponents
      };
      logger.debug('Component service metadata:\n' + JSON.stringify(allMetadata));
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
        const { component, context } =
          resolveInvocation<CustomComponentContext, CustomComponent>(componentName, requestBody, CustomComponentContext, sdkMixin);
        // invoke custom component
        logger.debug('Invoking component ' + componentName);
        // if the invoke method has 2 arguments, the second is the callback, and we invoke the old way for
        // backwards compatibility
        // if there is 1 argument we use the new async invoke expecting a promise
        const argsCount =  this.getNumberOfArgs(component.invoke);
        if (argsCount === 1) {
          // invoke can be async (returning a promise), but we dont want to enforce that
          // hence Promise.resolve wrapping of invocation
          Promise.resolve(component.invoke(context)).then(() => {
            callback(null, context.getResponse());
          }).catch(err => {
            if (!(err instanceof Error)) {
              err = new Error(err);
            }
            logger.debug('Invocation error: ' + err.message);
            callback(err);
          });
        } else if (argsCount === 2) {
          component.invoke(context, (componentErr: any) => {
            if (!componentErr || componentErr === context) {
              callback(null, context.response());
            } else {
              callback(componentErr, null);
            }
          });
        } else {
          throw new Error(`Custom component ${componentName} has invoke method with invalid number of arguments.`);
        }
      } catch (err) {
        logger.error('Invocation error: ' + err.message);
        callback(err);
      }
    },

    getNumberOfArgs: function(func) {
      const funcStr = func.toString()
      const argnames =  funcStr.slice(funcStr.indexOf('(') + 1, funcStr.indexOf(')')).match(/([^\s,]+)/g) || [];
      return argnames.length;
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
    invokeResolveEntitiesEventHandler: function (componentName, requestBody, callback, sdkMixin) {
      // assert invocation callback
      if (typeof callback !== 'function') {
        throw new Error('Invocation callback is required');
      }

      // Invoke component, check whether we need to invoke entity resolve event handlers,
      // or it is regular CC invocation
      try {
        const { component, context } =
          resolveInvocation<EntityResolutionContext, EntityEventHandler>(componentName, requestBody, EntityResolutionContext, sdkMixin);

        entityUtil.invokeResolveEntitiesEventHandlers(component, context).then(() => {
          callback(null, context.getResponse());
        }).catch(err => {
          if (!(err instanceof Error)) {
            err = new Error(err);
          }
          logger.debug('Error invoking event handlers: ' + err.message);
          callback(err)
        });
      } catch (err) {
        logger.error('Invocation error: ' + err.message);
        callback(err);
      }
    }

  };
}
