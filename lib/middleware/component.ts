import { express, BotMiddlewareAbstract } from './abstract';
import { BotComponentRegistry } from '../modules/component';
import { SDK } from '../sdk';

/**
 * concentrated parser middleware options
 */
export interface ComponentMiddlewareOptions {
  baseDir?: string;
}

/**
 * define req.param keys
 */
const [PARAM_COLLECTION, PARAM_COMPONENT] = ['collection', 'component'];
const MESSAGES = {
  NOT_FOUND: 'not found',
}

/**
 * BotComponentMiddleware.
 * @extends BotMiddlewareAbstract
 */
export class BotComponentMiddleware extends BotMiddlewareAbstract {

  protected _init(router: express.Router, options: ComponentMiddlewareOptions): void {
    const opts: ComponentMiddlewareOptions = {
      baseDir: BotComponentRegistry.COMPONENT_DIR,
      ...options
    };

    const rootRegistry = BotComponentRegistry.assemble(null, opts.baseDir, this._root);

    /**
     * establish component metadata index
     */
    router.get('/', (req, res) => {
      const meta = SDK.Shell(null, rootRegistry)
        .getAllComponentMetadata();
      res.json(meta);
    });

    /**
     * handle root component invokation
     */
    router.post(`/:${PARAM_COMPONENT}`, (req, res) => {
      const componentName = req.params[PARAM_COMPONENT];
      // invoke
      this.__invoke(componentName, rootRegistry, req, res);
    });

    /**
     * get metadata for a child collection
     */
    router.get(`/collection/:${PARAM_COLLECTION}`, (req, res) => {
      const collectionName = req.params[PARAM_COLLECTION];
      if (rootRegistry.isCollection(collectionName)) {
        const meta = SDK.Shell(null, rootRegistry.getRegistry(collectionName))
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
      this.__invoke(componentName, registry || rootRegistry, req, res);
    });
  }

  /**
   * invoke the component shell.
   * @param componentName: string - component name
   * @param registry - registry to which the component belongs
   * @param req - express.Request
   * @param res - express.Response
   */
  private __invoke(
    componentName: string,
    registry: BotComponentRegistry,
    req: express.Request,
    res: express.Response
  ): void {
    SDK.Shell(null, registry)
      .invokeComponentByName(componentName, req.body, null, this.__invokationCb(res));
  }

  /**
   * convenience handler for CC invokcation
   * @param res: express.Resonse
   */
  private __invokationCb(res: express.Response): SDK.Callback {
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
