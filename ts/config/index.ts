import { CommonProvider, PROVIDER_KEY_LOGGER } from '../common/provider';
import { Logger } from '../common/definitions';

export { Logger }

/**
 * declare logging instance
 * @param logger - logging utility
 */
export function setLogger(logger: Logger): void {
  CommonProvider.register({
    key: PROVIDER_KEY_LOGGER,
    use: logger
  });
}
