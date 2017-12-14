"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_1 = require("./abstract");
const registry_1 = require("../modules/component/registry");
const Shell = require("../modules/conversation/shell");
/**
 * define req.param keys
 */
const [PARAM_COLLECTION, PARAM_COMPONENT] = ['collection', 'component'];
const MESSAGES = {
    NOT_FOUND: 'not found',
};
/**
 * ComponentMiddleware.
 * @extends MiddlewareAbstract
 */
class ComponentMiddleware extends abstract_1.MiddlewareAbstract {
    _init(router, options) {
        const opts = Object.assign({ 
            // option defaults
            // autocollect: ComponentRegistry.COMPONENT_DIR,
            register: [], mixins: {} }, options);
        /**
         * assemble root registry from provided `autocollect`
         * merge explicitly provided component registry with the hierarchical fs registry.
         */
        let rootRegistry;
        const commonRegistry = registry_1.ComponentRegistry.create(opts.register, opts.cwd);
        if (opts.autocollect) {
            rootRegistry = registry_1.ComponentRegistry.assemble(null, opts.autocollect, opts.cwd)
                .merge(commonRegistry, true);
        }
        else {
            rootRegistry = commonRegistry;
        }
        /**
         * establish component metadata index
         */
        router.get('/', (req, res) => {
            const meta = this.__getShell(rootRegistry)
                .getAllComponentMetadata();
            res.json(meta);
        });
        /**
         * handle root component invocation
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
                const meta = this.__getShell(rootRegistry.getRegistry(collectionName))
                    .getAllComponentMetadata();
                res.json(meta);
            }
            else {
                this._logger.error(`${collectionName} not found in registry`);
                res.status(404).send(MESSAGES.NOT_FOUND);
            }
        });
        /**
         * handle component invocation by collection
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
     * get Shell methods
     * @param registry - The registry for the invocation shell
     */
    __getShell(registry) {
        return Shell({ logger: this._logger }, registry);
    }
    /**
     * invoke the component shell.
     * @param componentName: string - component name
     * @param registry - registry to which the component belongs
     * @param options - Middleware options reference.
     * @param req - MobileCloudRequest
     * @param res - express.Response
     */
    __invoke(componentName, registry, options, req, res) {
        // apply mixins and invoke component
        const mixins = Object.assign({}, options.mixins);
        if (!!req.oracleMobile) {
            mixins.oracleMobile = req.oracleMobile;
        }
        this.__getShell(registry)
            .invokeComponentByName(componentName, req.body, mixins, this.__invocationCb(res));
    }
    /**
     * convenience handler for CC invokcation
     * @param res: express.Resonse
     */
    __invocationCb(res) {
        return (err, data) => {
            // direct port from components.js
            if (!err) {
                res.status(200).json(data);
            }
            else {
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
        };
    }
}
exports.ComponentMiddleware = ComponentMiddleware;
//# sourceMappingURL=component.js.map