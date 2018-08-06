import { ICallback } from '../common/definitions';
import { ComponentListItem, ComponentRegistry } from '../lib/component/registry';
import { IMobileCloudRequest, MiddlewareAbstract, express } from './abstract';

import Shell = require('../lib/component/shell');

/**
 * component middleware specific options
 */
export interface IComponentMiddlewareOptions {
  /** working directory of the project runtime (defaults to process.cwd()) */
  cwd: string;
  /** list of components to register, these will be considered 'global' */
  register?: ComponentListItem[];
  /** base directory for component registry scan into collections */
  autocollect?: string;
  /** conversation mixin methods | properties */
  mixins?: any;
}

/**
 * define req.param keys
 */
// const [PARAM_COLLECTION, PARAM_COMPONENT] = ['collection', 'component'];
const [PARAM_COMPONENT] = ['component'];
// const MESSAGES = {
//   NOT_FOUND: 'not found',
// };

/**
 * ComponentMiddleware.
 * @extends MiddlewareAbstract
 */
export class ComponentMiddleware extends MiddlewareAbstract {

  protected _init(router: express.Router, options: IComponentMiddlewareOptions): void {
    const opts: IComponentMiddlewareOptions = {
      // option defaults
      // autocollect: ComponentRegistry.COMPONENT_DIR,
      register: [ ],
      mixins: { },
      // user options
      ...options
    };

    /**
     * assemble root registry from provided `register` property
     * merge explicitly provided component registry with the hierarchical fs registry.
     */
    let rootRegistry: ComponentRegistry;
    const commonRegistry = ComponentRegistry.create(opts.register, opts.cwd);
    if (0 && opts.autocollect) { // disabled for now
      rootRegistry = ComponentRegistry.assemble(null, opts.autocollect, opts.cwd)
        .merge(commonRegistry, true);
    } else {
      rootRegistry = commonRegistry;
    }

    /**
     * establish component metadata index
     */
    this._addHandler('get', '/', (req, res) => {
    // router.get('/', (req, res) => {
      const meta = this.__getShell(rootRegistry)
        .getAllComponentMetadata();
      res.json(meta);
    });

    /**
     * handle root component invocation
     */
    this._addHandler('post', `/:${PARAM_COMPONENT}`, (req, res) => {
    // router.post(`/:${PARAM_COMPONENT}`, (req, res) => {
      const componentName = req.params[PARAM_COMPONENT];
      // invoke
      this.__invoke(componentName, rootRegistry, opts, req, res);
    });
  }

  /**
   * get Shell methods
   * @param registry - The registry for the invocation shell
   */
  private __getShell(registry: ComponentRegistry) {
    return Shell({logger: this._logger}, registry);
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
    this.__getShell(registry)
      .invokeComponentByName(componentName, req.body, mixins, this.__invocationCb(res));
  }

  /**
   * convenience handler for CC invocation
   * @param res: express.Response
   */
  private __invocationCb(res: express.Response): ICallback {
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
