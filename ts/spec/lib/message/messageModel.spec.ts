import { MessageModel, Util } from '../../main';

describe('MessageModel', () => {

  describe('CardMessageConversionToText', () => {

    it('Simple Text', function () {
      const cardContents = [
        { title: 'HAWAIIAN CHICKEN', description: 'grilled chicken, ham, pineapple and green bell peppers' },
        { title: 'PEPPERONI', description: 'Classic marinara sauce with authentic old-world style pepperoni.' },
        {
          title: 'BACON SPINACH ALFREDO',
          description: 'Garlic Parmesan sauce topped with bacon, mushrooms and roasted spinach with a salted pretzel crust.'
        }
      ];
      const cards = cardContents.map(function (content, index) {
        return MessageModel.cardObject(content.title, content.description);
      });
      const cardMsg = MessageModel.cardConversationMessage('horizontal', cards);
      const convertedCardMsg = Util.MessageModel.convertRespToText(cardMsg);
      // console.log(convertedCardMsg);
      expect(convertedCardMsg.trim()) // tslint:disable-next-line
        .toEqual('You can choose from the following cards for more information: Card HAWAIIAN CHICKEN, Card PEPPERONI, Card BACON SPINACH ALFREDO.');
    });

  });

  describe('TextMessageConversionToText', function () {

    it('Simple Text', function () {
      const textMsg = MessageModel.textConversationMessage('Hello can I help you?');
      const convertedTextMsg = Util.MessageModel.convertRespToText(textMsg);
      expect(convertedTextMsg.trim()).toEqual('Hello can I help you?');
    });

    it('Text with Actions', function () {
      const actionLabels = ['Menu', 'Start over', 'Agent'];
      const actions = actionLabels.map(function (label, index) {
        return MessageModel.postbackActionObject(label, null, { index: index, label: label });
      });
      const textMsg = MessageModel.textConversationMessage('Hello can I help you?', actions);
      const convertedTextMsg = Util.MessageModel.convertRespToText(textMsg);
      // console.log(convertedTextMsg);
      expect(convertedTextMsg.trim()).toEqual('Hello can I help you? You can choose from the following options: Menu, Start over, Agent.');
    });

    it('Text with Global Actions', function () {
      const actionLabels = ['Menu', 'Start over', 'Agent'];
      const actions = actionLabels.map(function (label, index) {
        return MessageModel.postbackActionObject(label, null, { index: index, label: label });
      });
      let textMsg = MessageModel.textConversationMessage('Hello can I help you?');
      textMsg = MessageModel.addGlobalActions(textMsg, actions);
      const convertedTextMsg = Util.MessageModel.convertRespToText(textMsg);
      // console.log(convertedTextMsg);
      expect(convertedTextMsg.trim()).toEqual('Hello can I help you? The following global actions are available: Menu, Start over, Agent.');
    });

  });
  
  describe('createTableFormMessages', function () {
    it('Table message', function () {

      let headings = [];
      headings.push( MessageModel.tableHeaderColumn("First Name"));
      headings.push( MessageModel.tableHeaderColumn("Last Name"));
      headings.push( MessageModel.tableHeaderColumn("Phone", 30, "right"));
  
      let people = getPeople();
      let rows = [];
      for (let p of people) {
        let columns = [];
        columns.push(MessageModel.tableColumn(p.firstName));
        columns.push(MessageModel.tableColumn(p.lastName));
        columns.push(MessageModel.tableColumn(p.phone));
        rows.push(MessageModel.tableRow(columns));
      }
      let message = MessageModel.tableConversationMessage(headings, rows);  
      let messageModel = new MessageModel(message);
      expect(messageModel.isValid()).toBeTruthy();
      if (!messageModel.isValid()) {
        console.log('message model validation error:', messageModel.validationError());
      } 
      expect(message.headings.length).toEqual(3);
      expect(message.rows.length).toEqual(5);
    });

    it('Table-Form message', function () {

      let headings = [];
      headings.push( MessageModel.tableHeaderColumn("First Name"));
      headings.push( MessageModel.tableHeaderColumn("Last Name"));
  
      let people = getPeople();
      let rows = [];
      let forms = [];
      for (let p of people) {
        // create row
        let columns = [];
        columns.push(MessageModel.tableColumn(p.firstName));
        columns.push(MessageModel.tableColumn(p.lastName));
        rows.push(MessageModel.tableRow(columns));
        // create form
        let fields = [];
        fields.push(MessageModel.formField("Title", p.title));
        fields.push(MessageModel.formField("Phone", p.phone));
        fields.push(MessageModel.formField("LinkedIn", p.linkedin, "link", "LinkedIn"));
        forms.push(MessageModel.form(fields, p.firstName + " " + p.lastName));
      }
      let message = MessageModel.tableFormConversationMessage(headings, rows, forms, 2, "View details");  
      let messageModel = new MessageModel(message);
      expect(messageModel.isValid()).toBeTruthy();
      if (!messageModel.isValid()) {
        console.log('message model validation error:', messageModel.validationError());
      } 
      expect(message.headings.length).toEqual(2); 
      expect(message.rows.length).toEqual(5);
      expect(message.forms.length).toEqual(5);
      expect(message.rows[0].fields.length).toEqual(2);
      expect(message.forms[0].fields.length).toEqual(3);
      expect(message.forms[0].title).toEqual("John Doe");
    });

    it('Form message', function () {
  
      let people = getPeople();
      let forms = [];
      for (let p of people) {
        // create form
        let fields = [];
        fields.push(MessageModel.formField("Title", p.title));
        fields.push(MessageModel.formField("Phone", p.phone));
        fields.push(MessageModel.formField("LinkedIn", p.linkedin, "link", "LinkedIn"));
        forms.push(MessageModel.form(fields, p.firstName + " " + p.lastName));
      }
      let message = MessageModel.formConversationMessage(forms, 2);  
      let messageModel = new MessageModel(message);
      expect(messageModel.isValid()).toBeTruthy();
      if (!messageModel.isValid()) {
        console.log('message model validation error:', messageModel.validationError());
      } 
      expect(message.forms.length).toEqual(5);
      expect(message.forms[0].fields.length).toEqual(3);
      expect(message.forms[0].title).toEqual("John Doe");
    });

  });

  
});

function getPeople() {
  return [
    {
      "firstName": "John",
      "lastName": "Doe",
      "title": "Demo Builder God",
      "linkedin": "https://www.linkedin.org/in/johndoe",
      "phone": "1122334455"
    },
    {
      "firstName": "Jane",
      "lastName": "Doe",
      "title": "Multi-lingual Magician",
      "linkedin": "https://www.linkedin.org/in/janedoe",
      "phone": "1122334455"
    },
    {
      "firstName": "Steven",
      "lastName": "King",
      "title": "Flow Builder Fanatic",
      "linkedin": "https://www.linkedin.org/in/stevenking",
      "phone": "1122334455"
    },
    {
      "firstName": "Scott",
      "lastName": "Tiger",
      "title": "Machine Learning Master",
      "linkedin": "https://www.linkedin.org/in/scotttiger",
      "phone": "1122334455"
    },
    {
      "firstName": "Chris",
      "lastName": "Jones",
      "title": "Docker Devil",
      "linkedin": "https://www.linkedin.org/in/chrisjones",
      "phone": "1122334455"
    }
  ];
}




