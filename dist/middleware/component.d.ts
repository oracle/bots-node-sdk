/// <reference types="express" />
import { express, MiddlewareAbstract } from './abstract';
import { ComponentListItem } from '../modules/component/registry';
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
 * ComponentMiddleware.
 * @extends MiddlewareAbstract
 */
export declare class ComponentMiddleware extends MiddlewareAbstract {
    protected _init(router: express.Router, options: IComponentMiddlewareOptions): void;
    /**
     * get Shell methods
     * @param registry - The registry for the invocation shell
     */
    private __getShell(registry);
    /**
     * invoke the component shell.
     * @param componentName: string - component name
     * @param registry - registry to which the component belongs
     * @param options - Middleware options reference.
     * @param req - MobileCloudRequest
     * @param res - express.Response
     */
    private __invoke(componentName, registry, options, req, res);
    /**
     * convenience handler for CC invokcation
     * @param res: express.Resonse
     */
    private __invocationCb(res);
}
