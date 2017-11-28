import { BotComponent, ComponentAbstract } from '../../../main';

@BotComponent({
  name: 'test.direct',
})
class ComponentThree {

}
// example with direct export class (module.exports = {})
export = ComponentThree;
