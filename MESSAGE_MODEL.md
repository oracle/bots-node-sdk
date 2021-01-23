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
| `rawConversationMessage` | Freeform payload | `inbound`, `outbound` |

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

