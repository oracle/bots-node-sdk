# Conversation Messaging 

## Table of contents
- [Introduction](#introduction)
    - [Outbound Message Types](#outbound)
    - [Inbound Message Types](#inbound)
- [Using the SDK Message Factory](#messageFactory)
    - [Channel Extensions](#extensions)
    - [Using Postback Keywords](#keywords)
- [Code Samples](#samples)
    - [Creating a Text Message with Action Buttons](#textMessage)
    - [Creating a Card Message with Card Action Buttons](#cardMessage)
    - [Creating an Attachment Message](#attachmentMessage)
    - [Creating a Table Message](#tableMessage)
    - [Creating a Form Message](#formMessage)
    - [Creating a TableForm Message](#tableFormMessage)
    - [Creating an EditForm Message](#editFormMessage)
    - [Processing the Last User Message](#userMessage)
    - [Creating a Microsoft Adaptive Cards Message](#adaptiveCardMessage)

## Introduction <a name="introduction">
Oracle Digital Assitant uses the conversation message model (CMM) to exchange messages between a skill or DA and the various channels. CMM defines the various message types that the skill can send to the user (outbound), and the user can send to the skill (inbound). 

### Outbound Message Types <a name="outbound">
In custom components and event handlers, you can create and modify the following **outbound** message types:

- **TexMessaget**: A text message
- **CardMessage**: A card message that contains a title and, optionally, a description, image, a link, and a list of actions.
- **AttachmentMessage**: A message with a media URL (file, image, video, or audio)
- **TableMessage**: A message with a table layout, with a table header, rows and read-only fields within the rows.
- **FormMessage**: A message with a form layout, with one or more forms, each form containing a list of read-only fields, and optionally a list of actions.
- **TableFormMessage**: A message with a table-form layout, with a table header, rows and read-only fields within the rows. Each row can be expanded to show an inline form that discloses additional read-only fields, and optionally a list of actions.
- **EditFormMesssage**: A message containing an editable form, with a list of editable or read-only fields.

All the above outbound messages support a standard set of properties:
- **headerText**: a text that appears at the top of the message
- **footerText**: a text that appears at the bottom of the message, below the actions but above the global actions.
- **actions**: a list of action buttons rendered directly below the message text, cards, attachment, table or forms.
- **globalActions**: a list of global actions that typically aren't directly related to the actual message, usually displayed as buttons at the bottom of the chat window.

CMM supports the following action types for `actions` and `globalActions`:
- **PostbackAction**: Sends the payload of the action back to the Oracle Digital Assistant dialog engine
- **ShareAction**: Opens a share dialog in facebook messenger client, enabling people to share message bubbles with friends
- **CallAction**: Calls the phone number specified in the payload
- **UrlAction**: Opens in the in-app browser the URL specified in the payload
- **LocationAction**: Sends the geo coordinates (latitude and longitude) of the current location
- **SubmitFormAction**: Submits the form values of an editable form back to ODA

CMM supports the following read-only field types in `Form`, `TableForm`, `Table` and `EditForm` messages:
- **Text**: A text field with a label and a value.
- **Link**: A hyperlink field with a label, a value (containing the URL) and optionally a link label.

CMM supports the following editable field types in `EditForm` messages:
- **TextInput**: A field for text input.
- **NumberInput**: A field for numeric input.
- **DatePicker**: A field for date input that includes a date picker widget (if supported by the channel).
- **TimePicker**: A field for time input that includes a time picker widget (if supported by the channel).
- **Toggle**: A toggle field to allow the user to toggle between an `on` and an `off` value.
- **SingleSelect**: A field that allows a single selection from a list of options. Can be rendered as a drop down list or radio group (if supported by the channel)
- **MultiSelect**: A field that allows for multiple selection from a list of options. Can be rendered as a multi-select list or set of checkboxes (if supported by the channel)

### Inbound Message Types <a name="inbound">
The following **inbound** message types sent by the user can be inspected:
- **TextMessage**: A text message
- **LocationMessage**: A message with geo-location coordinates
- **PostbackMessage**: A message with a postback payload, sent when the user activated a `postback` action button.
- **AttachmentMessage**: A message with a multi-media attachment (file, image, video, or audio)
- **FormSubmissionMessage**: A message containing the submitted field values when the user clicks on a `submitForm` action in an `editForm` message, or when the user auto-submitted a field value.

Messages that are defined in CMM format are channel-agnostic. You create them once using the CMM syntax. The channel-specific connectors transform the CMM message into the format required by the specific client channel, allowing you to run your skill on multiple channels without the need to create separate message formats for each channel. 

Note that not all message types and action types are supported on all channels. See [Comparison of Channel Message Constraints](https://www.oracle.com/pls/topic/lookup?ctx=en/cloud/paas/digital-assistant&id=DACUA-GUID-6E33549A-086C-4F22-894A-42B47C0CD53A) in *Using Oracle Digital Assistant* for more info.

There might be specific use cases where you want to leverage channel-specific message capabilities that aren't supported by CMM. To implement those use cases, you can use [channel extensions](#extensions) or send a `raw` message, which includes the channel-specific message payload that channel connectors will just pass on to the chat client 'as is' without doing any transformations.

All built-in components create skill messages in CMM format, and the [System.CommonResponse](https://www.oracle.com/pls/topic/lookup?ctx=en/cloud/paas/digital-assistant&id=DACUA-GUID-11BB6EBF-EA29-404E-B966-C3DC70D3625C) component provides full support for all CMM message types.
We recommend that you consider using the `System.CommonResponse` component before you decide to create conversation messages in custom components. It's generally easier to prepare the data in a custom component by calling some backend service, and then store the data in context variables. You can then transition to a dialog flow state that uses the `System.CommonResponse` component to create the bot messages in CMM format, using and/or iterating over the data that's been stored in context variables by the custom component. The `System.CommonResponse` component contains extensive functionality to process user input, including submitted forms, and also includes out-of-the-box support for pagination, which might be useful if you want to enable the user to scroll through large sets of data. 

## Using the SDK Message Factory <a name="messageFactory">

The SDK provides the [MessageFactory](https://oracle.github.io/bots-node-sdk/MessageFactory.html) class to create the message types supported by CMM. You can use `context.getMessageFactory()` to access the the `MessageFactory` from within a custom component's `invoke` method or from with an entity event handler's event method. In addition, you can use the MessageFactory independently as shown here:

```javascript
const { MessageFactory } = require('@oracle/bots-node-sdk/typings/lib2');
```

The `MessageFactory` class provides static factory methods to create each message type, as well as methods to create message sub-elements like actions, cards, rows, table headings and fields. The CMM class instances returned by the factory methods use the builder pattern, so you can easily chain multiple `setXXX` or `addXXX` methods to create a (nested) message element in a single statement.

### Channel Extensions <a name="extensions">

You can use channel extensions to leverage channel-specific features that aren't included in the CMM without having to create a `raw conversation message` for that channel. Channel extensions can be set using the `setChannelExtensionProperty` method.
For example, you can use channel extensions to do the following:

- Create a card message and change the appearance of the first card on Facebook:
```javascript
const mf = context.getMessageFactory();
const cardMessage = mf.createCardMessage()
  .setLayout(CardLayout.horizontal)
  .addCard(mf.createCard('First Card Title')
             .setDescription('First Card Description'))
  .setChannelExtensionProperty(ChannelType.facebook, 'top_element_style', 'large');          
```

- Create a text message to prompt for a date and configure Slack to display a date picker:
```javascript
// import ChannelType
const { ChannelType } = require('@oracle/bots-node-sdk/typings/lib2');

const mf = context.getMessageFactory();
const textMessage = mf.createTextMessage('What is the expense date')
  .setChannelExtensionProperty(ChannelType.slack, 'showDatePicker', true);
```

For a complete list of all extension properties for each channel, see [Channel-Specific Extensions](https://www.oracle.com/pls/topic/lookup?ctx=en/cloud/paas/digital-assistant&id=DACUA-GUID-E73235B7-1C26-47D5-BFF2-58D65A44E0EB) in *Using Oracle Digital Assistant*.

### Using Postback Keywords <a name="keywords">

Using keywords, you can map a user's simple text entry to a postback payload. This is useful for channels that don't support buttons, like Twilio/SMS. For example, you can number the pizza sizes a user can choose from and then create a numeric postback keyword for each size. This allows the user to enter just the number, and Digital Assistant converts that to a postback message payload that contains the actual pizza size, which you can then process in your custom component. You create a keyword entry using the static [`createKeyword`](https://oracle.github.io/bots-node-sdk/MessageFactory.html#.createKeyword) method:
```javascript
const mf = context.getMessageFactory();
const message = mf.createTextMessage('What pizza size do you want?\n1. Small\n2. Medium\n3. Large')
  .addKeyword(mf.createKeyword({"variables" : {"pizzaSize": "small"}},["1","first"]))
  .addKeyword(mf.createKeyword({"variables" : {"pizzaSize": "medium"}},["2","medium"]))
  .addKeyword(mf.createKeyword({"variables" : {"pizzaSize": "large"}},["3","large"]))      
context.reply(message);
```

## Code Samples <a name="samples">

All of the following examples create a CMM message type. In a custom component, you use `context.reply(message)` to send the created message.
In an entity event handler, you use `context.addMessage(message)`.

### Creating a Text Message with Action Buttons <a name="textMessage">

To create a text message with actions buttons, first use the [`createTextMessage`](https://oracle.github.io/bots-node-sdk/MessageFactory.html#.createTextMessage) method to create the message, and then use the `addAction` and  [`createPostbackAction`](https://oracle.github.io/bots-node-sdk/MessageFactory.html#.createPostbackAction) methods to add the button actions.

```javascript
const mf = context.getMessageFactory();
const message = mf.createTextMessage('Do you want another quote?')
  .addAction(mf.createPostbackAction('Yes', { isNo: false }))
  .addAction(mf.createPostbackAction('No', { isNo: true }));
```

### Creating a Card Message with Card Action Buttons <a name="cardMessage">

To create a card message with card actions buttons, first use the [`createCardMessage`](https://oracle.github.io/bots-node-sdk/MessageFactory.html#.createCardMessage) method to create the card message, then use the `addCard` and [`createCard`](https://oracle.github.io/bots-node-sdk/MessageFactory.html#.createCard) methods to create each card, and, finally, use the `addAction` and [`createPostbackAction`](https://oracle.github.io/bots-node-sdk/MessageFactory.html#.createPostbackAction) method to add a button action to each card.

```javascript
// import CardLayout
const { CardLayout } = require('@oracle/bots-node-sdk/typings/lib2');

const mf = context.getMessageFactory();
const message = mf.createCardMessage()
  .setLayout(CardLayout.vertical)
  .addCard(mf.createCard('4 Dozen Oranges')
    .setDescription('4 dozen Mandarin oranges in a wooden crate.')
    .addAction(mf.createPostbackAction('Oranges', { action: 'oranges' })))
  .addCard(mf.createCard('Carton of Grapes')
    .setDescription('10kg ripe grapes in a protected carton.')
    .addAction(mf.createPostbackAction('Grapes', { action: 'grapes' })));
```

### Creating an Attachment Message <a name="attachmentMessage">

You use the [`createAttachmentMessage`](https://oracle.github.io/bots-node-sdk/MessageFactory.html#.createAttachmentMessage) method to create an attachment message.

```javascript
// import AttachmentType
const { AttachmentType } = require('@oracle/bots-node-sdk/typings/lib2');

const mf = context.getMessageFactory();
const message = mf.createAttachmentMessage(
  mf.createAttachment(AttachmentType.image, 'https://1000logos.net/wp-content/uploads/2017/04/Oracle-Logo.png'));
```

The attachment type can be `image`, `video`, `audio`, or `file`.
You can display action URLs under the attachment, such as links to more videos and tutorials as shown here:

```javascript
const message = mf.createAttachmentMessage(
  mf.createAttachment(AttachmentType.image, 'https://1000logos.net/wp-content/uploads/2017/04/Oracle-Logo.png'))
  .addAction(mf.createUrlAction('More Videos','https://example.com/videos.html'))
  .addAction(mf.createUrlAction('More Tutorials','https://example.com/tutorials.html'));
```

### Creating a Table Message <a name="tableMessage">

You use the [`createTableMessage`](https://oracle.github.io/bots-node-sdk/MessageFactory.html#.createTableMessage) method to create a message with table layout.

To create the nested table message elements, you can use the following methods:
- `addHeading` and [`createTableHeading`](https://oracle.github.io/bots-node-sdk/MessageFactory.html#.createTableHeading) methods to create the table headings.
- `setRows` and [`createRow`](https://oracle.github.io/bots-node-sdk/MessageFactory.html#.createRow) methods to create the table rows.
- `addField` and [`createTextField`](https://oracle.github.io/bots-node-sdk/MessageFactory.html#.createTextField) methods to create the columns in each row, with each column containing a text field.
- `setPaginationInfo` and [`createPaginationInfo`](https://oracle.github.io/bots-node-sdk/MessageFactory.html#.createPaginationInfo) method to create the optional paginationInfo. Note that adding this info is only used to display a pagination status message, you must implement the actual pagination yourself.

```javascript
const people = [{ firstName: "Bob", lastName: "Dole" }
  , { firstName: "John", lastName: "Doe" }
  , { firstName: "Jane", lastName: "Doe" }];

const mf = context.getMessageFactory();
const message = mf.createTableMessage()
  .addHeading(mf.createTableHeading('First Name'))
  .addHeading(mf.createTableHeading('Last Name'))
  .setRows(people.map(person => mf.createRow()
    .addField(mf.createTextField(null, person.firstName))
    .addField(mf.createTextField(null, person.lastName))))
  .setPaginationInfo(
    mf.createPaginationInfo(5, 3, 0)
      .setStatus(context.translate('systemConfiguration_paginationStatus', 1, 3, 5)));
```

### Creating a Form Message <a name="FormMessage">

You use the [`createFormMessage`](https://oracle.github.io/bots-node-sdk/MessageFactory.html#.createFormMessage) method to create a message with form layout.

To create the nested form message elements, you can use the following methods:
- `setForms` and [`createReadOnlyForm`](https://oracle.github.io/bots-node-sdk/MessageFactory.html#.createReadOnlyForm) methods to create the forms.
- `addField` and [`createTextField`](https://oracle.github.io/bots-node-sdk/MessageFactory.html#.createTextField) methods to create the fields in each form.
- `setPaginationInfo` and [`createPaginationInfo`](https://oracle.github.io/bots-node-sdk/MessageFactory.html#.createPaginationInfo) method to create the optional paginationInfo. Note that adding this info is only used to display a pagination status message, you must implement the actual pagination yourself.

```javascript
const people = [{ firstName: "Bob", lastName: "Dole" }
  , { firstName: "John", lastName: "Doe" }
  , { firstName: "Jane", lastName: "Doe" }];

const mf = context.getMessageFactory();
const message = mf.createFormMessage()
  .setForms(people.map(person => mf.createReadOnlyForm()
    .addField(mf.createTextField('First Name', person.firstName))
    .addField(mf.createTextField('Last Name', person.lastName))))
  .setFormColumns(2)
  .setPaginationInfo(
    mf.createPaginationInfo(5, 3, 1)
      .setStatus(context.translate('systemConfiguration_paginationStatus', 1, 3, 5)));
```

### Creating a TableForm Message <a name="tableFormMessage">

You use the [`createTableFormMessage`](https://oracle.github.io/bots-node-sdk/MessageFactory.html#.createTableFormMessage) method to create a message with table-form layout. In a table-form layout, each row can be expanded to show an inline form that discloses additional read-only fields, and optionally a list of actions.

The methods used to created the nested message elements, are the same as in the previous samples for table and form layouts.

```javascript
const people = [{ firstName: "Bob", lastName: "Dole", jobTitle: "Salesman", phoneNumber: '11223344' }
  , { firstName: "John", lastName: "Doe", jobTitle: "Clerk", phoneNumber: '11223345' }
  , { firstName: "Jane", lastName: "Doe", jobTitle: "President", phoneNumber: '11223346' }]

const mf = context.getMessageFactory();
const message = mf.createTableFormMessage()
  .addHeading(mf.createTableHeading('First Name'))
  .addHeading(mf.createTableHeading('Last Name'))
  .setRows(people.map(person => mf.createRow()
    .addField(mf.createTextField(null, person.firstName))
    .addField(mf.createTextField(null, person.lastName))))
  .setForms(people.map(person => mf.createReadOnlyForm()
    .addField(mf.createTextField('Job Title', person.jobTitle))
    .addAction(mf.createCallAction('Call', person.phoneNumber))))
  .setPaginationInfo(
    mf.createPaginationInfo(5, 3, 1)
      .setStatus(context.translate('systemConfiguration_paginationStatus', 1, 3, 5)));
```

### Creating an EditForm Message <a name="editFormMessage">

You use the [`createEditFormMessage`](https://oracle.github.io/bots-node-sdk/MessageFactory.html#.createEditFormMessage) method to create a message with an editable form. You should include a `submitFormAction` to submit the form. You can also set `autoSubmit` to true on a field, then the value of that field will be auto-submitted, allowing you to update other parts of the form based on the value submitted. In both cases, a FormSubmissionMessage [`FormSubmissionMessage`](https://oracle.github.io/bots-node-sdk/FormSubmissionMessage.html) is sent to the bot.

```javascript
// add imports
const { SingleSelectLayoutStyle, MultiSelectLayoutStyle, FormSubmissionMessage } = require('@oracle/bots-node-sdk/typings/lib2');

let submittedFields = context.getVariable('submittedFields') || {};
const mf = context.getMessageFactory();
const message = mf.createEditFormMessage()
  .setTitle('Editable Form')
  .addField(
    mf.createTextInputField('text-field-id', 'Text Input')
      .setDefaultValue(submittedFields['text-field-id'])
      .setMultiLine(false)
      .setMinLength(5)
      .setMaxLength(50)
      .setValidationRegularExpression('^[a-zA-Z\\s]*$')
      .setClientErrorMessage('Field is required and must be between 5 and 50 characters and numbers are not allowed.')
      .setRequired(false)
      .setAutoSubmit(true)
  )
  .addField(
    mf.createToggleField('toggle-field-id', 'Toggle', 'no', 'yes')
    .setDefaultValue(submittedFields['toggle-field-id'] || 'yes')
    .setLabelOn('I accept')
      .setLabelOff('I do not accept')
      .setRequired(false)
  )
  .addField(
    mf.createSingleSelectField('single-select-field-id', 'Single Select')
    .setDefaultValue(submittedFields['single-select-field-id'])
    .addOption(mf.createSelectFieldOption('option1', 'value1'))
      .addOption(mf.createSelectFieldOption('option2', 'value2'))
      .addOption(mf.createSelectFieldOption('option3', 'value3'))
      .setLayoutStyle(SingleSelectLayoutStyle.list)
      .setPlaceholder('Make your choice')
      .setRequired(false)
  )
  .addField(
    mf.createMultiSelectField('multi-select-field-id', 'Multi Select')
      .setDefaultValue(submittedFields['multi-select-field-id'] || ['PEPPERONI', 'CHEESE'])
      .addOption(mf.createSelectFieldOption('CHEESE'))
      .addOption(mf.createSelectFieldOption('PEPPERONI'))
      .addOption(mf.createSelectFieldOption('MEAT LOVER'))
      .addOption(mf.createSelectFieldOption('SUPREME'))
      .setLayoutStyle(MultiSelectLayoutStyle.checkboxes)
      .setRequired(false)
  )
  .addField(
    mf.createNumberInputField('number-field-id', 'Number Input')
    .setDefaultValue(submittedFields['number-field-id'])
    .setMinValue(-10)
      .setMaxValue(10)
      .setPlaceholder('Enter number between -10 and 10')
      .setClientErrorMessage('Number must be between -10 and 10')
      .setRequired(false)
  )
  .addField(
    mf.createDatePickerField('date-field-id', 'Date Picker')
      .setDefaultValue(submittedFields['date-field-id'])
      .setMaxDate(new Date().toISOString().slice(0, 10))
      .setPlaceholder('Enter a day in the past')
      .setClientErrorMessage('Date must be in the past')
      .setRequired(false)
  )
  .addField(
    mf.createTimePickerField('time-field-id', 'Time Picker')
    .setDefaultValue(submittedFields['time-field-id'])
    .setMaxTime('17:00')
      .setMinTime('09:00')
      .setClientErrorMessage('Time must be between 9 AM and 5 PM')
      .setRequired(false)
  )
  .setFormColumns(2)
  .addAction(
    mf.createSubmitFormAction('Submit', { 'action': 'done' })
  )
  .setChannelExtensionProperty(context.getChannelType(), 'replaceMessage', context.getUserMessage() instanceof FormSubmissionMessage)

context.reply(message)
  .keepTurn(false)
```
Note the following in the code above:
- The channel extension property `replaceMessage` is set to true when the user message is a `FormSubmissionMessage`. This will redisplay the existing editable form, instead of adding a new form to the message history, when the user auto-submits a field, or when you have server-side validations that fail, requiring the form to be re-displayed.
- A `submittedFields` map variable is used to read the default values. This assumes that the same variable is populated upon form submission. In a custom component it is your own responsibility to populate this variable. You would typically use the following code to process the submitted form fields:

```javascript
const um = context.getUserMessage();
let submittedFields = context.getVariable('submittedFields') || {};
if (um instanceof FormSubmissionMessage) {
  
  submittedFields = Object.assign(submittedFields, um.getSubmittedFields());
  context.setVariable('submittedFields', submittedFields);
  // if not a partial submit, we transition out
  if (!um.getPartialSubmitField()) {
    context.transition();
    context.keepTurn();
    return;
  }
}

// same code as above goes here to create the edit form message
```

When you are creating an editable form in an entity event handler, the built-in component (`ResolveEntities` or `CommonResponse`) will process the submitted fields for you:
- if the `variable` property of the component is not specified, then for each field, it looks up a variable by the same name as the field ID. If found, the variable is updated with the field value.
- if the `variable` property of the component is set to a `map` variable, the map variable is updated with the field ID as key and the field value as value for each submitted field.
- if the `variable` property of the component is set to a `compositeBag` entity variable, it looks up a bag item by the same name as the field ID. If found, it updates the composite bag item. For entity-based bag items, the submitted field value is first used for entity matching so the complete entity match value is stored as value.

### Processing the Last User Message <a name="userMessage">

The last user message can be retrieved in event handlers and custom components by calling `context.getUserMessage()`. This method returns an instance of one of the [inbound message types](#inbound). In event handlers, the user message is typically processed by the built-in component, however, in custom components that send an interactive message with buttons and/or editable fields, the custom component typically needs to process the user message as well.

Here is a skeleton code snippet that you can use as a basis to process the user message:

```javascript
if (context.getRequest().state === context.getRequest().previousState) {
  const um = context.getUserMessage();
  if (um instanceof TextMessage) {
    const text = um.getText();
    // handle text    
  } else if (um instanceof PostbackMessage) {
    const postback = um.getPostback();
    // handle postback payload      
  } else if (um instanceof FormSubmissionMessage) {  
    const submittedFields = um.getSubmittedFields();
    // process submitted fields
  } else if (um instanceof AttachmentMessage) {
    const attachmentType = um.getAttachment().getType();
    const attachmentUrl = um.getAttachment().getUrl();
    // handle attachment    
  } else if (um instanceof LocationMessage) {
    const latitude = um.getLocation().getLatitude();
    const longitude = um.getLocation().getLongitude();
    // handle location    
  }  
}  
```
When using TypeScript, you can cast to the proper message subclass to get design-time code validation and code completion:
```javascript
if (context.getRequest().state === context.getRequest().previousState) {
  const um = context.getUserMessage();
  if (um instanceof TextMessage) {
    const utm = um as typeof TextMessage;
    const text = utm.getText();
    // handle text    
  } else if (um instanceof PostbackMessage) {
    const upm = um as typeof PostbackMessage;
    const postback = upm.getPostback();
    // handle postback payload      
    ...

```


### Creating a Microsoft Adaptive Cards Message <a name="adaptiveCardMessage">

You use the [`createRawMessage`](https://oracle.github.io/bots-node-sdk/MessageFactory.html#.createRawMessage) method to send a message that uses [Microsoft Adaptive Cards](https://adaptivecards.io/):
```javascript
const card = require("../json/card.json");
 
module.exports = {
  metadata: () => ({
    name: 'orderConfirmation'
  }),
  invoke: async (context) => {

    if (context.getChannelType() === 'msteams') {
      context.reply(context.getMessageFactory().createRawMessage(card));
      } else {
      context.reply('Thank you for ordering a PEPPERONI piza, have a nice day!');
      }
      context.transition();
  }
};
```
Because the skill might use multiple channels, we only send the adaptive card for the `msteams` channel. 
The actual adaptive card payload is defined in `card.json`, which looks like this:

```javascript
{
    "type": "message",
    "attachments": [{
        "contentType": "application/vnd.microsoft.card.adaptive",
        "content": {
            "type": "AdaptiveCards",
            "version": "1.5",
            "fallbackText": "Adaptive card version not supported",
            "body": [{
                    "type": "TextBlock",
                    "text": "Summary of your order",
                    "weight": "bolder"
                },
                {
                    "type": "ColumnSet",
                    "columns": [{
                            "type": "Column",
                            "items": [{
                                "type": "Image",
                                "url": "https://cdn.pixabay.com/photo/2017/08/02/12/38/pepperoni-2571392__340.jpg",
                                "size": "large"
                            }],
                            "width": "auto"
                        },
                        {
                            "type": "Column",
                            "items": [{
                                    "type": "TextBlock",
                                    "weight": "Bolder",
                                    "text": "PEPPERONI",
                                    "wrap": true
                                },
                                {
                                    "type": "TextBlock",
                                    "spacing": "None",
                                    "text": "Classic marinara sauce with authentic old-world style pepperoni.",
                                    "isSubtle": true,
                                    "wrap": true
                                }
                            ],
                            "width": "stretch"
                        }
                    ]
                },
                {
                    "type": "TextBlock",
                    "text": "Thank you for your order, and enjoy your day!",
                    "wrap": true
                }
            ]
        }
    }]
}
```
**Tip**: You can use the [Microsoft Adaptive Cards Designer](https://adaptivecards.io/designer/) to create and test your JSON adaptive card definitions.


