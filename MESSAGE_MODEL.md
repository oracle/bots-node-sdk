# Conversation Messaging 

Oracle Digital Assitant contains a so-called Conversation Message Model (CMM) which defines the various message types that can be send from the bot to the user (outbound), and from the user to the bot (inbound).

The SDK provides the `MessageModel` class to create the message types supported by CMM.
The class provides several static methods used to create a stuctured object of a
known CMM message type such as Text, Card, Attachment, Location,
Postback or Raw type. It can be used within Custom Components, Entity Event Handlers, Webhook, or
independently. 

| Method | Purpose | Usage |
|--|--|--|
| `textConversationMessage` | Basic text | `inbound`, `outbound` |
| `attachmentConversationMessage` | Support media URLs | `inbound`, `outbound` |
| `cardConversationMessage` | Card presentation | `outbound` |
| `postbackConversationMessage` | Submit postback payloads | `inbound` |
| `locationConversationMessage` | Receive location payload | `inbound` |
| `rawConversationMessage` | Freeform channel-specific payload | `inbound`, `outbound` |

You can use `context.getMessageModel()` to access the the `MessageModel` from within a custom component `invoke` method or from with an entity event handler event method. Use `webhook.MessageModel()` to access from within a `WebhookClient` instance.

In addition, the MessageModel can be used independently:

```javascript
const { MessageModel } = require('@oracle/bots-node-sdk/lib');
```

When used in browser, include the package `joi-browser`.

## MessageModel Utilities

Additionally, a set of utilities for MessageModel are provided. `Util.MessageModel`
functions help deriving string or speech representation of a Conversation Message
Model payload. This is used primarily to output text or speech to voice or
text-based channels like Alexa and SMS.

```javascript
const { messageModelUtil } = require('@oracle/bots-node-sdk/util');
// ...
messageModelUtil.convertRespToText(message);
```

## Code Samples

### Creating a Text Message with Action Buttons <a name="textMessage">

To create a text message with actions buttons, we first use the [postbackActionObject](https://oracle.github.io/bots-node-sdk/module-Lib.MessageModel.html#.postbackActionObject) function to create each button action, and then the [textConversationMessage](https://oracle.github.io/bots-node-sdk/module-Lib.MessageModel.html#.textConversationMessage) function to construct the message object.

```javascript
const messageModel = context.getMessageModel();
// set up the button actions
let actions = [];
actions.push(messageModel.postbackActionObject("Yes", undefined, { isNo: false }));
actions.push(messageModel.postbackActionObject("No", undefined, { isNo: true }));
// create the text message
const message = messageModel.textConversationMessage("Do you want another quote?", actions);
```
In a custom component, the message created can be sent using `context.reply(message)`.
In an entity event handler, the message created can be sent using `context.reply(message)` or `context.addMessage(message)`.

### Creating a Card Message with Card Action Buttons <a name="cardMessage">

To create a card message with card actions buttons, we first use the [cardObject](https://oracle.github.io/bots-node-sdk/module-Lib.MessageModel.html#.cardObject) function to create each card and the [postbackActionObject](https://oracle.github.io/bots-node-sdk/module-Lib.MessageModel.html#.postbackActionObject) function to create each button action, and finally the [cardConversationMessage](https://oracle.github.io/bots-node-sdk/module-Lib.MessageModel.html#.cardConversationMessage) function to construct the message object.

```javascript
  context messageModel = context.getMessageModel();
  let cards = [];
  cards.push(messageModel.cardObject(4 Dozen Oranges','4 dozen Mandarin oranges in a wooden crate.',
    undefined, undefined, [messageModel.postbackActionObject('Oranges', undefined, { action: 'oranges' })]));
  cards.push(messageModel.cardObject('Carton of Grapes', '10kg ripe grapes in a protected carton.',
    undefined, undefined, [messageModel.postbackActionObject('Grapes', undefined, { action: 'grapes' })]));
  let message = messageModel.cardConversationMessage('vertical', cards);
}
```
### Creating an Attachment Message <a name="attachmentMessage">

We use the [attachmentConversationMessage](https://oracle.github.io/bots-node-sdk/module-Lib.MessageModel.html#.attachmentConversationMessage) function to create an attachment message.

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
