import * as OracleBot from '../main';

import { MiddlewareAbstract } from '../../middleware/abstract'
import { AuthMiddleware } from '../../middleware/auth'
import { ParserMiddleware } from '../../middleware/parser'
import { ComponentMiddleware } from '../../middleware/component'

import { MockComponent } from '../../testing';

// some test components
import { MyFirstComponent } from '../support/example/components/one';
import LegacyComponent = require('../support/example/components/legacy');

// supertest
import * as http from 'http';
import * as supertest from 'supertest';

// open spec server configs.
import serverConf = require('../support/spec.config');

describe('Middleware', () => {

  it('should perform child middleware instantiations', () => {
    let spyAuthMw = spyOn(<any>AuthMiddleware.prototype, '_init');
    let spyParserMw = spyOn(<any>ParserMiddleware.prototype, '_init');
    let spyCompMw = spyOn(<any>ComponentMiddleware.prototype, '_init');
    expect(OracleBot.Middleware.init).not.toThrow();
    // individual middlewares don't get invoked without configs
    expect(spyAuthMw).not.toHaveBeenCalled();
    expect(spyParserMw).not.toHaveBeenCalled();
    expect(spyCompMw).not.toHaveBeenCalled();
  });

  it('should be failure tolerant', () => {
    class BadMiddlware extends MiddlewareAbstract {
      _init() {
        throw new Error('bad news bears');
      }
    }
    expect(BadMiddlware.extend.bind(BadMiddlware)).not.toThrow();
  });

  describe('server', () => {
    let server: http.Server;
    beforeAll(() => {
      server = require('../support/spec.server');
    });
    afterAll(done => {
      server.close(done);
    });

    describe('arbitrary routing', () => {
      it('should DENY `/` without auth', done => {
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
          .auth(serverConf.auth.user, serverConf.auth.pass)
          .expect(200, serverConf.messages.OK)
          .end(err => {
            return err ? done.fail(err) : done();
          });
      });

      it('should parse body', done => {
        const body = {foo: 'test'};
        supertest(server)
          .post('/echo')
          .send(body)
          .auth(serverConf.auth.user, serverConf.auth.pass)
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
          .auth(serverConf.auth.user, serverConf.auth.pass)
          .expect(200)
          .expect(res => {
            expect(res.body.version).toBeTruthy(`not contain version`);
            expect(res.body.components).toBeDefined(`did not contain components`);
            expect(res.body.components[0].name).toBeDefined(`component had no name`);
            // assert manual registry is applied globally
            expect(res.body.components.some(c => {
              return c.name === 'more.a'
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
          .send(MockComponent.Request())
          .auth(serverConf.auth.user, serverConf.auth.pass)
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
          .send(MockComponent.Request())
          .auth(serverConf.auth.user, serverConf.auth.pass)
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

      it('should 404 invalid component invokation', done => {
        supertest(server)
          .post(`${serverConf.componentPrefix}/foo`)
          .send(MockComponent.Request())
          .auth(serverConf.auth.user, serverConf.auth.pass)
          .expect(404)
          .end(err =>  err ? done.fail(err) : done());
      });

      describe('collections', () => {

        it('should 404 invalid collection', done => {
          supertest(server)
            .get(`${serverConf.componentPrefix}/collection/foo`)
            .auth(serverConf.auth.user, serverConf.auth.pass)
            .expect(404)
            .end(err =>  err ? done.fail(err) : done());
        });

        it('should 404 invalid component invokation', done => {
          supertest(server)
            .post(`${serverConf.componentPrefix}/collection/foo/foo`)
            .send(MockComponent.Request())
            .auth(serverConf.auth.user, serverConf.auth.pass)
            .expect(404)
            .end(err =>  err ? done.fail(err) : done());
        });

        it('should get {collection} metadata', done => {
          supertest(server)
            .get(`${serverConf.componentPrefix}/collection/sub`)
            .auth(serverConf.auth.user, serverConf.auth.pass)
            .expect(200)
            .expect(res => {
              expect(res.body.version).toBeTruthy(`not contain version`);
              // assert manual registry is applied globally
              expect(res.body.components.some(c => {
                return c.name === 'more.a'
              })).toBe(true);
            })
            .end(err => {
              return err ? done.fail(err) : done();
            });
        });

        it('should invoke siloed components', done => {
          supertest(server)
            .post(`${serverConf.componentPrefix}/collection/sub/sub.one`)
            .send(MockComponent.Request())
            .auth(serverConf.auth.user, serverConf.auth.pass)
            .expect(200)
            .end(err => {
              return err ? done.fail(err) : done();
            });
        });

      });

      describe('error handling', () => {

        it('should deny without auth', done => {
          supertest(server)
            .get(`${serverConf.componentPrefix}`)
            .expect(401)
            .end(err => {
              return err ? done.fail(err) : done();
            });
        });

        it('should 404 unknown collection metadata', done => {
          supertest(server)
            .get(`${serverConf.componentPrefix}/foo`)
            .auth(serverConf.auth.user, serverConf.auth.pass)
            .expect(404)
            .end(err => {
              return err ? done.fail(err) : done();
            });
        });

        it('should 404 invalid registry', done => {
          supertest(server)
            .post(`${serverConf.componentPrefix}/foo/bar`)
            .send(MockComponent.Request())
            .auth(serverConf.auth.user, serverConf.auth.pass)
            .expect(404)
            .end(err => {
              return err ? done.fail(err) : done();
            });
        });

        it('should 400 bad request', done => {
          supertest(server)
            .post(`${serverConf.componentPrefix}/test.one`)
            .send({})
            .auth(serverConf.auth.user, serverConf.auth.pass)
            .expect(400)
            .end(err => {
              return err ? done.fail(err) : done();
            });
        });

      });

    });

  });

});
