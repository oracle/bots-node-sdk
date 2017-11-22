import { Callback } from '../common/definitions';
import { express, MiddlewareAbstract, MobileCloudRequest } from './abstract';
import { ComponentRegistry } from '../modules/component';

import Shell = require('../modules/conversation/shell');

/**
 * concentrated component middleware options
 */
export interface ComponentMiddlewareOptions {
  baseDir?: string; // base component directory
  mixins?: any; // conversation mixin methods / properties
}

/**
 * define req.param keys
 */
const [PARAM_COLLECTION, PARAM_COMPONENT] = ['collection', 'component'];
const MESSAGES = {
  NOT_FOUND: 'not found',
}

/**
 * ComponentMiddleware.
 * @extends MiddlewareAbstract
 */
export class ComponentMiddleware extends MiddlewareAbstract {

  protected _init(router: express.Router, options: ComponentMiddlewareOptions): void {
    const opts: ComponentMiddlewareOptions = {
      baseDir: ComponentRegistry.COMPONENT_DIR,
      mixins: { },
      ...options
    };

    const rootRegistry = ComponentRegistry.assemble(null, opts.baseDir, this._root);

    /**
     * establish component metadata index
     */
    router.get('/', (req, res) => {
      const meta = Shell(null, rootRegistry)
        .getAllComponentMetadata();
      res.json(meta);
    });

    /**
     * handle root component invokation
     */
    router.post(`/:${PARAM_COMPONENT}`, (req, res) => {
      const componentName = req.params[PARAM_COMPONENT];
      // invoke
      this.__invoke(componentName, rootRegistry, opts, req, res);
    });

    /**
     * get metadata for a child component collection
     */
    router.get(`/collection/:${PARAM_COLLECTION}`, (req, res) => {
      const collectionName = req.params[PARAM_COLLECTION];
      if (rootRegistry.isCollection(collectionName)) {
        const meta = Shell(null, rootRegistry.getRegistry(collectionName))
          .getAllComponentMetadata();
        res.json(meta);
      } else {
        this._logger.error(`${collectionName} not found in registry`);
        res.status(404).send(MESSAGES.NOT_FOUND);
      }
    });

    /**
     * handle component invokation by collection
     */
    router.post(`/collection/:${PARAM_COLLECTION}/:${PARAM_COMPONENT}`, (req, res) => {
      const collectionName = req.params[PARAM_COLLECTION];
      const componentName = req.params[PARAM_COMPONENT];
      const registry = rootRegistry.getRegistry(collectionName);
      // invoke
      this.__invoke(componentName, registry || rootRegistry, opts, req, res);
    });
  }

  /**
   * invoke the component shell.
   * @param componentName: string - component name
   * @param registry - registry to which the component belongs
   * @param options - Middleware options reference.
   * @param req - MobileCloudRequest
   * @param res - express.Response
   */
  private __invoke(
    componentName: string,
    registry: ComponentRegistry,
    options: ComponentMiddlewareOptions,
    req: MobileCloudRequest,
    res: express.Response
  ): void {
    // apply mixins and invoke component
    const mixins = { ...options.mixins };
    if (!!req.oracleMobile) {
      mixins.oracleMobile = req.oracleMobile;
    }
    Shell(null, registry)
      .invokeComponentByName(componentName, req.body, mixins, this.__invokationCb(res));
  }

  /**
   * convenience handler for CC invokcation
   * @param res: express.Resonse
   */
  private __invokationCb(res: express.Response): Callback {
    return (err, data) => {
      // direct port from components.js
      if (!err) {
        res.status(200).json(data);
      } else {
        switch (err.name) {
          case 'unknownComponent':
            res.status(404).send(err.message);
            break;
          case 'badRequest':
            res.status(400).json(err.message);
            break;
          default:
            res.status(500).json(err.message);
            break;
        }
      }
    }
  }

}
