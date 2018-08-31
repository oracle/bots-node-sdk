'use strict';

const { CommonValidator } = require("../../common/validator");
const MessageModelSchemaFactory = require("./schema/messageModelSchema");

/**
 * The Bots MessageModel is a class for creating and validating a message structure based on the
 * Conversation Message Model (CMM), representing a message to or from a bot.  This class is used 
 * by the Bots Custom Components Conversation SDK, and can also be used independently of the SDK.
 * <p>
 * This class can be used in a server side Nodejs environment, or in the browser.
 * </p>
 * A MessageModel class instance can be instantiated using the constructor taking the payload
 * that represents the message.  The payload is then parsed and validated.
 * @memberof module:Lib
 */
class MessageModel {
  /**
   * To create a MessageModel object using a javascript object representing the conversation message, 
   * or a string for plain text message.
   * <p>
   * The object is of Conversation Message Model (CMM) message type such as Text, Card, Attachment, 
   * Location, Postback, or Raw type.  This message object may be created using the static methods 
   * in this class.  Or the message object may be received from a sender, and a MessageModel
   * can then be created to validate the message object.
   * </p>
   * <p>
   * The payload will be validated.  If it is a valid message, messagePayload() will return the valid 
   * message object.  If not, the message content can be retrieved via payload().
   * </p>
   * To support older message format, the object can also be of the 'choice' type.
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
          } else if (this._payload.text && Object.keys(this._payload).length === 1) {
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
   * @return {object} The common message model payload
   */
  messagePayload() {
    return this._messagePayload;
  }

  /**
   * If messagePayload() returns null or if isValid() is false, this method can be used to 
   * retrieve the payload that could not be converted to a Conversation Message Model (CMM) payload.
   * @return {object} The payload which may not comply to Conversation Message Model (CMM)
   */
  rawPayload() {
    return this._payload;
  }

  /**
   * returns if the instance contains a valid message according to Conversation Message Model (CMM)
   * @return {boolean} if the message conforms to Conversation Message Model (CMM)
   */
  isValid() {
    return (!!this._messagePayload);
  }

  /**
   * Retrieves the validation error messages, if any.  Use if messagePayload() returns null or 
   * isValid() is false, signifying validation errors.
   * @return {object} The validation error encountered when converting the payload to the 
   * Conversation Message Model (CMM).  The validation error object is produced by joi.
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
   * Static method to create a TextConversationMessage.
   * @return {object} A TextConversationMessage.
   * @param {string} text - The text of the message payload.
   * @param {object[]} [actions] - A list of actions related to the text.
   * @param {string} [footerText] - The footerText to be added at the bottom of the message.
   */
  static textConversationMessage(text, actions, footerText) {
    var instance = {
      type: 'text',
      text: text
    };
    if (actions) {
      instance.actions = actions;
    }
    if (footerText) {
      instance.footerText = footerText;
    }
    return instance;

  }

