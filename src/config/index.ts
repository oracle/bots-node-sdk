import { CommonProvider, PROVIDER_KEY_JOI, PROVIDER_KEY_LOGGER } from '../common/provider';
import { ILogger } from '../common/definitions';

export namespace Config {

  /**
   * declare logging instance
   * @param logger - logging utility
   */
  export function setLogger(logger: ILogger) {
    CommonProvider.register({
      key: PROVIDER_KEY_LOGGER,
      use: logger
    });
  }

}
