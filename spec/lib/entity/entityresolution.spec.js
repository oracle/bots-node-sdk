const { EntityResolutionContext } = require('../../../lib/entity/entityResolutionContext');
const { Mock } = require('./mock.request');


describe('EntityResolutionContext', () => {
  // add specs for testing this file, constructor, etc.

  it('should init context...', () => {
    const context = new EntityResolutionContext(Mock().req.complete);
    expect(context._systemEntityDisplayProperties['DURATION'].properties).toEqual(['startDate','endDate']);
  });

  it('should get/set entity...', () => {
    const context = new EntityResolutionContext(Mock().req.complete);
    expect(context.getEntity()).toBeNull();
    expect(context.getVariable("expense")).toBeNull();
    context.setEntity({"Type":"Taxi","entityName":"Expense"});
    expect(context.getEntity()).toEqual({"entityName":"Expense","Type":"Taxi"});
    expect(context.getVariable("expense")).toEqual({"entityName":"Expense","Type":"Taxi"});

  });

  it('should get entity items...', () => {
    const context = new EntityResolutionContext(Mock().req.complete);
    expect(context.getEntityItems().length).toEqual(8);    
  });

  it('should get/set/clear entity item...', () => {
    const context = new EntityResolutionContext(Mock().req.complete);
    expect(context.getVariable("expense")).toBeNull();
    context.setItemValue('Type','Taxi');
    expect(context.getVariable("expense")).toEqual({"entityName":"Expense","Type":"Taxi"});
    expect(context.getEntity()).toEqual({"entityName":"Expense","Type":"Taxi"});
    expect(context.getItemValue('Type')).toEqual("Taxi");
    context.clearItemValue("Type");
    expect(context.getEntity()).toEqual({"entityName":"Expense"});
    expect(context.getItemValue('Type')).toBeUndefined();
  });

  it('should get/add validation errors...', () => {
    const context = new EntityResolutionContext(Mock().req.complete);
    expect(context.getValidationErrors()).toBeDefined();    
    expect(context.getValidationErrors()['Type']).toEqual('Meal is not allowed for you');    
    context.addValidationError("Type","Some new error");
    expect(context.getValidationErrors()['Type']).toEqual('Some new error');    
  });

  it('should get/clear disambiguation values...', () => {
    const context = new EntityResolutionContext(Mock().req.complete);
    expect(context.getDisambiguationValues('Type')).toEqual(['Taxi','Flight']);
    context.clearDisambiguationValues('Type');
    expect(context.getDisambiguationValues('Type')).toEqual([]);
  });

  it('should skip/unskip item...', () => {
    const context = new EntityResolutionContext(Mock().req.complete);
    expect(context.getCurrentItem()).toEqual("Type");
    expect(context.isSkippedItem('Type')).toBeFalsy();
    context.skipItem('Type');
    expect(context.isSkippedItem('Type')).toBeTruthy();
    expect(context.getCurrentItem()).toBeUndefined();
    context.unskipItem('Type');
    expect(context.isSkippedItem('Type')).toBeFalsy();
  });

  it('should get/add (candidate) messages...', () => {
    const context = new EntityResolutionContext(Mock().req.complete);
    expect(context.getCandidateMessages()[0]["text"]).toEqual("What is the expense type?");
    context.addCandidateMessages();
    context.addMessage('New simple text message');
    let MessageModel = context.getMessageModel();
    let yes = MessageModel.postbackActionObject("Yes",null,{"event" : {"name":"removeReceipt"}});
    let no = MessageModel.postbackActionObject("No",null,{});
    let message = MessageModel.textConversationMessage("CMM message",[yes,no] );
    context.addMessage(new MessageModel(message));
    expect(context.getMessages()[0].text).toEqual("What is the expense type?");
    expect(context.getMessages()[1].text).toEqual("New simple text message");
    expect(context.getMessages()[2].text).toEqual("CMM message");
    expect(context.getMessages()[2].actions[0].label).toEqual("Yes");
    context.getMessages()[2].actions[1].label = "May Be";
    expect(context.getMessages()[2].actions[1].label).toEqual("May Be");    
  });

  it('should get matched/updated/outoforder items...', () => {
    const context = new EntityResolutionContext(Mock().req.complete);
    expect(context.getItemsUpdated()).toEqual(["Type"]);
    expect(context.getItemsMatchedOutOfOrder()).toEqual(["Amount"]);
    expect(context.getItemsMatched()).toEqual(["Date"]);
  });

  it('should handle display values...', () => {
    const context = new EntityResolutionContext(Mock().req.complete);
    context.setItemValue("Type","Taxi");
    context.setItemValue("Date",{"entityName": "DATE", "date": 1185753600000,"originalString": "30 july 2007"});
    context.setItemValue("Amount",{"entityName": "CURRENCY", "amount": 54.5,"currency":"chf","totalCurrency": "CHF 54.50"});
    let displayDate = new Date(1185753600000).toDateString();
    expect(context.getDisplayValue("Date")).toEqual(displayDate);
    expect(context.getDisplayValues()).toEqual([{name:"Type", value: "Taxi"},{name:"Amount", value: "54.5 chf"},{name:"Date", value: displayDate}]);                                           
    context.setSystemEntityDisplayProperties('DATE',['originalString']);
    context.setSystemEntityDisplayFunction('DATE',(date => date));
    expect(context.getDisplayValue("Date")).toEqual("30 july 2007");
  });

  it('should get/set custom properties...', () => {
    const context = new EntityResolutionContext(Mock().req.complete);
    context.setCustomProperty("MyProp","MyValue");
    expect(context.getCustomProperty("MyProp")).toEqual("MyValue");
    context.setCustomProperty("MyProp",null);
    expect(context.getCustomProperty("MyProp")).toBeUndefined();
  });

});

