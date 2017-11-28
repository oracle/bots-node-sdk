import * as express from 'express';
import { IStaticMiddlwareAbstract } from './abstract';
import { AuthMiddleware, IAuthMiddlewareOptions, AUTH_TYPE } from './auth';
import { ParserMiddleware, IParserMiddlewareOptions } from './parser';
import { ComponentMiddleware, IComponentMiddlewareOptions } from './component';

export { AUTH_TYPE }

/**
 * MiddlewareOptions type. Defines options/configuration for Bot middleware.
 */
export interface IMiddewareOptions {
  root?: string; // server root directory defaults to process.cwd()
  auth?: IAuthMiddlewareOptions;
  parser?: IParserMiddlewareOptions;
  component?: IComponentMiddlewareOptions;
};

/**
 * middleware function. Add bot middleware to the app router stack.
 * @param options: MiddlewareOptions to configure the middleware.
 * @return express.Router
 * @todo add webhook middleware
 */
export function middleware(options: IMiddewareOptions = {}): express.Router {
  const router = express.Router();
  const root = options.root || process.cwd();
  // create iterable map
  const mwMap = new Map<string, IStaticMiddlwareAbstract>([
    ['auth', AuthMiddleware],
    ['parser', ParserMiddleware],
    ['component', ComponentMiddleware],
  ]);
  // iterate and apply the middleware layers
  mwMap.forEach((mw, key) => {
    if (!!options[key]) {
      mw.extend(root, router, options[key]);
    }
  });

  return router;
}
