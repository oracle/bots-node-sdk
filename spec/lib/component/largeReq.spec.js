'use strict';

const { Lib } = require("../../main");
const requestObj = require("./largeReq.json");

describe('Component Conversation SDK parsing large request', function() {

  it('misc sdk function checks', () => {
    const sdk = new Lib.Conversation(requestObj);
    expect(sdk).not.toBeNull();
    expect(sdk.userId()).toEqual('c6f92efb64f4bab2ce26c9e3');
    expect(sdk.sessionId()).toEqual('c6f92efb64f4bab2ce26c9e3');
    expect(sdk.text()).toEqual("what's my balance in checking?");
    expect(sdk.postback()).toBeNull();
    expect(sdk.attachment()).toBeNull();
    expect(sdk.location()).toBeNull();
    expect(sdk.keepTurn()._response.keepTurn).toBeTruthy();
    expect(sdk.keepTurn(false)._response.keepTurn).not.toBeTruthy();
    expect(sdk.keepTurn(true)._response.keepTurn).toBeTruthy();
    expect(sdk.transition()._response.transition).toBeTruthy();
    expect(sdk.transition('next')._response.action).toEqual('next');
    expect(sdk.error()._response.error).not.toBeTruthy();
    expect(sdk.error(false)._response.error).not.toBeTruthy();
    expect(sdk.error(true)._response.error).toBeTruthy();
  });

  it('should resolve scope variables, get nlpresult and message rawPayload', () => {
    const sdk = new Lib.Conversation(requestObj);
    expect(sdk.variable('profile.firstName')).toEqual('Noah');
    expect(sdk.variable('system.invalidUserInput')).not.toBeNull();
    expect(sdk.nlpResult()).not.toBeNull();
    expect(sdk.nlpResult("iResult").entityMatches('AccountType')[0]).toEqual('checking');
    expect(sdk.nlpResult("iResult").fullEntityMatches('AccountType')[0].originalString).toEqual('checking');
    expect(sdk.nlpResult("iResult").entityMatches()).toBeTruthy();
    expect(sdk.nlpResult("iResult").topIntentMatch().intent).toEqual('Balances');
    expect(sdk.nlpResult("iResult").query()).toEqual("what's my balance in checking?");
    expect(sdk.rawPayload().name).toEqual('Noah Jabali');
    expect(sdk.request().message.payload.name).toEqual('Noah Jabali');
  });


});
