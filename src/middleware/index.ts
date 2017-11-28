import * as express from 'express';
import { StaticMiddlwareAbstract } from './abstract';
import { AuthMiddleware, AuthMiddlewareOptions, AUTH_TYPE } from './auth';
import { ParserMiddleware, ParserMiddlewareOptions } from './parser';
import { ComponentMiddleware, ComponentMiddlewareOptions } from './component';

export { AUTH_TYPE }

/**
 * MiddlewareOptions type. Defines options/configuration for Bot middleware.
 */
export interface MiddewareOptions {
  root?: string; // server root directory defaults to process.cwd()
  auth?: AuthMiddlewareOptions;
  parser?: ParserMiddlewareOptions;
  component?: ComponentMiddlewareOptions;
};

/**
 * middleware function. Add bot middleware to the app router stack.
 * @param options: MiddlewareOptions to configure the middleware.
 * @return express.Router
 * @todo add webhook middleware
 */
export function middleware(options: MiddewareOptions = {}): express.Router {
  const router = express.Router();
  const root = options.root || process.cwd();
  // create iterable map
  const mwMap = new Map<string, StaticMiddlwareAbstract>([
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
