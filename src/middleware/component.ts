import * as path from 'path';
import { ICallback } from '../common/definitions';
import { express, MiddlewareAbstract, IMobileCloudRequest } from './abstract';
import { ComponentRegistry, ComponentListItem } from '../modules/component/registry';

import Shell = require('../modules/conversation/shell');

/**
 * component middleware specific options
 */
export interface IComponentMiddlewareOptions {
  baseDir?: string; // base component directory for fs registry scan
  components?: ComponentListItem[] // list of components to register, these will be considered 'global'
  mixins?: any; // conversation mixin methods | properties
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

  protected _init(router: express.Router, options: IComponentMiddlewareOptions): void {
    const opts: IComponentMiddlewareOptions = {
      baseDir: ComponentRegistry.COMPONENT_DIR,
      components: [],
      mixins: { },
      ...options
    };

    // TODO: apply manual registry here

    /**
     * assemble root registry from baseDirectory
     */
    const componentDir = path.join(this._root || process.cwd(), opts.baseDir)
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
    options: IComponentMiddlewareOptions,
    req: IMobileCloudRequest,
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
  private __invokationCb(res: express.Response): ICallback {
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
