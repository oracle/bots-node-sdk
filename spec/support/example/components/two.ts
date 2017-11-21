import { BotComponent, ComponentAbstract } from '../../../../lib';

/**
 * test component without extending OracleBot.ComponentAbstract
 */
@BotComponent({
  name: 'test.nonextended',
})
export class ComponentTwo {
  invoke(sdk: any, done) {
    done();
  }
}

/**
 * test creation of a component with same name
 */
@BotComponent({
  name: 'test.nonextended',
})
export class ComponentTwoDuplicate {

}
