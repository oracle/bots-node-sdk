/* tslint:disable */

import { CommonValidator } from '../../common/validator';
import MessageModelSchemaFactory = require('./schema/messageModelSchema');

/**
 * The Bots MessageModel is a utility class that helps creating and validating
 * a message structure representing a bot message.  This utility is used by the Bots Custom Components Conversation SDK, and can also
 * be used independently of the SDK.
 *
 * This utility can be used in a server side Nodejs environment, or in the browser.
 * When used in Nodejs, require the module 'joi' use it to initialize the class.  When used in browser, require the module 'joi-browser' instead.
 *
 * A MessageModel class instance can be instantiated using the constructor taking the payload
 * that represents the message.  The payload is then parsed and validated.
 *
 * The payload can be created using the various static utility methods for creating different
 * response types including TextConversationMessage, CardConversationMessage, AttachmentConversationMessage, etc.
 */
export class MessageModel {
  private _payload: any;
  private _messagePayload: any;
  private _validationError: any;
  /**
   * To create a MessageModel object using a string or an object representing the message.
   * The object is one of a known Common Message Model message type such as Text, Card, Attachment, Location, Postback, Agent or Raw type.  This object can be created
   * using the static methods in this class.  To support older message format, the object can also be of the 'choice' type or
   * text.
   *
   * The input will be parsed.  If it is a valid message, messagePayload() will return the valid message object.  If not, the message content can be retrieved via payload().
   * @constructor
   * @param {string|object} payload - The payload to be parsed into a MessageModel object
   */
  constructor(payload) {
    this._payload = payload;
    this._messagePayload = null;
    this._validationError = null;
    this._parse();
  }

  _parse() {
    if (this._payload) {
      if (this._payload.type) {
        if (this._payload.type === 'choice') {
          this._payload = MessageModel._parseLegacyChoice(this._payload);
        }
      } else {
        if (typeof this._payload === 'string') {
          this._payload = MessageModel.textConversationMessage(this._payload);
        } else {
          if (this._payload.choices) {
            this._payload = MessageModel._parseLegacyChoice(this._payload);
          } else if (this._payload.text) {
            this._payload = MessageModel.textConversationMessage(this._payload.text);
          }
        }
      }

      var result = MessageModel.validateConversationMessage(this._payload);
      if (result === true) {
        this._messagePayload = Object.assign({}, this._payload);
      } else {
        this._validationError = result;
      }
    }
  }

  /**
   * Retrieves the validated common message model payload.
   * @return {object} The common message model payload.
   */
  messagePayload() {
    return this._messagePayload;
  }

  /**
   * If messagePayload() returns null or if isValid() is false, this method can be used
   * to retrieve the payload that could not be converted to a Conversation Message Model payload.
   * @return {object} The payload which may not comply to Conversation Message Model
   */
  rawPayload() {
    return this._payload;
  }

  /**
   * returns if the instance contains a valid message according to Conversation Message Model
   * @return {boolean} if the message is valid common message model.
   */
  isValid() {
    return (!!this._messagePayload);
  }

  /**
   * Retrieves the validation error messages, if any.  Use if messagePayload() returns null or isValid() is false, signifying validation errors;
   * @return {object} The validation error(s) encountered when converting the payload to the Conversation Message Model.
   */
  validationError() {
    return this._validationError;
  }

  static _parseLegacyChoice(payload) {
    if (payload.choices && payload.choices instanceof Array && payload.choices.length > 0) {
      var postbacks = payload.choices.map(function (choice) {
        return MessageModel.postbackActionObject(choice, null, choice);
      });
      return MessageModel.textConversationMessage(payload.text, postbacks);
    } else {
      return payload;
    }
  }

  /**
   * Static utility method to create a TextConversationMessage
   * @return {object} A TextConversationMessage.
   * @param {string} text - The text of the message payload.
   * @param {object[]} [actions] - A list of actions related to the text.
   */
  static textConversationMessage(text, actions?) {
    var instance: any = {
      type: 'text',
      text: text
    };
    if (actions) {
      instance.actions = actions;
    }
    return instance;

  }

  private static _baseActionObject(type, label?, imageUrl?) {
    var instance: any = {
      type: type
    };
    if (label) {
      instance.label = label;
    }
    if (imageUrl) {
      instance.imageUrl = imageUrl;
    }
    return instance;
  }

  /**
   * Static utility method to create a postback Action.  A label or an imageUrl is required.
   * @return {object} A postbackActionObject.
   * @param {string} [label] - label of the action.
   * @param {string} [imageUrl] - image to show for the action.
   * @param {object|string} postback - object or string to send as postback if action is taken.
   */
  static postbackActionObject(label, imageUrl, postback) {
    var instance = this._baseActionObject('postback', label, imageUrl);
    instance.postback = postback;
    return instance;
  }

  /**
   * Static utility method to create a url Action.  A label or an imageUrl is required.
   * @return {object} A urlActionObject.
   * @param {string} [label] - label of the action.
   * @param {string} [imageUrl] - image to show for the action.
   * @param {string} url - url to open if action is taken.
   */
  static urlActionObject(label, imageUrl, url) {
    var instance = this._baseActionObject('url', label, imageUrl);
    instance.url = url;
    return instance;
  }

  /**
   * Static utility method to create a call Action.  A label or an imageUrl is required.
   * @return {object} A callActionObject.
   * @param {string} [label] - label of the action.
   * @param {string} [imageUrl] - image to show for the action.
   * @param {string} phoneNumber - phoneNumber to call if action is taken.
   */
  static callActionObject(label, imageUrl, phoneNumber) {
    var instance = this._baseActionObject('call', label, imageUrl);
    instance.phoneNumber = phoneNumber;
    return instance;
  }

