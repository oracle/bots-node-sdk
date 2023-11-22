import { MessageFactory as MF, TextMessage, Voice, ChannelType, InputStyle, SingleSelectLayoutStyle, MultiSelectLayoutStyle, CardLayout
  , AttachmentType, FieldAlignment, CommandType, StreamState, TextStreamMessage, DisplayType, ActionStyle} from '../../../lib2';
import * as fs from 'fs';
import * as path from 'path';

describe('MessageFactory', () => {

  describe('textMessagePayload', function () {

    it('Text with All Action Types', function () {

      let tm: TextMessage = MF.createTextMessage('my text message')
        .setHeaderText('This is header text')
        .setFooterText('This is footer text')
        .addAction(
          MF.createPostbackAction('MyLabel', { 'action': 'foo' })
          .setVoice(new Voice('voiceiee'))
          .setImageUrl('http://myImageUrl')
          .setSkipAutoNumber(true)
          .addKeyword('word1')
          .addKeyword('word2')
          .setDisplayType(DisplayType.icon)
          .setStyle(ActionStyle.danger)
          .setChannelExtensionProperty(ChannelType.facebook, 'myProp', 'myValue')
          .setChannelExtensionProperty(ChannelType.facebook, 'myProp2', 'myValue2')
          .setChannelExtensionProperty(ChannelType.slack, 'myProp', 'myValue')
        )
        .addAction(
          MF.createCallAction('Call me', '06-123456')
        )
        .addAction(
          MF.createShareAction('Share')
        )
        .addAction(
          MF.createLocationAction('Location')
        )
        .addAction(
          MF.createUrlAction('Oracle', 'http://www.oracle.com')
        )
        .addKeyword(MF.createKeyword({'foo': 'bar'}).addKeyword('word1').addKeyword('word2'))
        .setChannelExtensionProperty(ChannelType.slack, 'slackProp', 'slackValue')

      const file = path.resolve('ts/spec/json/', 'textWithActions.json');
      let expected: string = fs.readFileSync(file, 'utf-8');
      expect(JSON.stringify(tm)).toEqual(JSON.stringify(JSON.parse(expected)));

    });
  });

  describe('textStreamMessagePayload', function () {

    it('Text Stream', function () {

      let tm: TextStreamMessage = MF.createTextStreamMessage('my text chunk', 'aggregate text and my text chunk', '123-456', StreamState.running);
      const file = path.resolve('ts/spec/json/', 'textStream.json');
      let expected: string = fs.readFileSync(file, 'utf-8');
      expect(JSON.stringify(tm)).toEqual(JSON.stringify(JSON.parse(expected)));

    });
  });

  describe('editFormMessage', function () {
    it('edit form with columns', function () {

      const message = MF.createEditFormMessage()
      .setHeaderText('Use the form below to add an A-Team Member')
      .setTitle('A-Team Member')
      .addField(
        MF.createTextInputField('text-field-id', 'TextInputField')
          .setValidationRegularExpression('//[^\\r\\n]*[\\r\\n]')
          .setServerErrorMessage('this is a server error message')
          .setDefaultValue('this is a default value')
          .setMultiLine(true)
          .setMinLength(2)
          .setClientErrorMessage('this is a client error message')
          .setRequired(false)
          .setChannelExtensionProperty(ChannelType.msteams, 'prop1', 'teams')
          .setAutoSubmit(true)
          .setInputStyle(InputStyle.email)
          .setPlaceholder('this is a placeholder')
          .setMaxLength(1024)
      )
      .addField(
        MF.createToggleField('toggle-field-id', 'ToggleField', 'no', 'yes')
          .setServerErrorMessage('this is a server error message')
          .setDefaultValue('yes')
          .setLabelOn('I accept')
          .setPlaceholder('this is a placeholder')
          .setLabelOff('I do not accept')
          .setClientErrorMessage('this is a client error message')
          .setRequired(false)
      )
      .addField(
        MF.createSingleSelectField('single-select-field-id', 'SingleSelectField')
          .setServerErrorMessage('this is a server error message')
          .setDefaultValue('this is a default value')
          .addOption(MF.createSelectFieldOption('option1', 'value1').setImageUrl('http://someImage'))
          .addOption(MF.createSelectFieldOption('option2', 'value2'))
          .addOption(MF.createSelectFieldOption('option3', 'value3'))
          .setLayoutStyle(SingleSelectLayoutStyle.radioGroup)
          .setPlaceholder('this is a placeholder')
          .setClientErrorMessage('this is a client error message')
          .setRequired(false)
      )
      .addField(
        MF.createMultiSelectField('multi-select-field-id', 'MultiSelectField')
          .setServerErrorMessage('this is a server error message')
          .setDefaultValue(['PEPPERONI', 'CHEESE'])
          .addOption(MF.createSelectFieldOption('CHEESE'))
          .addOption(MF.createSelectFieldOption('PEPPERONI'))
          .addOption(MF.createSelectFieldOption('MEAT LOVER'))
          .addOption(MF.createSelectFieldOption('SUPREME'))
          .setLayoutStyle(MultiSelectLayoutStyle.checkboxes)
          .setPlaceholder('this is a placeholder')
          .setClientErrorMessage('this is a client error message')
          .setRequired(false)
      )
      .addField(
        MF.createNumberInputField('number-field-id', 'NumberInputField')
          .setMinValue(-1234.456)
          .setServerErrorMessage('this is a server error message')
          .setDefaultValue(123.1)
          .setMaxValue(345.6789)
          .setPlaceholder('this is a placeholder')
          .setClientErrorMessage('this is a client error message')
          .setRequired(false)
      )
      .addField(
        MF.createDatePickerField('date-field-id', 'DatePickerField')
          .setMinDate('2017-10-10')
          .setServerErrorMessage('this is a server error message')
          .setDefaultValue('2017-10-12')
          .setMaxDate('2017-10-15')
          .setPlaceholder('this is a placeholder')
          .setClientErrorMessage('this is a client error message')
          .setRequired(false)
      )
      .addField(
        MF.createTimePickerField('time-field-id', 'TimePickerField')
          .setMaxTime('17:00')
          .setServerErrorMessage('this is a server error message')
          .setDefaultValue('15:30')
          .setMinTime('09:00')
          .setPlaceholder('this is a placeholder')
          .setClientErrorMessage('this is a client error message')
          .setRequired(false)
      )
      .setFormColumns(2)
      .addAction(
        MF.createSubmitFormAction('Submit', { variables: {}, action: 'done' })
      )

      const file = path.resolve('ts/spec/json/', 'editableForm.json');
      let expected: string = fs.readFileSync(file, 'utf-8');
      expect(JSON.stringify(message)).toEqual(JSON.stringify(JSON.parse(expected)));

    });
  });

  describe('cardsMessage', function () {
    it('cards with actions at all levels', function () {

      const message = MF.createCardMessage()
      .setLayout(CardLayout.horizontal)
      .addCard(
        MF.createCard('CHEESE')
          .setImageUrl('https://www.pizzahut.com/assets/w/tile/thor/Cheese.png')
          .setDescription('Classic marinara sauce topped with whole milk mozzarella cheese.')
          .setId('PizzaCard')
          .addAction(
            MF.createPostbackAction('Order Now', {
                variables: {
                  orderedPizzaImage: 'https://www.pizzahut.com/assets/w/tile/thor/Cheese.png',
                  orderedPizza: 'CHEESE'
                },
                action: 'order'
              })
          )
      )
      .setFooterText('Some text displayed below the cards')
      .addAction(
        MF.createLocationAction('Cards Level')
      )
      .addGlobalAction(
        MF.createLocationAction('Global')
      )

      const file = path.resolve('ts/spec/json/', 'cards.json');
      let expected: string = fs.readFileSync(file, 'utf-8');
      expect(JSON.stringify(message)).toEqual(JSON.stringify(JSON.parse(expected)));

    });
  });

  describe('attachmentMessage', function () {

    it('simple attachment', function () {

      const message = MF.createAttachmentMessage(
        MF.createAttachment(AttachmentType.image, 'http://someUrl')
        .setTitle('Some title')
      );

      const file = path.resolve('ts/spec/json/', 'attachment.json');
      let expected: string = fs.readFileSync(file, 'utf-8');
      expect(JSON.stringify(message)).toEqual(JSON.stringify(JSON.parse(expected)));

    });
  });

  describe('commandMessage', function () {

    it('simple command', function () {

      const message = MF.createCommandMessage(CommandType.repeatLouder)
      .addProperty('bool', true)
      .addProperty('int', 8)
      .addProperty('string', 'foo')
      .addProperty('object', {'aap': 'noot'})

      const file = path.resolve('ts/spec/json/', 'command.json');
      let expected: string = fs.readFileSync(file, 'utf-8');
      expect(JSON.stringify(message)).toEqual(JSON.stringify(JSON.parse(expected)));

    });
  });

  describe('tableFormMessages', function () {

    it('simple table', function () {

      const message = MF.createTableMessage()
      .setHeaderText('A-Team')
      .addHeading(
        MF.createTableHeading('First Name')
          .setWidth(20)
          .setAlignment(FieldAlignment.left)
          .setChannelExtensionProperty(ChannelType.twilio, 'twilprop', 'twilvalue')
      )
      .addHeading(
        MF.createTableHeading('Last Name')
          .setWidth(20)
          .setAlignment(FieldAlignment.left)
      )
      .addHeading(
        MF.createTableHeading('Title')
          .setWidth(35)
          .setAlignment(FieldAlignment.left)
      )
      .addHeading(
        MF.createTableHeading('Phone')
          .setWidth(25)
          .setAlignment(FieldAlignment.right)
      )
      .setPaginationInfo(MF.createPaginationInfo(8, 5, 0)
        .setStatus('Showing 1-5 of 8 items')
      )
      .addRow(
        MF.createRow().addField(
          MF.createTextField(null, 'John')
            .setWidth(20)
            .setAlignment(FieldAlignment.left)
        )
        .addField(
          MF.createTextField('Last Name', 'Doe')
            .setWidth(20)
            .setAlignment(FieldAlignment.left)
        )
        .addField(
          MF.createTextField('Title', 'Demo Builder God')
            .setWidth(35)
            .setAlignment(FieldAlignment.left)
        )
        .addField(
          MF.createTextField('Phone', '12345678')
            .setWidth(25)
            .setAlignment(FieldAlignment.right)
        )
        .setChannelExtensionProperty(ChannelType.twilio, 'rowProp', 'rowValue')
      )

      const file = path.resolve('ts/spec/json/', 'table.json');
      let expected: string = fs.readFileSync(file, 'utf-8');
      expect(JSON.stringify(message)).toEqual(JSON.stringify(JSON.parse(expected)));

    });

    it('simple read-only forms', function () {

      const message = MF.createFormMessage()
      .setHeaderText('A-Team')
      .setFormColumns(2)
      .setPaginationInfo(MF.createPaginationInfo(8, 5, 0)
        .setStatus('Showing 1-5 of 8 items')
      )
      .addForm(
        MF.createReadOnlyForm()
        .addField(
          MF.createTextField('First Name', 'John')
          .setChannelExtensionProperty(ChannelType.twilio, 'twilprop', 'twilvalue')
        )
        .addField(
          MF.createTextField('Last Name', 'Doe')
        )
        .addField(
          MF.createLinkField('Website', 'http://linkedin', 'LinkedIn')
        )
      )

      const file = path.resolve('ts/spec/json/', 'form.json');
      let expected: string = fs.readFileSync(file, 'utf-8');
      expect(JSON.stringify(message)).toEqual(JSON.stringify(JSON.parse(expected)));

    });

    it('simple tableForm', function () {

      const message = MF.createTableFormMessage()
      .setHeaderText('A-Team')
      .addHeading(
        MF.createTableHeading('First Name')
          .setWidth(20)
          .setAlignment(FieldAlignment.left)
          .setChannelExtensionProperty(ChannelType.twilio, 'twilprop', 'twilvalue')
      )
      .addHeading(
        MF.createTableHeading('Last Name')
          .setWidth(20)
          .setAlignment(FieldAlignment.left)
      )
      .addHeading(
        MF.createTableHeading('Title')
          .setWidth(35)
          .setAlignment(FieldAlignment.left)
      )
      .addHeading(
        MF.createTableHeading('Phone')
          .setWidth(25)
          .setAlignment(FieldAlignment.right)
      )
      .setPaginationInfo(MF.createPaginationInfo(8, 5, 0)
        .setStatus('Showing 1-5 of 8 items')
      )
      .addRow(
        MF.createRow().addField(
          MF.createTextField(null, 'John')
            .setWidth(20)
            .setAlignment(FieldAlignment.left)
        )
        .addField(
          MF.createTextField('Last Name', 'Doe')
            .setWidth(20)
            .setAlignment(FieldAlignment.left)
        )
        .addField(
          MF.createTextField('Title', 'Demo Builder God')
            .setWidth(35)
            .setAlignment(FieldAlignment.left)
        )
        .addField(
          MF.createTextField('Phone', '12345678')
            .setWidth(25)
            .setAlignment(FieldAlignment.right)
        )
        .setChannelExtensionProperty(ChannelType.twilio, 'rowProp', 'rowValue')
      )
      .addForm(
        MF.createReadOnlyForm()
        .addField(
          MF.createTextField('First Name', 'John')
          .setChannelExtensionProperty(ChannelType.twilio, 'twilprop', 'twilvalue')
        )
        .addField(
          MF.createTextField('Last Name', 'Doe')
        )
        .addField(
          MF.createLinkField('Website', 'http://linkedin', 'LinkedIn')
        )
      )

      const file = path.resolve('ts/spec/json/', 'tableForm.json');
      let expected: string = fs.readFileSync(file, 'utf-8');
      expect(JSON.stringify(message)).toEqual(JSON.stringify(JSON.parse(expected)));

    });


  });

  describe('rawMessage', function () {

    it('simple raw', function () {
      const message = MF.createRawMessage({"foo": "bar"});
      const file = path.resolve('ts/spec/json/', 'raw.json');
      let expected: string = fs.readFileSync(file, 'utf-8');
      expect(JSON.stringify(message)).toEqual(JSON.stringify(JSON.parse(expected)));

    });
  });

});