  static _baseActionObject(type, label, imageUrl) {
    var instance = {
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
   * Static method to create a postback Action.  A label or an imageUrl is required.
   * @return {object} A postbackActionObject.
   * @param {string} [label] - label of the action.
   * @param {string} [imageUrl] - image to show for the action.
   * @param {object|string} postback - object or string to send as postback if action is taken.
   * @param {string[]} [keywords] - array of keywords that can be used to trigger the postback action.
   * @param {boolean} [skipAutoNumber] - Boolean flag that can be used to exclude a postback action 
   * from auto-numbering. Only applicable when 'autoNumberPostbackActions' context variable or
   * 'autoNumberPostbackActions' component property is set to true.
   */
  static postbackActionObject(label, imageUrl, postback, keywords, skipAutoNumber){
    var instance = this._baseActionObject('postback', label, imageUrl);
    if (~['string', 'object'].indexOf(typeof postback)) {
      instance.postback = postback;
    }
    if (keywords) {
      instance.keywords = keywords;
    }
    // since false is default for skipAutoNumber, we only need to add it when value is true
    if (skipAutoNumber) {
      instance.skipAutoNumber = skipAutoNumber;
    }
    return instance;
  }

  /**
   * Static method to create a url Action.  A label or an imageUrl is required.
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
   * Static method to create a call Action.  A label or an imageUrl is required.
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
   * Static method to create a location Action.  A label or an imageUrl is required.
   * @return {object} A locationActionObject.
   * @param {string} [label] - label of the action.
   * @param {string} [imageUrl] - image to show for the action.
   */
  static locationActionObject(label, imageUrl) {
    return this._baseActionObject('location', label, imageUrl);
  }

  /**
   * Static method to create a share Action.  A label or an imageUrl is required.
   * @return {object} A shareActionObject.
   * @param {string} [label] - label of the action.
   * @param {string} [imageUrl] - image to show for the action.
   */
  static shareActionObject(label, imageUrl) {
    return this._baseActionObject('share', label, imageUrl);
  }

  /**
   * Static method to create a card object for CardConversationMessage.
   * @return {object} A Card.
   * @param {string} title - The title of the card.
   * @param {string} [description] - The description of the card.
   * @param {string} [imageUrl] - URL of the image.
   * @param {string} [url] - URL for a hyperlink of the card.
   * @param {object[]} [actions] - A list of actions available for this card.
   */
  static cardObject(title, description, imageUrl, url, actions) {
    var instance = {
      title: title || ''
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
   * Static method to create a CardConversationMessage.
   * @return {object} A CardConversationMessage.
   * @param {string} [layout] - 'vertical' or 'horizontal'.  Whether to display the cards 
   * horizontally or vertically.  Default is vertical.
   * @param {object[]} cards - The list of cards to be rendered.
   * @param {object[]} [actions] - A list of actions for the cardConversationMessage.
   * @param {string} [footerText] - The footerText to be added at the bottom of the message.
   */
  static cardConversationMessage(layout, cards, actions, footerText) {
    var response = {
      type: 'card',
      layout: layout || 'vertical',
      cards: cards
    };
    if (actions) {
      response.actions = actions;
    }
    if (footerText) {
      response.footerText = footerText;
    }
    return response;
  }

  /**
   * Static method to create an AttachmentConversationMessage
   * @return {object} An AttachmentConversationMessage.
   * @param {string} type - type of attachment - file, image, video or audio.
   * @param {string} url - the url of the attachment.
   * @param {object[]} [actions] - A list of actions for the attachmentConversationMessage.
   * @param {string} [footerText] - The footerText to be added at the bottom of the message.
   */
  static attachmentConversationMessage(type, url, actions, footerText) {
    var attachment = {
      type: type,
      url: url
    };
    var response = {
      type: 'attachment',
      attachment: attachment
    };
    if (actions) {
      response.actions = actions;
    }
    if (footerText) {
      response.footerText = footerText;
    }
    return response;
  }

  /**
   * Static method to create a LocationConversationMessage.
   * @return {object} A LocationConversationMessage.
   * @param {number} latitude - The latitude.
   * @param {number} longitude - The longitude.
   * @param {string} [title] - The title for the location.
   * @param {string} [url] - A url for displaying a map of the location.
   * @param {object[]} [actions] - A list of actions for the locationConversationMessage.
   */
  static locationConversationMessage(latitude, longitude, title, url, actions) {
    var location = {
      latitude: latitude,
      longitude: longitude
    };
    if (title) {
      location.title = title;
    }
    if (url) {
      location.url = url;
    }
    var response = {
      type: 'location',
      location: location
    };
    if (actions) {
      response.actions = actions;
    }
    return response;
  }

  /**
   * Static method to create a postackConversationMessage
   * @return {object} A PostbackConversationMessage.
   * @param {object|string} postback - object or string to send as postback.
   * @param {string} [label] - The label associated with the postback.
   * @param {object[]} [actions] - A list of actions for the postbackConversationMessage.
   */
  static postbackConversationMessage(postback, label, actions) {
    var response = {
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
   * Static method to create a RawConversationMessage.
   * @return {object} A RawConversationMessage.
   * @param {object} payload - The raw (channel-specific) payload,
   */
  static rawConversationMessage(payload) {
    return {
      type: 'raw',
      payload: payload
    };
  }

  /**
   * Static method to add channel extensions to a payload object.
   * @return {object} A ConversationMessage with channel extensions.
   * @param {object} message - The message to add channel extensions to.
   * @param {string} channel - The channel type ('facebook', 'webhook', etc) to set extensions on.
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
   * Static method to add global actions to a payload object.
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
   * Static method to validate a common ConversationMessage
   * @return {boolean|object} true if valid; return Validation Error object (error & value) if invalid
   * @param {object} payload - The payload object to be verified
   */
  static validateConversationMessage(payload) {
    const result = CommonValidator.validate(MessageModelSchemaFactory, payload);
    if (result && !result.error) {
      return true;
    } else {
      return result;
    }
  }
}

module.exports = {
  MessageModel,
}