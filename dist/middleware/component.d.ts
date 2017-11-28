/// <reference types="express" />
import { express, MiddlewareAbstract } from './abstract';
/**
 * concentrated component middleware options
 */
export interface IComponentMiddlewareOptions {
    baseDir?: string;
    mixins?: any;
}
/**
 * ComponentMiddleware.
 * @extends MiddlewareAbstract
 */
export declare class ComponentMiddleware extends MiddlewareAbstract {
    protected _init(router: express.Router, options: IComponentMiddlewareOptions): void;
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
    private __invokationCb(res);
}
