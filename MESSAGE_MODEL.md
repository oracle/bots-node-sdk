# Conversation Messaging 

## Table of contents
- [Introduction](#introduction)
- [Using the SDK Message Model](#messageModel)
    - [Channel Extensions](#extensions)
    - [Using Postback Keywords](#keywords)
- [MessageModel Utilities](#utilities)
- [Code Samples](#samples)
    - [Creating a Text Message with Action Buttons](#textMessage)
    - [Creating a Card Message with Card Action Buttons](#cardMessage)
    - [Creating an Attachment Message](#attachmentMessage)
    - [Creating a Table Message](#tableMessage)
    - [Creating a Form Message](#formMessage)
    - [Creating a TableForm Message](#tableFormMessage)
    - [Creating a Microsoft Adaptive Cards Message](#adaptiveCardMessage)

## Introduction <a name="introduction">
Oracle Digital Assitant contains conversation message model (CMM), which defines the various message types that the skill can send to the user (outbound), and the user can send to the skill (inbound). CMM identifies the following message types:
- **text**: Basic text message
- **card**: A card representation that contains a title and, optionally, a description, image, and link
- **attachment**: A message with a media URL (file, image, video, or audio)
- **location**: A message with geo-location coordinates
- **postback**: A message with a postback payload

Messages that are defined in CMM are channel-agnostic. You create them once using the CMM syntax. The channel-specific connectors transform the CMM message into the format required by the specific client channel, allowing you to run your skill on multiple channels without the need to create separate message formats for each channel. 
<br/><br/>
The text, card, and attachment message types can have a list of `actions` and a list of `globalActions` attached to the message. The `actions` are rendered directly below the message text, card, or attachment. The `globalActions` are actions that aren't directly related to the actual message, and are typically displayed as buttons at the bottom of the chat window. In Facebook Messenger, these options are called quick replies. 

CMM supports the following action types for `actions` and `globalActions`:
- **postback**: Sends the payload of the action back to the Digital Assistant dialog engine
- **share**: Opens a share dialog in messenger client, enabling people to share message bubbles with friends
- **call**: Calls the phone number specified in the payload
- **url**: Opens in the in-app browser the URL specified in the payload
- **location**: Sends the geo coordinates (latitude and longitude) of the current location

Note that not all action types are supported on all channels. See [Comparison of Channel Message Constraints](https://www.oracle.com/pls/topic/lookup?ctx=en/cloud/paas/digital-assistant&id=DACUA-GUID-6E33549A-086C-4F22-894A-42B47C0CD53A) in *Using Oracle Digital Assistant* for more info.
<br/><br/>
There might be specific use cases where you want to leverage channel-specific message capabilities that aren't supported by CMM. To implement those use cases, you can use [channel extensions](#extensions) or send a `raw conversation message`, which includes the channel-specific message payload that channel connectors will just pass on to the chat client 'as is' without doing any transformations.
<br/><br/>
All built-in components create skill messages in CMM format, and the [System.CommonResponse](https://www.oracle.com/pls/topic/lookup?ctx=en/cloud/paas/digital-assistant&id=DACUA-GUID-11BB6EBF-EA29-404E-B966-C3DC70D3625C) component provides full support for all CMM message types.
We recommend that you consider using the `System.CommonResponse` component before you decide to create conversation messages in custom components. It's generally easier to prepare the data in a custom component by calling some backend service, and then store the data in context variables. You can then transition to a dialog flow state that uses the `System.CommonResponse` component to create the bot messages in CMM format, using and/or iterating over the data that's been stored in context variables by the custom component. The `System.CommonResponse` component contains extensive functionality to process user input, and also includes out-of-the-box support for pagination, which might be useful if you want to enable the user to scroll through large sets of data. 

## Using the SDK Message Model <a name="messageModel">

The SDK provides the [MessageModel](https://oracle.github.io/bots-node-sdk/MessageModel.html) class to create the message types supported by CMM. You can use `context.getMessageModel()` to access the the `MessageModel` from within a custom component's `invoke` method or from with an entity event handler's event method. Use `webhook.MessageModel()` to access from within a `WebhookClient` instance. In addition, you can use the MessageModel independently as shown here:

```javascript
const { MessageModel } = require('@oracle/bots-node-sdk/lib');
```
The `MessageModel` class provides the following static methods to create the various message types:

| Type | Method | Usage |
|--|--|--|
| text | `textConversationMessage` | `inbound`, `outbound` |
| attachment | `attachmentConversationMessage` | `inbound`, `outbound` |
| card | `cardConversationMessage` |  `outbound` |
| table | `tableConversationMessage` |  `outbound` |
| form | `formConversationMessage` |  `outbound` |
| tableForm | `tableFormConversationMessage` |  `outbound` |
| raw | `rawConversationMessage` | `inbound`, `outbound` |

Except for the `rawConversationMessage` method, each method has optional arguments to set a `headerText`, `footerText`, a list of `actions`, and a list of [keywords](#keywords). 
Global actions can be added to the message by using the `addGlobalActions` method.

> **NOTE**: The SDK also contains `postbackConversationMessage` and `locationConversationMessage` methods, but since these are inbound-only messages, you will not create such messages in custom components or entity event handlers. A postback message is received when the user taps a postback action button in the chat client, a location message is received when the user sends his current geo location in the chat client.
<br/><br/>
You can create the various action types by using the following static methods in the `MessageModel` class:

| Type | Method 
|--|--
| postback | `postbackActionObject` 
| url | `urlActionObject` 
| call | `callActionObject` 
| location | `locationActionObject` 
| share | `shareActionObject` 

### Channel Extensions <a name="extensions">

You can use channel extensions to leverage channel-specific features that aren't included in the CMM without having to create a `raw conversation message` for that channel. Channel extensions can be set using the `addChannelExtensions` method.
For example, you can use channel extensions to do the following:

- Create a card message and change the appearance of the first card on Facebook:
```javascript
let cardMessage = messageModel.cardConversationMessage('vertical', cards);
messageModel.addChannelExtensions(cardMessage, 'facebook', {"top_element_style": "large"});
```

- Create a text message to prompt for a date and configure Slack to display a date picker:
```javascript
let textMessage = messageModel.textConversationMessage('What is the expense date');
messageModel.addChannelExtensions(textMessage, 'slack', {"showDatePicker": true});
```

For a complete list of all extension properties for each channel, see [Channel-Specific Extensions](https://www.oracle.com/pls/topic/lookup?ctx=en/cloud/paas/digital-assistant&id=DACUA-GUID-E73235B7-1C26-47D5-BFF2-58D65A44E0EB) in *Using Oracle Digital Assistant*.

### Using Postback Keywords <a name="keywords">

Using keywords, you can map a user's simple text entry to a postback payload. This is useful for channels that don't support buttons, like Twilio/SMS. For example, you can number the pizza sizes a user can choose from and then create a numeric postback keyword for each size. This allows the user to enter just the number, and Digital Assistant converts that to a postback message payload that contains the actual pizza size, which you can then process in your custom component. You create a keyword entry using the static [`postbackKeyword`](https://oracle.github.io/bots-node-sdk/MessageModel.html#.postbackKeyword) method:
```javascript
const messageModel = context.getMessageModel();
let keywords = [];
keywords.push( messageModel.postbackKeyword(["1","first"], {"variables" : {"pizzaSize": "small"}}));
keywords.push( messageModel.postbackKeyword(["2","second"], {"variables" : {"pizzaSize": "medium"}}));
keywords.push( messageModel.postbackKeyword(["3","third"], {"variables" : {"pizzaSize": "large"}}));
let textMessage = messageModel.textConversationMessage('What pizza size do you want?\n1. Small\n2. Medium\n3. Large', undefined, undefined, undefined, keywords);
context.reply(textMessage);
```

## MessageModel Utilities <a name="utilities">

Additionally, the SDK provides a set of utilities for the MessageModel. For example, `Util.MessageModel`
functions help derive string or speech representation of a conversation message
model payload. These are primarily used to output text or speech to voice or
text-based channels like Alexa and SMS. For example:

```javascript
const { messageModelUtil } = require('@oracle/bots-node-sdk/util');
// ...
messageModelUtil.convertRespToText(message);
```

## Code Samples <a name="samples">

All of the following examples create a CMM message type. In a custom component, you use `context.reply(message)` to send the created message.
In an entity event handler, you use `context.addMessage(message)`.

### Creating a Text Message with Action Buttons <a name="textMessage">

To create a text message with actions buttons, first use the [`postbackActionObject`](https://oracle.github.io/bots-node-sdk/MessageModel.html#.postbackActionObject) function to create each button action, and then use the [`textConversationMessage`](https://oracle.github.io/bots-node-sdk/MessageModel.html#.textConversationMessage) function to construct the message object.

```javascript
const messageModel = context.getMessageModel();
// set up the button actions
let actions = [];
actions.push(messageModel.postbackActionObject("Yes", undefined, { isNo: false }));
actions.push(messageModel.postbackActionObject("No", undefined, { isNo: true }));
// create the text message
const message = messageModel.textConversationMessage("Do you want another quote?", actions);
```

### Creating a Card Message with Card Action Buttons <a name="cardMessage">

To create a card message with card actions buttons, first use the [`cardObject`](https://oracle.github.io/bots-node-sdk/MessageModel.html#.cardObject) function to create each card, then use the [`postbackActionObject`](https://oracle.github.io/bots-node-sdk/MessageModel.html#.postbackActionObject) function to create each button action, and, finally, use the [`cardConversationMessage`](https://oracle.github.io/bots-node-sdk/MessageModel.html#.cardConversationMessage) function to construct the message object.

```javascript
  context messageModel = context.getMessageModel();
  let cards = [];
  cards.push(messageModel.cardObject('4 Dozen Oranges','4 dozen Mandarin oranges in a wooden crate.',
    undefined, undefined, [messageModel.postbackActionObject('Oranges', undefined, { action: 'oranges' })]));
  cards.push(messageModel.cardObject('Carton of Grapes', '10kg ripe grapes in a protected carton.',
    undefined, undefined, [messageModel.postbackActionObject('Grapes', undefined, { action: 'grapes' })]));
  let message = messageModel.cardConversationMessage('vertical', cards);
}
```

### Creating an Attachment Message <a name="attachmentMessage">

You use the [`attachmentConversationMessage`](https://oracle.github.io/bots-node-sdk/MessageModel.html#.attachmentConversationMessage) function to create an attachment message.

```javascript
  const messageModel = context.getMessageModel();  
  let message = messageModel.attachmentConversationMessage(attachmentType, attachmentUrl);
```

The attachment type can be `image`, `video`, `audio`, or `file`.
You can display action URLs under the attachment, such as links to more videos and tutorials as shown here:

```javascript
  const videosUrl="https://example.com/videos.html";
  const tutorialsUrl = "https://example.com/tutorials.html";
  var urlVideoAction =messageModel.urlActionObject('More Videos', undefined, videosUrl);
  var urlTutorialAction = messageModel.urlActionObject('More Tutorials', undefined, tutorialsUrl);
  let message = messageModel.attachmentConversationMessage(attachmentType, attachmentUrl,
       [urlVideoAction, urlTutorialAction]);
```

### Creating a Table Message <a name="tableMessage">

You use the [`tableConversationMessage`](https://oracle.github.io/bots-node-sdk/MessageModel.html#.tableConversationMessage) function to create a message with table layout.

```javascript
  const messageModel = context.getMessageModel();  
  let message = messageModel.tableConversationMessage(headings, rows, paginationInfo);
```

To create the arguments required for `tableConversationMessage`, you can use the following functions:
- [`tableHeaderColumn`](https://oracle.github.io/bots-node-sdk/MessageModel.html#.tableHeaderColumn) function to populate the array of headings
- [`tableColumn`](https://oracle.github.io/bots-node-sdk/MessageModel.html#.tableColumn) function to populate an array of columns
- [`tableRow`](https://oracle.github.io/bots-node-sdk/MessageModel.html#.tableRow) function to populate the array of rows, passing in the columns as argument for each row.
- [`paginationInfo`](https://oracle.github.io/bots-node-sdk/MessageModel.html#.paginationInfo) function to create the optional paginationInfo. Note that adding this info is only used to display a pagination status message, you must implement the actual pagination yourself. 

```javascript
  const people = [ {firstName: "Bob", lastName: "Dole"}
                ,{firstName: "John", lastName: "Doe"}
                ,{firstName: "Jane", lastName: "Doe"}]

  let headings = [];
  headings.push( messageModel.tableHeaderColumn("First Name"));
  headings.push( messageModel.tableHeaderColumn("Last Name"));
  let rows = [];
  for (let p of people) {
     let columns = [];
     columns.push(messageModel.tableColumn(p.firstName));
     columns.push(messageModel.tableColumn(p.lastName));
     rows.push(messageModel.tableRow(columns));
  }
  const paginationInfo = messageModel.paginationInfo(5,3,0, context.translate("systemConfiguration_paginationStatus",1,3,5));
  let message = messageModel.tableConversationMessage(headings, rows, paginationInfo);
```

### Creating a Form Message <a name="FormMessage">

You use the [`formConversationMessage`](https://oracle.github.io/bots-node-sdk/MessageModel.html#.formConversationMessage) function to create a message with tableForm layout.

```javascript
  const messageModel = context.getMessageModel();  
  let message = messageModel.formConversationMessage(forms, formColumns, paginationInfo);
```

To create the arguments required for `formConversationMessage`, you can use the following functions:
- [`formField`](https://oracle.github.io/bots-node-sdk/MessageModel.html#.formField) function to populate an array of field
- [`form`](https://oracle.github.io/bots-node-sdk/MessageModel.html#.form) function to populate the array of forms, passing in the fields as argument for each form.
- [`paginationInfo`](https://oracle.github.io/bots-node-sdk/MessageModel.html#.paginationInfo) function to create the optional paginationInfo. Note that adding this info is only used to display a pagination status message, you must implement the actual pagination yourself. 

```javascript
  const messageModel = context.getMessageModel();  
  const people = [ {firstName: "Bob", lastName: "Dole"}
                ,{firstName: "John", lastName: "Doe"}
                ,{firstName: "Jane", lastName: "Doe"}]

  let forms = [];
  for (let p of people) {
    let fields = [];
    fields.push(messageModel.formField("First Name", p.firstName));
    fields.push(messageModel.formField("Last Name", p.lastName));
    forms.push(messageModel.form(fields));
  }
  const paginationInfo = messageModel.paginationInfo(5,3,0, context.translate("systemConfiguration_paginationStatus",1,3,5));
  let message = messageModel.formConversationMessage(forms, 2, paginationInfo);
```

### Creating a TableForm Message <a name="tableFormMessage">

You use the [`tableFormConversationMessage`](https://oracle.github.io/bots-node-sdk/MessageModel.html#.tableFormConversationMessage) function to create a message with tableForm layout.

```javascript
  const messageModel = context.getMessageModel();  
  let message = messageModel.tableFormConversationMessage(headings, rows, forms, formColumns, showFormButtonLabel, paginationInfo);
```

To create the arguments required for `tableConversationMessage`, you can use the following functions:
- [`tableHeaderColumn`](https://oracle.github.io/bots-node-sdk/MessageModel.html#.tableHeaderColumn) function to populate the array of headings
- [`tableColumn`](https://oracle.github.io/bots-node-sdk/MessageModel.html#.tableColumn) function to populate an array of columns
- [`tableRow`](https://oracle.github.io/bots-node-sdk/MessageModel.html#.tableRow) function to populate the array of rows, passing in the columns as argument for each row.
- [`formField`](https://oracle.github.io/bots-node-sdk/MessageModel.html#.formField) function to populate an array of field
- [`form`](https://oracle.github.io/bots-node-sdk/MessageModel.html#.form) function to populate the array of forms, passing in the fields as argument for each form.
- [`paginationInfo`](https://oracle.github.io/bots-node-sdk/MessageModel.html#.paginationInfo) function to create the optional paginationInfo. Note that adding this info is only used to display a pagination status message, you must implement the actual pagination yourself. 

```javascript
  const people = [ {firstName: "Bob", lastName: "Dole"}
                ,{firstName: "John", lastName: "Doe"}
                ,{firstName: "Jane", lastName: "Doe"}]

  let headings = [];
  headings.push( messageModel.tableHeaderColumn("First Name"));
  let rows = [];
  let forms = [];
  for (let p of people) {
    // create row
    let columns = [];
    columns.push(messageModel.tableColumn(p.firstName));
    rows.push(messageModel.tableRow(columns));
    // create form
    let fields = [];
    fields.push(messageModel.formField("Last Name", p.lastName));
    forms.push(messageModel.form("View details", fields));
  }
  const paginationInfo = messageModel.paginationInfo(5,3,0, context.translate("systemConfiguration_paginationStatus",1,3,5));
  let message = messageModel.tableFormConversationMessage(headings, rows, forms, 2, null, paginationInfo);
```

### Creating a Microsoft Adaptive Cards Message <a name="adaptiveCardMessage">

You use the [`rawConversationMessage`](https://oracle.github.io/bots-node-sdk/MessageModel.html#.rawConversationMessage) function to send a message that uses [Microsoft Adaptive Cards](https://adaptivecards.io/):
```javascript
const card = require("../json/card.json");
 
module.exports = {
  metadata: () => ({
    name: 'orderConfirmation'
  }),
  invoke: (context, done) => {
    if (context.getChannelType() === 'msteams') {
      context.reply(context.getMessageModel().rawConversationMessage(card));
     } else {
      context.reply('Thank you for ordering a PEPPERONI piza, have a nice day!');
     }
     context.transition();
     done();
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
            "version": "1.2",
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


