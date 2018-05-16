import * as express from 'express';
import { IStaticMiddlwareAbstract } from './abstract';
import { ComponentMiddleware, IComponentMiddlewareOptions } from './component';
import { IParserMiddlewareOptions, ParserMiddleware } from './parser';

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
 * custom component middleware. Add bot custom component middleware to the app router stack.
 * @param options - ComponentMiddlewareOptions with option for parser config.
 */
export function customComponent(options: IComponentMiddlewareOptions & { parser?: IParserMiddlewareOptions } = <any>{}) {
  return init({
    component: options,
    parser: options.parser || {},
  });
}
