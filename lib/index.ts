import * as express from 'express';
import { Type } from './common/definitions';
import {
  BotMiddlewareAbstract,
  // auth
  BotAuthMiddleware,
  AuthMiddlewareOptions,
  AUTH_TYPE as _AUTH_TYPE,
  // body parser
  BotParserMiddleware,
  ParserMiddlewareOptions,
  // component
  BotComponentMiddleware,
  ComponentMiddlewareOptions,
} from './middleware';

import {
  BotComponent,
  BotComponentAbstract,
  BotComponentRegistry
} from './modules';

// channel abstractions
import { Channels as _Channels } from './channels';

// Raw IBCS sdk
import { SDK as _SDK } from './sdk';

/**
 * OracleBot module.
 */
namespace OracleBot {

    /**
     * AUTH_TYPE enum.
     * exported through ambient import
     */
    export import AUTH_TYPE = _AUTH_TYPE;

    /**
     * expose default component directory
     */
    export const DEFAULT_COMPONENT_DIR = BotComponentRegistry.COMPONENT_DIR;

    /**
     * MiddlewareOptions type. Defines options/configuration for Bot middleware.
     */
    export type MiddewareOptions = {
      root?: string; // server root directory defaults to process.cwd()
      auth?: AuthMiddlewareOptions;
      parser?: ParserMiddlewareOptions;
      component?: ComponentMiddlewareOptions;
    };

    /**
     * middleware function. Add bot middleware to express app.
     * @param options: MiddlewareOptions to configure the middleware.
     * @return express.Router
     */
    export function middleware(options: MiddewareOptions = {}): express.Router {
      const router = express.Router();
      const root = options.root || process.cwd();
      // const mwMAp = new Map<string, {extend(...args: any[]): any}>([
      const mwMAp = new Map<string, Type<BotMiddlewareAbstract>>([
        ['auth', BotAuthMiddleware],
        ['parser', BotParserMiddleware],
        ['component', BotComponentMiddleware],
      ]);
      mwMAp.forEach((mw, key) => {
        if (!!options[key]) {
          mw.extend(root, router, options[key]);
        }
      });
      // TODO: add error handler middleware
      return router;
    }

    /**
     * @OracleBot.Component() decorator.
     * exposes object BotComponent
     */
    export const Component = BotComponent;
    export type Component = BotComponent;

    /**
     * OracleBot.ComponentAbstract class.
     * exposes BotComponentAbstact
     */
    export const ComponentAbstract = BotComponentAbstract;
    export type ComponentAbstract = BotComponentAbstract;

    /**
     * re-export the conversation type from the SDK
     */
    // export import Conversation = _SDK.Conversation;
    // export import SDK = _SDK;

    export const SDK = _SDK;
    export type SDK = _SDK;

    /**
     * export conversation channel abstractions
     */
    export import Channel = _Channels;
}

export = OracleBot;
