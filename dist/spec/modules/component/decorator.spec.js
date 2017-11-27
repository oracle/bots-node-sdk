"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../../../lib");
describe('@BotComponent Decorator', () => {
    it('should utilize decorator reverse abstraction', () => {
        const c = new TestComponent();
        expect(c['metadata']).toEqual(jasmine.any(Function));
        expect(c['metadata'].bind(c)).not.toThrow();
        expect(c.invoke).not.toThrow();
    });
    it('should use class name as basis for missing meta name', () => {
        const c = new TestComponent();
        expect(c.annotations.name).toEqual('test.component');
    });
    it('should use explicitly provided name', () => {
        const c = new TestComponentWithError();
        expect(c.annotations.name).toEqual('test.error');
    });
    it('should catch errors gracefully', done => {
        const c = new TestComponentWithError();
        expect(c.invoke).toThrow(); // invocation without Callback will throw
        c.invoke(null, (err) => {
            expect(err).toBeDefined();
            done();
        });
    });
    /**
     * even though TestInvalidComponent doesn't define an invoke method,
     * the decorator creates one allowing calls to the method.
     */
    it('should callback with error on improper implementation', done => {
        const c = new TestInvalidComponent();
        c.invoke(null, (err) => {
            expect(err).toBeDefined();
            done();
        });
    });
});
// test a valid component
let TestComponent = class TestComponent extends lib_1.ComponentAbstract {
    invoke() { }
};
TestComponent = __decorate([
    lib_1.BotComponent({
        supportedActions: [],
        properties: {
            firstname: { type: 'string', required: true }
        },
    })
], TestComponent);
// test a valid component with explicit name
let TestComponentWithError = class TestComponentWithError extends lib_1.ComponentAbstract {
    invoke() {
        throw new Error('Bad things happen');
    }
};
TestComponentWithError = __decorate([
    lib_1.BotComponent({
        name: 'test.error',
        supportedActions: [],
        properties: {
            firstname: { type: 'string', required: true }
        },
    })
], TestComponentWithError);
// test invalid component
let TestInvalidComponent = class TestInvalidComponent {
};
TestInvalidComponent = __decorate([
    lib_1.BotComponent({
        supportedActions: [],
        properties: {},
    })
], TestInvalidComponent);
//# sourceMappingURL=decorator.spec.js.map