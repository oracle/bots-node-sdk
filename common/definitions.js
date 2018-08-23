'use strict';

/**
 * Check if a reference variable is Type.
 * @param {any} ref - object reference to test
 * @return boolean
 */
function isType(ref) {
  return typeof ref === 'function';
}

module.exports = {
  isType,
};
