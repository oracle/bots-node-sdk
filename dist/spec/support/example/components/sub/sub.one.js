"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../../../../../lib");
let SubComponent = class SubComponent extends lib_1.ComponentAbstract {
    invoke(sdk, done) {
        this.logger.info('A siloed component!');
        done();
    }
};
SubComponent = __decorate([
    lib_1.BotComponent({
        name: 'sub.one',
    })
], SubComponent);
exports.SubComponent = SubComponent;
//# sourceMappingURL=sub.one.js.map