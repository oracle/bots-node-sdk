'use strict';

const OracleBot = require("../main");
const CONF = require("../support/spec.config");

describe("Webhook Utilities", () => {

  it("should attempt to send message to bot", done => {
    OracleBot.Util.Webhook.messageToBotWithProperties(
      "/invalid",
      CONF.webhookSecret,
      "12345",
      "Hello?",
      { firstName: "John" },
      function(err) {
        expect(err).not.toBeNull();
        done();
      }
    );
  });

  it('should validate inputs', done => {

    const cb = { webhook: null };
    const spy = spyOn(cb, 'webhook');

    OracleBot.Util.Webhook.messageToBotWithProperties(null, null, null, null, null, cb.webhook);
    expect(spy.calls.mostRecent().args[0]).toEqual(jasmine.any(Error));
    OracleBot.Util.Webhook.messageToBotWithProperties('/ok', null, null, null, null, cb.webhook);
    expect(spy.calls.mostRecent().args[0]).toEqual(jasmine.any(Error));
    OracleBot.Util.Webhook.messageToBotWithProperties('/ok', 'abc', null, null, null, cb.webhook);
    expect(spy.calls.mostRecent().args[0]).toEqual(jasmine.any(Error));
    expect(spy).toHaveBeenCalledTimes(3);
    done();
  });

  describe('with stub connector', () => {
    let server;
    beforeAll(() => server = require('../support/connector.server'));
    afterAll(done => server.close(done));

    it('should message to bot', done => {
      const url = `http://localhost:${server.address().port}${CONF.connector.postUrl}`;
      OracleBot.Util.Webhook.messageToBotWithProperties(
        url, CONF.webhookSecret, "12345", "Hello?", null, (err) => {
          expect(err).toBeFalsy();
          done();
        }
      );
    });

    it('should follow redirect on post', done => {
      const url = `http://localhost:${server.address().port}${CONF.connector.postRedirect}`;
      OracleBot.Util.Webhook.messageToBotWithProperties(
        url, CONF.webhookSecret, "12345", "Hello?", null, (err) => {
          expect(err).toBeFalsy();
          done();
        }
      );
    });

  });

});
