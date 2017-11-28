import { BotComponent, ComponentAbstract } from '../../../main';

/**
 * test component by extending OracleBot.ComponentAbstract
 */
@BotComponent({
  name: 'test.one',
})
export class MyFirstComponent extends ComponentAbstract {
  invoke(sdk: any, done) {
    this.logger.info('Testing');
    done();
  }
}
