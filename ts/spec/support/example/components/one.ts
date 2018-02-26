import { Component, ComponentAbstract } from '../../../main';

/**
 * test component by extending OracleBot.ComponentAbstract
 */
@Component({
  name: 'test.one',
})
export class MyFirstComponent extends ComponentAbstract {
  invoke(sdk: any, done) {
    this.logger.info('Testing');
    done();
  }
}
