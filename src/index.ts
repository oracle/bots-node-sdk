
// main provider for common object references.
import * as Joi from 'joi';
import { CommonProvider, PROVIDER_KEY_JOI } from './common/provider';

// main exports
export * from './config';
export * from './middleware';
export * from './modules';
export * from './util';

// TODO - Move to a Config module.
CommonProvider.register([
  {key: PROVIDER_KEY_JOI, use: Joi}
]);
