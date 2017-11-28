import { BotComponent, ComponentAbstract } from '../../../../main';

@BotComponent({
  name: 'sub.one',
})
export class SubComponent extends ComponentAbstract {
  invoke(sdk: any, done) {
    this.logger.info('A siloed component!');
    done();
  }
}
