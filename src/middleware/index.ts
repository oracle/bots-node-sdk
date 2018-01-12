import * as express from 'express';
import { IStaticMiddlwareAbstract } from './abstract';
import { ParserMiddleware, IParserMiddlewareOptions } from './parser';
import { ComponentMiddleware, IComponentMiddlewareOptions } from './component';

/**
 * MiddlewareOptions. Define options/configuration for Bot middleware.
 */
export interface IMiddewareOptions {
  /** body-parser middleware options */
  parser?: IParserMiddlewareOptions;
  /** custom-component middleware options */
  component?: IComponentMiddlewareOptions;
};

/**
 * init middleware function. Add bot middleware to the app router stack.
 * @param options  options to configure the middleware.
 * @return express.Router
 * @todo add webhook middleware
 */
export function init(options: IMiddewareOptions = {}): express.Router {
  const router = express.Router();

  // create iterable map
  const mwMap = new Map<string, IStaticMiddlwareAbstract>([
    ['parser', ParserMiddleware],
    ['component', ComponentMiddleware],
  ]);
  // iterate and apply the middleware layers
  mwMap.forEach((mw, key) => {
    if (mw.required || !!options[key]) {
      mw.extend(router, options[key]);
    }
  });

  return router;
}

/**
 * parser function exposes a router with configurable body-parser middleware applied.
 * @param options - bodyParser middleware options
 */
export function getRouter(options: IParserMiddlewareOptions = {}): express.Router {
  return init({
    parser: options
  });
}
