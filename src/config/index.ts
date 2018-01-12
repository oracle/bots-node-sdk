import { CommonProvider, PROVIDER_KEY_JOI, PROVIDER_KEY_LOGGER } from '../common/provider';
import { ILogger } from '../common/definitions';

export { ILogger }

/**
 * declare logging instance
 * @param logger - logging utility
 */
export function setLogger(logger: ILogger): void {
  CommonProvider.register({
    key: PROVIDER_KEY_LOGGER,
    use: logger
  });
}
