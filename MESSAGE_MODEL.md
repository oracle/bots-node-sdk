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
    - [Creating a Microsoft Adaptive Cards Message](#adaptiveCardMessage)

## Introduction <a name="introduction">
Oracle Digital Assitant contains a so-called Conversation Message Model (CMM) which defines the various message types that can be sent from the bot to the user (outbound), and from the user to the bot (inbound). CMM identifies the following message types:
- **text**: basic text message
- **card**: a card representation containing a title, and optionally a description, image and link.
- **attachment**: a message with a media URL (file, image, video, audio)
- **location**: a message with geo location coordinates
- **postback**: a message with postback payload

Messages defined in CMM are channel-agnostic, you create them once using the CMM syntax, and channel-specific connectors will transform the CMM message into the format required by the specific client channel, allowing you to run your skill on multiple channels without the need to create separate message formats for each channel. 
<br/><br/>
The text, card and attachment message types can have a list of `actions` and a list of `globalActions` attached to the message. The `actions` are rendered directly below the message text, card or attachment. The `globalActions` are actions that are not directly related to the actual message, typically displayed as buttons at the bottom of the chat window. In Facebook Messenger these options are called quick replies. 
CMM supports the following action types for `actions` and `globalActions`:
- **postback**: Sends the payload of the action back to the ODA dialog engine.
- **share**: Opens a share dialog in messenger client, enabling people to share message bubbles with friends.
- **call**: calls the phone number specified in the payload.
- **url**: opens the URL specified in the payload in the in-app browser. 
- **location**: sends the geo coordinates (latitude, longitude) of the current location. 

Note that not all action types are supported on all channels. See the documentation on [Channel Message Constraints](https://docs.oracle.com/en/cloud/paas/digital-assistant/use-chatbot/channels-topic.html#GUID-6E33549A-086C-4F22-894A-42B47C0CD53A) for more info.
<br/><br/>
There might be specific use cases where you want to leverage channel-specific message capabilities that are not supported by CMM. To implement those use cases, you can use [channel extensions](#extensions), or send a so-called `raw conversation message` which includes the channel-specific message payload that channel connectors will just pass on to the chat client 'as is' without doing any transformations.
<br/><br/>
All inbuilt components create bot messages in CMM format, and the [System.CommonResponse](https://docs.oracle.com/en/cloud/paas/digital-assistant/use-chatbot/built-components-properties-transitions-and-usage.html#GUID-11BB6EBF-EA29-404E-B966-C3DC70D3625C) component provides full support for all CMM message types.
We recommend to consider using the `System.CommonResponse` component before you decide to create conversation messages in custom components. It is generally easier to prepare the data in a custom component by calling some backend service, and store the data in context variables. You can then transition to a dialog flow state that uses the `System.CommonResponse` component to create the bot messages in CMM format, using and/or iterating over the data stored in context variables by the custom component. The `System.CommonResponse` component contains extensive functionality to process user input, and also includes out-of-the-box support for pagination, which might be useful if you want to enable the user to scroll through large sets of data. 

## Using the SDK Message Model <a name="messageModel">

The SDK provides the [MessageModel](https://oracle.github.io/bots-node-sdk/MessageModel.html) class to create the message types supported by CMM. You can use `context.getMessageModel()` to access the the `MessageModel` from within a custom component `invoke` method or from with an entity event handler event method. Use `webhook.MessageModel()` to access from within a `WebhookClient` instance. In addition, the MessageModel can be used independently:

```javascript
const { MessageModel } = require('@oracle/bots-node-sdk/lib');
```
The `MessageModel` class provides the following static methods to create the various message types:

| Type | Method | Usage |
|--|--|--|
| text | `textConversationMessage` | `inbound`, `outbound` |
| attachment | `attachmentConversationMessage` | `inbound`, `outbound` |
| card | `cardConversationMessage` |  `outbound` |
| raw | `rawConversationMessage` | `inbound`, `outbound` |

Except for the `rawConversationMessage` method, each method has optional arguments to set a `headerText`, `footerText`, a list of `actions`, and a list of [keywords](#keywords). 
Global actions can be added to the message by using the `addGlobalActions` method.

**NOTE**: The SDK also contains `postbackConversationMessage` and `locationConversationMessage` methods, but since these are inbound-only messages, you will not create such messages in custom components or entity event handlers. A postback message is received when the user taps a postback action button in the chat client, a location message is received when the user sends his current geo location in the chat client.
<br/><br/>
The various action types can be created with the following static methods in the `MessageModel` class:

| Type | Method 
|--|--
| postback | `postbackActionObject` 
| url | `urlActionObject` 
| call | `callActionObject` 
| location | `locationActionObject` 
| share | `shareActionObject` 

### Channel Extensions <a name="extensions">

Channel extensions can be used to leverage channel-specific features that are not included in CMM without you having to fall back to creating a `raw conversation message` for that channel. Channel extensions can be set using the `addChannelExtensions` method.
For example, you can use channel extensions to do the following:

- create a card message, and change the appearance of the first card on Facebook:
```javascript
let cardMessage = messageModel.cardConversationMessage('vertical', cards);
messageModel.addChannelExtensions(cardMessage, 'facebook', {"top_element_style": "large"});
```

- create a text message to prompt for a date, and configure Slack to display a date picker:
```javascript
let textMessage = messageModel.textConversationMessage('What is the expense date');
messageModel.addChannelExtensions(textMessage, 'slack', {"showDatePicker": true});
```

A complete list of all extension properties for each channel can be found [here](https://docs.oracle.com/en/cloud/paas/digital-assistant/use-chatbot/channels-topic.html#GUID-E73235B7-1C26-47D5-BFF2-58D65A44E0EB).

### Using Postback Keywords <a name="keywords">

Using keywords, you can map a simple text entry by the user to a postback payload. This is useful for channels that don't support buttons, like twilio/SMS. For example, you can number the pizza sizes a user can choose from and then create a postback keyword for each size. This allows the user to enter just the number, and ODA will then convert that to a postback message payload that contains the actual pizza size that you can process in your custom component. You create a keyword entry using the static [postbackKeyword](https://oracle.github.io/bots-node-sdk/MessageModel.html#.postbackKeyword) method:
```javascript
const messageModel = context.getMessageModel();
let keywords = [];
keywords.push( messageModel.postbackKeyword(["1","first"], {"variables" : {"pizzaSize": "small"}}));
keywords.push( messageModel.postbackKeyword(["2","second"], {"variables" : {"pizzaSize": "medium"}}));
keywords.push( messageModel.postbackKeyword(["1","third"], {"variables" : {"pizzaSize": "large"}}));
let textMessage = messageModel.textConversationMessage('What pizza size do you want?\n1. Small\n2. Medium\n3. Large', undefined, undefined, undefined, keywords);
context.reply(textMessage);
```

## MessageModel Utilities <a name="utilities">

Additionally, a set of utilities for MessageModel are provided. `Util.MessageModel`
functions help deriving string or speech representation of a Conversation Message
Model payload. This is used primarily to output text or speech to voice or
text-based channels like Alexa and SMS.

```javascript
const { messageModelUtil } = require('@oracle/bots-node-sdk/util');
// ...
messageModelUtil.convertRespToText(message);
```

## Code Samples <a name="samples">

All samples below create a CMM message type. In a custom component, the message created can be sent using `context.reply(message)`.
In an entity event handler, the message created can be sent using `context.addMessage(message)`.

### Creating a Text Message with Action Buttons <a name="textMessage">

To create a text message with actions buttons, we first use the [postbackActionObject](https://oracle.github.io/bots-node-sdk/MessageModel.html#.postbackActionObject) function to create each button action, and then the [textConversationMessage](https://oracle.github.io/bots-node-sdk/MessageModel.html#.textConversationMessage) function to construct the message object.

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

To create a card message with card actions buttons, we first use the [cardObject](https://oracle.github.io/bots-node-sdk/MessageModel.html#.cardObject) function to create each card and the [postbackActionObject](https://oracle.github.io/bots-node-sdk/MessageModel.html#.postbackActionObject) function to create each button action, and finally the [cardConversationMessage](https://oracle.github.io/bots-node-sdk/MessageModel.html#.cardConversationMessage) function to construct the message object.

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

We use the [attachmentConversationMessage](https://oracle.github.io/bots-node-sdk/MessageModel.html#.attachmentConversationMessage) function to create an attachment message.

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

### Creating a Microsoft Adaptive Cards Message <a name="adaptiveCardMessage">

We use the [rawConversationMessage](https://oracle.github.io/bots-node-sdk/MessageModel.html#.rawConversationMessage) function to send a message which uses [Microsoft Adaptive Cards](https://adaptivecards.io/):
```javascript
const card = require("../json/card.json");
 
module.exports = {
  metadata: () => ({
    name: 'orderConfirmation'
  }),
  invoke: (context, done) => {
    if (context.getRequest().message.channelConversation.type ==='msteams') {
      context.reply(context.getMessageModel().rawConversationMessage(card));
     } else {
      context.reply('Thank you for ordering a PEPPERONI piza, have a nice day!');
     }
     context.transition();
     done();
  }
};
```
Since the skill might use multiple channels, we only send the adaptve card for the `msteams` channel. 
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
**Tip**: You can the [Microsoft Adaptive Cards Designer](https://adaptivecards.io/designer/) to create and test your JSON adaptive card definitions.


