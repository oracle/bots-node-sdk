import {
  MessageFactory as MF, TextMessage, NonRawMessage, AttachmentMessage, Attachment, Voice, ChannelType, InputStyle, SingleSelectLayoutStyle
  , MultiSelectLayoutStyle, CardLayout, Card, AttachmentType, FieldAlignment, PostbackAction, MessageUtil, ChannelExtensions, CardMessage, 
  LocationAction, TextInputField, TextField, LinkField, EditFormMessage, SingleSelectField, SubmitFormAction, FormMessage, TableMessage
  , TableFormMessage, CommandMessage, CommandType, LocationMessage, PostbackMessage, FormSubmissionMessage, TextStreamMessage, StreamState
  , ColumnWidth, ActionField, VerticalAlignment, Column, FormRow
} from '../../../lib2';
import * as fs from 'fs';
import * as path from 'path';

describe('MessageDeserializer', () => {

  it('Deserialize Text Message', function () {

    const file = path.resolve('ts/spec/json/', 'textWithActions.json');
    let expected: string = fs.readFileSync(file, 'utf-8');

    let msg = MF.messageFromJson(JSON.parse(expected)) as TextMessage;
    expect(msg.getHeaderText()).toEqual('This is header text');
    expect(msg.getActions()[0].getVoice() instanceof Voice).toBeTruthy();
    expect(msg.getActions()[0].getVoice().getText()).toEqual('voiceiee');
    let action: PostbackAction = msg.getActions()[0] as PostbackAction; 
    expect(action.getPostback().action).toEqual('foo');
    expect(action.getKeywords().length).toEqual(2);

    expect(msg.getChannelExtensions() instanceof ChannelExtensions).toBeTruthy();
    expect(msg.getChannelExtensionProperty(ChannelType.slack, 'slackProp')).toEqual('slackValue');
    msg.setChannelExtensionProperty(ChannelType.slack, 'aap', 'noot');
    msg.setChannelExtensionProperty(ChannelType.facebook, 'wim', 'zus');       
    expect(msg.getChannelExtensionProperty(ChannelType.slack, 'aap')).toEqual('noot');
    expect(msg.getChannelExtensionProperty(ChannelType.facebook, 'wim')).toEqual('zus');
    expect(msg.getChannelExtensionProperty(ChannelType.slack, 'slackProp')).toEqual('slackValue');

  });

  it('Deserialize Text Message with Footer Form', function () {

    const file = path.resolve('ts/spec/json/', 'textWithFooterForm.json');
    let expected: string = fs.readFileSync(file, 'utf-8');

    let msg = MF.messageFromJson(JSON.parse(expected)) as TextMessage;
    expect(msg.getFooterForm().getFormRows()[0].getColumns()[0].getWidth() === ColumnWidth.stretch).toBeTrue;
    expect(msg.getFooterForm().getFormRows()[0].getColumns()[0].getFields().length === 4).toBeTrue;

  });

  it('Deserialize Text Stream Message', function () {

    const file = path.resolve('ts/spec/json/', 'textStream.json');
    let expected: string = fs.readFileSync(file, 'utf-8');

    let msg = MF.messageFromJson(JSON.parse(expected)) as TextStreamMessage;
    expect(msg.getText()).toEqual('my text chunk');
    expect(msg.getAggregateText()).toEqual('aggregate text and my text chunk');
    expect(msg.getStreamId()).toEqual('123-456');
    expect(msg.getStreamState()).toEqual(StreamState.running);

  });

  it('Deserialize Attachment', function () {

    const file = path.resolve('ts/spec/json/', 'attachment.json');
    let expected: string = fs.readFileSync(file, 'utf-8');
    let msg = MF.messageFromJson(JSON.parse(expected)) as AttachmentMessage;
    expect(msg.getAttachment() instanceof Attachment).toBeTruthy();
    expect(msg.getAttachment().getType() == AttachmentType.image).toBeTruthy();

  });

  it('Deserialize Cards', function () {

    const file = path.resolve('ts/spec/json/', 'cards.json');
    let expected: string = fs.readFileSync(file, 'utf-8');
    let msg = MF.messageFromJson(JSON.parse(expected)) as CardMessage;
    expect(msg.getCards()[0] instanceof Card).toBeTruthy();
    expect(msg.getCards()[0].getId()).toEqual('PizzaCard');
    expect(msg.getCards()[0].getActions()[0] instanceof PostbackAction).toBeTruthy;
    expect(msg.getGlobalActions()[0] instanceof LocationAction).toBeTruthy;

  });

  it('Deserialize EditableForm', function () {

    const file = path.resolve('ts/spec/json/', 'editableForm.json');
    let expected: string = fs.readFileSync(file, 'utf-8');
    let msg = MF.messageFromJson(JSON.parse(expected)) as EditFormMessage;
    let field1 = msg.getFields()[0] as TextInputField;
    expect(field1.getMultiLine).toBeTrue;
    expect(field1.getChannelExtensionProperty(ChannelType.msteams, 'prop1')).toEqual('teams');
    let field3 = msg.getFields()[2] as SingleSelectField;
    expect(field3.getOptions()[0].getLabel()).toEqual('option1');
    let action1 = msg.getActions()[0] as SubmitFormAction;
    expect(action1.getPostback()['action']).toEqual('done');

  });

  it('Deserialize EditableForm with FormRows', function () {

    const file = path.resolve('ts/spec/json/', 'editableForm2.json');
    let expected: string = fs.readFileSync(file, 'utf-8');    
    let msg = MF.messageFromJson(JSON.parse(expected)) as EditFormMessage;
    let row1 = msg.getFormRows()[0];
    expect(row1.getId()).toEqual('formRow0')
    let col1: Column = row1.getColumns()[0];
    expect(col1.getWidth() == ColumnWidth.stretch).toBeTrue;
    expect(col1.getVerticalAlignment() == VerticalAlignment.center).toBeTrue;
    let textField = col1.getFields()[8] as TextField;
    expect(textField.getTruncateAt() == 5).toBeTrue;
    let actionField = col1.getFields()[9] as ActionField;
    expect(actionField.getAction().getLabel()).toEqual('Submit');

  });

  it('Deserialize Form', function () {

    const file = path.resolve('ts/spec/json/', 'form.json');
    let expected: string = fs.readFileSync(file, 'utf-8');
    let msg = MF.messageFromJson(JSON.parse(expected)) as FormMessage;
    expect(msg.getPaginationInfo()!.getStatus()).toEqual('Showing 1-5 of 8 items');    
    let form1 = msg.getForms()[0];
    let field1 = form1.getFields()[0] as TextField;
    expect(field1.getChannelExtensionProperty(ChannelType.twilio, 'twilprop')).toEqual('twilvalue');
    let field3 = form1.getFields()[2] as LinkField;
    expect(field3.getLinkLabel()).toEqual('LinkedIn');

  });

  it('Deserialize Table', function () {

    const file = path.resolve('ts/spec/json/', 'table.json');
    let expected: string = fs.readFileSync(file, 'utf-8');
    let msg = MF.messageFromJson(JSON.parse(expected)) as TableMessage;
    expect(msg.getPaginationInfo()!.getStatus()).toEqual('Showing 1-5 of 8 items');    
    let heading1 = msg.getHeadings()[0];
    expect(heading1.getChannelExtensionProperty(ChannelType.twilio, 'twilprop')).toEqual('twilvalue');
    expect(msg.getRows()[0].getFields()[0] instanceof TextField).toBeTrue;
    expect(msg.getRows()[0].getChannelExtensionProperty(ChannelType.twilio, 'rowProp')).toEqual('rowValue');
    expect(msg.getPaginationInfo()!.getTotalCount()).toEqual(8);

  });

  it('Deserialize TableForm', function () {

    const file = path.resolve('ts/spec/json/', 'tableForm.json');
    let expected: string = fs.readFileSync(file, 'utf-8');
    let msg = MF.messageFromJson(JSON.parse(expected)) as TableFormMessage;
    expect(msg.getPaginationInfo().getStatus()).toEqual('Showing 1-5 of 8 items');    
    let heading1 = msg.getHeadings()[0];
    expect(heading1.getChannelExtensionProperty(ChannelType.twilio, 'twilprop')).toEqual('twilvalue');
    expect(msg.getRows()[0].getFields()[0] instanceof TextField).toBeTrue;
    expect(msg.getPaginationInfo().getTotalCount()).toEqual(8);
    let form1 = msg.getForms()[0];
    let field1 = form1.getFields()[0] as TextField;
    expect(field1.getChannelExtensionProperty(ChannelType.twilio, 'twilprop')).toEqual('twilvalue');
    let field3 = form1.getFields()[2] as LinkField;
    expect(field3.getLinkLabel()).toEqual('LinkedIn');
    expect(msg.getRows()[0].getFields()[0] instanceof TextField).toBeTrue;
    expect(msg.getRows()[0].getChannelExtensionProperty(ChannelType.twilio, 'rowProp')).toEqual('rowValue');

  });

  it('Deserialize Command', function () {

    const file = path.resolve('ts/spec/json/', 'command.json');
    let expected: string = fs.readFileSync(file, 'utf-8');
    let msg = MF.messageFromJson(JSON.parse(expected)) as CommandMessage;
    expect(msg.getCommand()).toEqual(CommandType.repeatLouder);  
    expect(msg.getPropertyValue('bool')).toBeTrue;
    expect(msg.getPropertyValue('int')).toEqual(8);
    expect(msg.getPropertyValue('string')).toEqual('foo');
    expect(msg.getPropertyValue('object')).toEqual({'aap': 'noot'});        

  });

  it('Deserialize Location', function () {

    const file = path.resolve('ts/spec/json/', 'location.json');
    let expected: string = fs.readFileSync(file, 'utf-8');
    let msg = MF.messageFromJson(JSON.parse(expected)) as LocationMessage;
    expect(msg.getLocation().getTitle()).toEqual('Some title');  
    expect(msg.getLocation().getLatitude()).toEqual(23.5678);  

  });

  it('Deserialize Postback', function () {

    const file = path.resolve('ts/spec/json/', 'postback.json');
    let expected: string = fs.readFileSync(file, 'utf-8');
    let msg = MF.messageFromJson(JSON.parse(expected)) as PostbackMessage;
    expect(msg.getPostback()).toEqual({'action': 'foo'});  

  });

  it('Deserialize FormSubmission', function () {

    const file = path.resolve('ts/spec/json/', 'formSubmission.json');
    let expected: string = fs.readFileSync(file, 'utf-8');
    let msg = MF.messageFromJson(JSON.parse(expected)) as FormSubmissionMessage;
    expect(msg.getPostback()).toEqual({'action': 'done'});  
    expect(msg.getSubmittedFields()['aap']).toEqual('noot');  
    expect(msg.getSubmittedField('aap')).toEqual('noot');  
    expect(msg.getSubmittedFields()['wim']).toEqual(['jet','does']);  
    expect(msg.getSubmittedField('wim')).toEqual(['jet','does']);  

  });

});


