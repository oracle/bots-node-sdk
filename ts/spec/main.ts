import { Config } from '../index';

// configure logger for testing
const logger = ['log', 'debug', 'warn', 'error', 'fatal', 'trace', 'info']
  .reduce((obj, method) => {
    obj[method] = () => {};
    return obj;
  }, {} as any);
Config.setLogger(logger);

// export main dist entrypoint
export * from '../index';
// export separate entrypoint artifacts
export * from '../lib/';
export * from '../middleware/';
export * from '../config/';
export * from '../util/';
