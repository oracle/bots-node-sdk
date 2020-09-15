'use strict';

const { Lib } = require('../../main');
const { Mock } = require('./mock.payload');
const { MockConversation } = require('../../../testing');
const { CommonProvider } = require('../../../common/provider');
/**
 * migrated unit tests from source sdk.
 */
describe('Component Conversation SDK', () => {
  it('should fail with expected error with empty request', done => {
    try {
      const sdk = new Lib.Conversation({});
      expect(sdk).not.toBeDefined();
      done.fail('sdk did not throw error');
    }
    catch (err) {
      expect(err).toBeDefined();
      done();
    }
  });
  it('should fail with expected error without context', done => {
    try {
      const sdk = new Lib.Conversation(Mock().req.nocontext);
      expect(sdk).not.toBeDefined();
      done.fail('sdk did not throw error');
    }
    catch (err) {
      expect(err).toBeDefined();
      done();
    }
  });
  it('should build instance with no variables', () => {
    const sdk = new Lib.Conversation(Mock().req.novars);
    expect(sdk).not.toBeNull();
    expect(sdk.properties().minAge).toBeDefined();
  });
  it('should handle system variables', () => {
    const sdk = new Lib.Conversation(Mock().req.complete);
    expect(sdk.variable('system.invalidUserInput')).not.toBeDefined();
    sdk.variable('system.invalidUserInput', true);
    expect(sdk.variable('system.invalidUserInput')).toEqual(true);
  });
  it('should read and write to response (variables, action, etc)', () => {
    const sdk = new Lib.Conversation(Mock().req.complete);
    expect(sdk).not.toBeNull();
    expect(sdk.response().modifyContext).toEqual(false);
    expect(sdk.variable('name')).toEqual('Joe');
    expect(sdk.variable('age')).toEqual(100.0);
    expect(sdk.variable('hungry')).toEqual(true);
    expect(sdk.variable('nonexistent')).toBeUndefined(); // non-existent properties return undefined
    expect(sdk.response().modifyContext).toEqual(false); // only reading so far
    expect(sdk.channelType()).toEqual('test');
    const nlpResult = sdk.nlpResult();
    expect(nlpResult.topIntentMatch().intent).toEqual('OrderPizza');
    expect(nlpResult.entityMatches('PizzaType')[0]).toEqual('pepperoni');
    expect(nlpResult.fullEntityMatches('PizzaSize')[0].originalString).toEqual('large');
    expect(nlpResult.fullEntityMatches('PizzaSize')[0].canonicalName).toEqual('Large');
    sdk.variable('name', 'Ken');
    expect(sdk.variable('name')).toEqual('Ken');
    expect(sdk.response().modifyContext).toEqual(true); // wrote to context
    sdk.variable('age', 55.5);
    expect(sdk.variable('age')).toEqual(55.5);
    expect(sdk.response().modifyContext).toEqual(true); // wrote to context
    sdk.variable('hungry', false);
    expect(sdk.variable('hungry')).toEqual(false);
    expect(sdk.response().modifyContext).toEqual(true); // wrote to context
    sdk.action('eatpizza').done(true);
    expect(sdk.response()).toEqual(Mock().res.complete, 'Unexpected response');
  });
  it('should read botId, text, and properties from DE requiest', () => {
    const sdk = new Lib.Conversation(Mock().req.complete);
    const props = sdk.properties();
    expect(sdk.botId()).toEqual('963B57F7-CFE6-439D-BB39-2E342AD4EC92');
    expect(sdk.text()).toEqual('22');
    expect(props).toBeTruthy();
    expect(props.minAge).toEqual(18);
  });

  it('should reuse single logger', () => {
    spyOn(CommonProvider, 'getLogger').and.callThrough();
    const sdk = MockConversation.any();
    expect(sdk.logger()).toBeDefined();
    expect(sdk.logger()).toBeDefined();
    expect(CommonProvider.getLogger).toHaveBeenCalledTimes(1);
  });

  it('should create raw payload', () => {
    const sdk = MockConversation.any();
    var attachment = {
      "type": "image",
      "payload": { "url": "https://www.google.com/finance/getchart?q=ORCL&p=1Y&i=86400"}
    };
    var message = {
      "attachment": attachment
    };
    sdk.reply(message);
    var response = {type: "raw", payload: message};
    expect(sdk.response().messages[0].messagePayload).toEqual(response);
  });


});
