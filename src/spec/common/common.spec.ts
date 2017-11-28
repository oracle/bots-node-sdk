import { CONSTANTS } from '../../common/constants';
import { isType } from '../../common/definitions';

describe('Common', () => {
  describe('CONSTANTS', () => {
    it('should declare constants', () => {
      expect(CONSTANTS.WEBHOOK_HEADER).toEqual('X-Hub-Signature');
      expect(CONSTANTS.DEFAULT_COMPONENT_DIR).toContain('components');
    });
  });

  describe('definitions', () => {
    it('should test for type', () => {
      expect(isType(SomeClass)).toBe(true);
      expect(isType({})).toBe(false);
    });
  });
});

class SomeClass {

}
