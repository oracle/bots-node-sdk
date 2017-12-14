import { Component, ComponentAbstract } from '../../../main';

/**
 * test component without extending OracleBot.ComponentAbstract
 */
@Component({
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
@Component({
  name: 'test.nonextended',
})
export class ComponentTwoDuplicate {

}
