import { InvocationCallback } from '../common/definitions';
import { ComponentListItem, ComponentRegistry } from '../lib/component/registry';
import { MobileCloudRequest, MiddlewareAbstract, express } from './abstract';
import { ComponentShell as Shell } from '../lib/component/shell';
import { STATUS_CODE } from './codes';

/**
 * component middleware specific options
 */
export interface ComponentMiddlewareOptions {
  /** base url for custom component endpoints (defaults to '/') */
  baseUrl?: string;
  /** working directory of the project runtime (defaults to process.cwd()) */
  cwd?: string;
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

/**
 * ComponentMiddleware.
 * @extends MiddlewareAbstract
 */
export class ComponentMiddleware extends MiddlewareAbstract {

  protected _init(service: express.Express, options: ComponentMiddlewareOptions): void {
    if (!service || typeof service.get !== 'function' || typeof service.post !== 'function') {
      throw new Error('Cannot initialize component middleware: service argument is required');
    }
    const opts: ComponentMiddlewareOptions = {
      // option defaults
      // autocollect: ComponentRegistry.COMPONENT_DIR,
      baseUrl: '/',
      register: [ ],
      mixins: { },
      // user options
      ...options
    };

    /**
     * assemble root registry from provided `register` property
     * merge explicitly provided component registry with the hierarchical fs registry.
     */
    const rootRegistry: ComponentRegistry = ComponentRegistry.create(opts.register, opts.cwd);

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
     * @param req - MobileCloudRequest
     */
    service.post(this.__endpoint(baseUrl, `/resolveentities/:${PARAM_COMPONENT}`), (req, res) => {
      const componentName = req.params[PARAM_COMPONENT];
      const mixins = { ...opts.mixins };
      this.__getShell(rootRegistry).invokeResolveEntitiesEventHandler(componentName, req.body, this.__invocationCb(res), mixins);
    });
  }

  /**
   * construct an endpoint from base and url
   * @param base - base url
   * @param url - endpoint url
   */
  private __endpoint(base: string, url: string): string {
    return '/' + [base, url].map(part => part.replace(/^\/|\/$/g, ''))
      .filter(part => !!part)
      .join('/');
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
    options: ComponentMiddlewareOptions,
    req: MobileCloudRequest,
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
  private __invocationCb(res: express.Response): InvocationCallback {
    return (err, data) => {
      // direct port from components.js
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
