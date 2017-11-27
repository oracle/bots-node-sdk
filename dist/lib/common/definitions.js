"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * typeof function alias.
 */
exports.Type = Function;
/**
 * Check if a reference variable is Type.
 * @param ref {any} - object reference to test
 * @returns boolean
 */
function isType(ref) {
    return typeof ref === 'function';
}
exports.isType = isType;
//# sourceMappingURL=definitions.js.map