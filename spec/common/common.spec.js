'use strict';

const { CONSTANTS } = require("../../common/constants");
const { isType } = require("../../common/definitions");

describe('Common', () => {
  describe('CONSTANTS', () => {
    it('should declare constants', () => {
      expect(CONSTANTS.WEBHOOK_HEADER).toEqual('X-Hub-Signature');
      expect(CONSTANTS.DEFAULT_COMPONENT_DIR).toContain('components');
    });
  });
  describe('definitions', () => {
    it('should test for type', () => {
      function SomeFunction() { }
      class SomeClass { }
      const SomeObject = {};
      expect(isType(SomeClass)).toBe(true);
      expect(isType(SomeFunction)).toBe(true);
      expect(isType(SomeObject)).toBe(false);
    });
  });
});
