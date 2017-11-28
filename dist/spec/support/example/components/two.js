"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("../../../main");
/**
 * test component without extending OracleBot.ComponentAbstract
 */
let ComponentTwo = class ComponentTwo {
    invoke(sdk, done) {
        done();
    }
};
ComponentTwo = __decorate([
    main_1.BotComponent({
        name: 'test.nonextended',
    })
], ComponentTwo);
exports.ComponentTwo = ComponentTwo;
/**
 * test creation of a component with same name
 */
let ComponentTwoDuplicate = class ComponentTwoDuplicate {
};
ComponentTwoDuplicate = __decorate([
    main_1.BotComponent({
        name: 'test.nonextended',
    })
], ComponentTwoDuplicate);
exports.ComponentTwoDuplicate = ComponentTwoDuplicate;
//# sourceMappingURL=two.js.map