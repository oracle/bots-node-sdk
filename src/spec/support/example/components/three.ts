import { Component, ComponentAbstract } from '../../../main';

@Component({
  name: 'test.direct',
})
class ComponentThree {

}
// example with direct export class (module.exports = {})
export = ComponentThree;
