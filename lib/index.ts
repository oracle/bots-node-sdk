
// main provider for common object references.
import * as log4js from 'log4js';
import * as Joi from 'joi';
import { CommonProvider, PROVIDER_KEY_JOI, PROVIDER_KEY_LOGGER } from './common/provider';
CommonProvider.register([
  {key: PROVIDER_KEY_JOI, use: Joi},
  {key: PROVIDER_KEY_LOGGER, use: log4js.getLogger()},
]);

// main exports
export * from './middleware';
export * from './modules';
export * from './util';
