"use strict";

const OracleBot = require("../main");
const CONF = require("../support/spec.config");

describe('Webhook Utilities', () => {
  it('should attempt to send message to bot', (done) => {
    OracleBot.Util.Webhook.messageToBotWithProperties(
        '/invalid', 
        CONF.webhookSecret,
        '12345',
        'Hello?',
        {firstName: 'John'},
        function(err, response, body) {
            expect(err).not.toBeNull();
            done();
        }
    )
  });
});
