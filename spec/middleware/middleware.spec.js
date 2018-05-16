"use strict";

const express = require("express");
const supertest = require("supertest");

const OracleBot = require("../main");
const { CONSTANTS } = require('../../common/constants');
const { MiddlewareAbstract } = require("../../middleware/abstract");
const { ParserMiddleware } = require("../../middleware/parser");
const { ComponentMiddleware } = require("../../middleware/component");
const { MockRequest } = require("../../testing");
// some test components
const { MyFirstComponent } = require("../support/testing/components/one");
const LegacyComponent = require("../support/testing/components/legacy");
// open spec server configs.
const serverConf = require("../support/spec.config");

describe('Middleware', () => {

  it('should init child middleware', () => {
    let spyParserMw = spyOn(ParserMiddleware.prototype, '_init');
    let spyCompMw = spyOn(ComponentMiddleware.prototype, '_init');
    expect(OracleBot.Middleware.init.bind(express())).not.toThrow();
    // individual middlewares don't get invoked without configs
    expect(spyParserMw).toHaveBeenCalled(); // parser is always used
    expect(spyCompMw).not.toHaveBeenCalled();
  });

  it('should init customComponent middleware', () => {
    const mw = OracleBot.Middleware.customComponent();
    expect(mw.stack).toBeDefined();
    expect(mw.stack.length).toBeGreaterThan(0);
    expect(mw.stack.some(layer => layer.route && layer.route.path === '/:component')).toBe(true);
  });

  it('should be failure tolerant', () => {
    class BadMiddlware extends MiddlewareAbstract {
      _init() {
        throw new Error('bad news bears');
      }
    }
    expect(BadMiddlware.extend.bind(BadMiddlware)).not.toThrow();
  });

  describe('Handlers', () => {
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

    describe(`configurable '${serverConf.componentPrefix}' component routes`, () => {
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
        const spy = spyOn(MyFirstComponent.prototype, 'invoke').and.callThrough();
        supertest(server)
          .post(`${serverConf.componentPrefix}/test.one`)
          .send(MockRequest())
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
          .send(MockRequest())
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
          .send(MockRequest())
          .expect(404)
          .end(err => err ? done.fail(err) : done());
      });
      
      // presently disabled
      xdescribe('collections', () => {
        it('should 404 invalid collection', done => {
          supertest(server)
            .get(`${serverConf.componentPrefix}/collection/foo`)
            .expect(404)
            .end(err => err ? done.fail(err) : done());
        });
        it('should 404 invalid component invocation', done => {
          supertest(server)
            .post(`${serverConf.componentPrefix}/collection/foo/foo`)
            .send(MockRequest())
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
            .send(MockRequest())
            .expect(200)
            .end(err => {
              return err ? done.fail(err) : done();
            });
        });
      });

      // error handling
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
            .send(MockRequest())
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

    describe(`configurable webhook handlers`, () => {
      it('should error 400 without signature', done => {
        const body = { foo: 'test' };
        supertest(server)
          .post(serverConf.webhookRouterUri)
          .send(body)
          .expect(400)
          .end(err => err ? done.fail(err) : done());
      });

      it('should 400 without secret key', done => {
        supertest(server)
          .post(serverConf.webhookWithoutSecret)
          .expect(400)
          .end(err => err ? done.fail(err) : done());
      });

      it('should error 403 with invalid signature', done => {
        const body = { foo: 'test' };
        const buf = Buffer.from(JSON.stringify(body), 'utf8');
        const signature = OracleBot.Util.Webhook.buildSignatureHeader(buf, 'wrongsecret');
        supertest(server)
          .post(serverConf.webhookRouterUri)
          .set(CONSTANTS.WEBHOOK_HEADER, signature)
          .send(body)
          .expect(403)
          .end(err => err ? done.fail(err) : done());
      });
      
      it('should support webhook router with receiver', done => {
        const body = { foo: 'test' };
        const buf = Buffer.from(JSON.stringify(body), 'utf8');
        const signature = OracleBot.Util.Webhook.buildSignatureHeader(buf, serverConf.webhookSecret);
        supertest(server)
          .post(serverConf.webhookReceiverUri)
          .set(CONSTANTS.WEBHOOK_HEADER, signature)
          .send(body)
          .expect(200)
          .end(err => err ? done.fail(err) : done());
      });
      
      it('should support standalone webhook receiver', done => {
        const body = { foo: 'test' };
        const buf = Buffer.from(JSON.stringify(body), 'utf8');
        const signature = OracleBot.Util.Webhook.buildSignatureHeader(buf, serverConf.webhookSecret);
        supertest(server)
          .post(serverConf.webhookRouterUri)
          .set(CONSTANTS.WEBHOOK_HEADER, signature)
          .send(body)
          .expect(200)
          .end(err => err ? done.fail(err) : done());
      });
    });

  });
});
