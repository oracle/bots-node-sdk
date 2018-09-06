'use strict';

const express = require("express");
const supertest = require("supertest");

const OracleBot = require("../main");
const { CONSTANTS } = require('../../common/constants');
const { MiddlewareAbstract } = require("../../middleware/abstract");
const { ParserMiddleware } = require("../../middleware/parser");
const { ComponentMiddleware } = require("../../middleware/component");

const { webhookUtil } = require("../../util/");
const { MessageModel } = require("../../lib/message");
const { WebhookClient, WebhookEvent } = require('../../middleware/webhook');
const { MockRequest } = require("../../testing");
// some test components
const { MyFirstComponent } = require("../support/testing/components/one");
const LegacyComponent = require("../support/testing/components/legacy");
// open spec server configs.
const serverConf = require("../support/spec.config");

describe('Middleware', () => {

  it('should init customComponent middleware', () => {
    const app = express();
    const spyParser = spyOn(ParserMiddleware.prototype, '_init').and.callThrough();
    const spyCC = spyOn(ComponentMiddleware.prototype, '_init').and.callThrough();
    const mw = OracleBot.Middleware.customComponent(app);
    expect(mw).toEqual(jasmine.any(Function));
    expect(spyParser).toHaveBeenCalledBefore(spyCC);
  });

  it('should be failure intolerant', () => {
    class BadMiddlware extends MiddlewareAbstract {
      _init() {
        throw new Error('bad news bears');
      }
    }
    expect(BadMiddlware.extend.bind(BadMiddlware)).toThrow();
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
      // xit('should DENY `/` without auth', done => {
      //   supertest(server)
      //     .get('/')
      //     .expect(401)
      //     .end(err => {
      //       return err ? done.fail(err) : done();
      //     });
      // });
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

    describe(`Custom Component`, () => {

      it('should properly assert service types', () => {
        const getCM = (service) => {
          return new ComponentMiddleware(service);
        };

        expect(getCM).toThrow();
        expect(getCM.bind(null, express())).not.toThrow();
        expect(getCM.bind(null, express.Router())).not.toThrow();
      });

      it('should construct endpoints consistently', () => {
        const app = express.Router();
        const mw = new ComponentMiddleware(app, {});
        expect(mw.__endpoint('/components', '/')).toEqual('/components');
        expect(mw.__endpoint('components', '')).toEqual('/components');
        expect(mw.__endpoint('components', '/')).toEqual('/components');
        expect(mw.__endpoint('components/', '/')).toEqual('/components');
        expect(mw.__endpoint('/components/', '/')).toEqual('/components');
      });

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
      /* xdescribe('collections', () => {
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
      });*/

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

    describe(`WebhookClient`, () => {
      
      it('should export MessageModel', () => {
        const client = serverConf.webhookClient;
        expect(client.MessageModel).toEqual(jasmine.any(Function));
        expect(client.MessageModel()).toEqual(MessageModel);
      });

      it('should error 400 without signature', done => {
        const body = { foo: 'test' };
        supertest(server)
          .post(serverConf.webhookReceiverUri)
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
        const badSignature = OracleBot.Util.Webhook.buildSignatureHeader(buf, 'wrongsecret');
        supertest(server)
          .post(serverConf.webhookReceiverUri)
          .set(CONSTANTS.WEBHOOK_HEADER, badSignature)
          .send(body)
          .expect(403)
          .end(err => err ? done.fail(err) : done());
      });
      
      it('should support standalone webhook receiver', done => {
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

      
      it('should support webhook client', done => {
        const sender = spyOn(webhookUtil, 'messageToBotWithProperties').and.callFake((...args) => {
          const url = args[0];
          const callback = args[args.length - 1];
          callback(url ? null : new Error('foo'));
        });

        const cb = { sent: null, received: null, error: null, };
        Object.keys(cb)
          .forEach(key => spyOn(cb, key))

        const webhook = new WebhookClient({
          channel: {
            url: 'https://foo.bar',
            secret: serverConf.webhookSecret,
          }
        });

        webhook.on(WebhookEvent.ERROR, cb.error);
        webhook.on(WebhookEvent.MESSAGE_SENT, cb.sent);
        webhook.on(WebhookEvent.MESSAGE_RECEIVED, cb.received);

        webhook.send(null) // invoke with empty message
          .then(() => expect(sender).not.toHaveBeenCalled())
          .then(() => webhook.send({ // invoke with message
            userId: 1234,
            messagePayload: {text: 'hello'},
          }).then(() => {
            expect(sender).toHaveBeenCalled();
            expect(cb.sent).toHaveBeenCalled();
          }))
          .then(() => webhook.send(true, {}).catch(e => { // send to invoke spy error
            expect(e).toBeDefined();
            expect(cb.error).toHaveBeenCalled();
          }))
          .then(done).catch(done.fail);

      });

      // it('should handle webhook client errors', done => {
      //   spyOn(serverConf, 'stubWebhookClientHandler').and.callFake(() => {
      //     return () => {throw new Error('Foo Bar')}
      //   });
      //   supertest(server)
      //     .post(serverConf.webhookClientUri)
      //     .send({})
      //     .expect(500)
      //     .end(err => err ? done.fail(err) : done());
      // });

      it('should throw for invalid event subscriptions', () => {
        const webhook = new WebhookClient();
        expect(webhook.on.bind(webhook, 'foo')).toThrow();
      });
      

    });

  });
});