  /**
   * Static utility method to create a location Action.  A label or an imageUrl is required.
   * @return {object} A locationActionObject.
   * @param {string} [label] - label of the action.
   * @param {string} [imageUrl] - image to show for the action.
   */
  static locationActionObject(label?, imageUrl?) {
    return this._baseActionObject('location', label, imageUrl);
  }

  /**
   * Static utility method to create a share Action.  A label or an imageUrl is required.
   * @return {object} A shareActionObject.
   * @param {string} [label] - label of the action.
   * @param {string} [imageUrl] - image to show for the action.
   */
  static shareActionObject(label, imageUrl?) {
    return this._baseActionObject('share', label, imageUrl);
  }

  /**
   * Static utility method to create a card object for CardConversationMessage
   * @return {object} A Card.
   * @param {string} title - The title of the card.
   * @param {string} [description] - The description of the card.
   * @param {string} [imageUrl] - URL of the image.
   * @param {string} [url] - URL for a hyperlink of the card.
   * @param {object[]} [actions] - A list of actions available for this card.
   */
  static cardObject(title, description?, imageUrl?, url?, actions?) {
    var instance: any = {
      title: title
    };
    if (description) {
      instance.description = description;
    }
    if (imageUrl) {
      instance.imageUrl = imageUrl;
    }
    if (url) {
      instance.url = url;
    }
    if (actions) {
      instance.actions = actions;
    }
    return instance;
  }

  /**
   * Static utility method to create a CardConversationMessage
   * @return {object} A CardConversationMessage.
   * @param {string} [layout] - 'vertical' or 'horizontal'.  Whether to display the cards horizontally or vertically.  Default is vertical.
   * @param {object[]} cards - The list of cards to be rendered.
   * @param {object[]} [actions] - A list of actions for the cardConversationMessage.
   */
  static cardConversationMessage(layout, cards, actions?) {
    var response: any = {
      type: 'card',
      layout: layout || 'vertical',
      cards: cards
    };
    if (actions) {
      response.actions = actions;
    }
    return response;
  }

  /**
   * Static utility method to create an AttachmentConversationMessage
   * @return {object} An AttachmentConversationMessage.
   * @param {string} type - type of attachment - file, image, video or audio.
   * @param {string} url - the url of the attachment.
   * @param {object[]} [actions] - A list of actions for the attachmentConversationMessage.
   */
  static attachmentConversationMessage(type, url, actions?) {
    var attachment = {
      type: type,
      url: url
    };
    var response: any = {
      type: 'attachment',
      attachment: attachment
    };
    if (actions) {
      response.actions = actions;
    }
    return response;
  }

  /**
   * Static utility method to create a LocationConversationMessage
   * @return {object} A LocationConversationMessage.
   * @param {number} latitude - The latitude.
   * @param {number} longitude - The longitude.
   * @param {string} [title] - The title for the location.
   * @param {string} [url] - A url for displaying a map of the location.
   * @param {object[]} [actions] - A list of actions for the locationConversationMessage.
   */
  static locationConversationMessage(latitude, longitude, title?, url?, actions?) {
    var location: any = {
      latitude: latitude,
      longitude: longitude
    };
    if (title) {
      location.title = title;
    }
    if (url) {
      location.url = url;
    }
    var response: any = {
      type: 'location',
      location: location
    };
    if (actions) {
      response.actions = actions;
    }
    return response;
  }

  /**
   * Static utility method to create a postackConversationMessage
   * @return {object} A PostbackConversationMessage.
   * @param {object|string} postback - object or string to send as postback
   * @param {string} [label] - The label associated with the postback.
   * @param {object[]} [actions] - A list of actions for the postbackConversationMessage.
   */
  static postbackConversationMessage(postback, label?, actions?) {
    var response: any = {
      type: 'postback',
      postback: postback
    };
    if (label) {
      response.text = label;
    }
    if (actions) {
      response.actions = actions;
    }
    return response;
  }

  /**
   * Static utility method to create a RawConversationMessage
   * @return {object} A RawConversationMessage.
   * @param {object} payload - The raw (channel-specific) payload to send.
   */
  static rawConversationMessage(payload) {
    return {
      type: 'raw',
      payload: payload
    };
  }

  /**
   * Static utility method to add channel extensions to a payload
   * @return {object} A ConversationMessage with channel extensions.
   * @param {object} message - The message to add channel extensions to.
   * @param {string} channel - The channel type ('facebook', 'webhook', etc) to set extensions on
   * @param {object} extensions - The channel-specific extensions to be added.
   */
  static addChannelExtensions(message, channel, extensions) {
    if (message && channel && extensions) {
      if (!message.channelExensions) {
        message.channelExtensions = {};
      }
      message.channelExtensions[channel] = (message.channelExtensions[channel] ? Object.assign(message.channelExtensions[channel], extensions) : extensions);
    }
    return message;
  }

  /**
   * Static utility method to add global actions to a payload
   * @return {object} A ConversationMessage with global actions.
   * @param {object} message - The message to add global actions to.
   * @param {object} globalActions - The global actions to be added.
   */
  static addGlobalActions(message, globalActions) {
    if (message && globalActions) {
      message.globalActions = globalActions;
    }
    return message;
  }

  /**
   * Static utility method to validate a common ConversationMessage
   * @return {boolean|object} true if valid; return Validation Error object (error & value) if invalid
   * @param {object} payload - The payload object to be verified
   */
  static validateConversationMessage(payload) {
    const result = CommonValidator.validate(MessageModelSchemaFactory, payload);
    if (result && !result.error) {
      return true;
    } else {
      return <any>result;
    }
  }

};
