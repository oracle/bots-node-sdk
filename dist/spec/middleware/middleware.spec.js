"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OracleBot = require("../main");
const abstract_1 = require("../../middleware/abstract");
const parser_1 = require("../../middleware/parser");
const component_1 = require("../../middleware/component");
const testing_1 = require("../../testing");
// some test components
const one_1 = require("../support/example/components/one");
const LegacyComponent = require("../support/example/components/legacy");
const supertest = require("supertest");
// open spec server configs.
const serverConf = require("../support/spec.config");
describe('Middleware', () => {
    it('should perform child middleware instantiations', () => {
        let spyParserMw = spyOn(parser_1.ParserMiddleware.prototype, '_init');
        let spyCompMw = spyOn(component_1.ComponentMiddleware.prototype, '_init');
        expect(OracleBot.Middleware.init).not.toThrow();
        // individual middlewares don't get invoked without configs
        expect(spyParserMw).toHaveBeenCalled(); // parser is required mw
        expect(spyCompMw).not.toHaveBeenCalled();
    });
    it('should be failure tolerant', () => {
        class BadMiddlware extends abstract_1.MiddlewareAbstract {
            _init() {
                throw new Error('bad news bears');
            }
        }
        expect(BadMiddlware.extend.bind(BadMiddlware)).not.toThrow();
    });
    describe('server', () => {
        let server;
        beforeAll(() => {
            server = require('../support/spec.server');
        });
        afterAll(done => {
            server.close(done);
        });
        describe('arbitrary routing', () => {
            xit('should DENY `/` without auth', done => {
                supertest(server)
                    .get('/')
                    .expect(401)
                    .end(err => {
                    return err ? done.fail(err) : done();
                });
            });
            it('should allow / WITH auth', done => {
                supertest(server)
                    .get('/')
                    .expect(200, serverConf.messages.OK)
                    .end(err => {
                    return err ? done.fail(err) : done();
                });
            });
            it('should parse body', done => {
                const body = { foo: 'test' };
                supertest(server)
                    .post('/echo')
                    .send(body)
                    .expect(200)
                    .expect(res => {
                    expect(res.body).toEqual(body);
                })
                    .end(err => {
                    return err ? done.fail(err) : done();
                });
            });
        });
        describe(`prefixed '${serverConf.componentPrefix}' component routes`, () => {
            it('should get root metadata', done => {
                supertest(server)
                    .get(`${serverConf.componentPrefix}`)
                    .expect(200)
                    .expect(res => {
                    expect(res.body.version).toBeTruthy(`not contain version`);
                    expect(res.body.components).toBeDefined(`did not contain components`);
                    expect(res.body.components[0].name).toBeDefined(`component had no name`);
                    // assert manual registry is applied globally
                    expect(res.body.components.some(c => {
                        return c.name === 'more.a';
                    })).toBe(true);
                })
                    .end(err => {
                    return err ? done.fail(err) : done();
                });
            });
            // test component invocation
            it('should invoke custom components', done => {
                const spy = spyOn(one_1.MyFirstComponent.prototype, 'invoke').and.callThrough();
                supertest(server)
                    .post(`${serverConf.componentPrefix}/test.one`)
                    .send(testing_1.MockRequest())
                    .expect(200)
                    .expect(res => {
                    expect(spy).toHaveBeenCalled();
                    expect(res.body).toEqual(jasmine.any(Object));
                    expect(res.body.error).toBe(false);
                })
                    .end(err => {
                    return err ? done.fail(err) : done();
                });
            });
            it('should invoke legacy components', done => {
                const spy = spyOn(LegacyComponent, 'invoke').and.callThrough();
                supertest(server)
                    .post(`${serverConf.componentPrefix}/legacy.style`)
                    .send(testing_1.MockRequest())
                    .expect(200)
                    .expect(res => {
                    expect(spy).toHaveBeenCalled();
                    expect(res.body).toEqual(jasmine.any(Object));
                    expect(res.body.error).toBe(false);
                })
                    .end(err => {
                    return err ? done.fail(err) : done();
                });
            });
            it('should 404 invalid component invocation', done => {
                supertest(server)
                    .post(`${serverConf.componentPrefix}/foo`)
                    .send(testing_1.MockRequest())
                    .expect(404)
                    .end(err => err ? done.fail(err) : done());
            });
            describe('collections', () => {
                it('should 404 invalid collection', done => {
                    supertest(server)
                        .get(`${serverConf.componentPrefix}/collection/foo`)
                        .expect(404)
                        .end(err => err ? done.fail(err) : done());
                });
                it('should 404 invalid component invocation', done => {
                    supertest(server)
                        .post(`${serverConf.componentPrefix}/collection/foo/foo`)
                        .send(testing_1.MockRequest())
                        .expect(404)
                        .end(err => err ? done.fail(err) : done());
                });
                it('should get {collection} metadata', done => {
                    supertest(server)
                        .get(`${serverConf.componentPrefix}/collection/sub`)
                        .expect(200)
                        .expect(res => {
                        expect(res.body.version).toBeTruthy(`not contain version`);
                        // assert manual registry is applied globally
                        expect(res.body.components.some(c => {
                            return c.name === 'more.a';
                        })).toBe(true);
                    })
                        .end(err => {
                        return err ? done.fail(err) : done();
                    });
                });
                it('should invoke siloed components', done => {
                    supertest(server)
                        .post(`${serverConf.componentPrefix}/collection/sub/sub.one`)
                        .send(testing_1.MockRequest())
                        .expect(200)
                        .end(err => {
                        return err ? done.fail(err) : done();
                    });
                });
            });
            describe('error handling', () => {
                it('should 404 unknown collection metadata', done => {
                    supertest(server)
                        .get(`${serverConf.componentPrefix}/foo`)
                        .expect(404)
                        .end(err => {
                        return err ? done.fail(err) : done();
                    });
                });
                it('should 404 invalid registry', done => {
                    supertest(server)
                        .post(`${serverConf.componentPrefix}/foo/bar`)
                        .send(testing_1.MockRequest())
                        .expect(404)
                        .end(err => {
                        return err ? done.fail(err) : done();
                    });
                });
                it('should 400 bad request', done => {
                    supertest(server)
                        .post(`${serverConf.componentPrefix}/test.one`)
                        .send({})
                        .expect(400)
                        .end(err => {
                        return err ? done.fail(err) : done();
                    });
                });
            });
        });
    });
});
//# sourceMappingURL=middleware.spec.js.map