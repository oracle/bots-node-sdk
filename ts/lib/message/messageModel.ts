/* tslint:disable */

import { CommonValidator } from '../../common/validator';
import { Action, Attachment, AttachmentMessage, BaseAction, BaseMessagePayload, CallAction, Card, CardMessage, Keyword, Location
  , LocationAction, LocationMessage, MessagePayload, PostbackAction, PostbackMessage, RawMessage, ShareAction, TextMessage
  , UrlAction, NonRawMessagePayload, ChannelType } from './messageTypes';
import MessageModelSchemaFactory = require('./schema/messageModelSchema');

/**
 * The Bots MessageModel is a utility class that helps creating and validating
 * a message structure representing a bot message.  This utility is used by the Bots Custom Components Conversation SDK, and can also
 * be used independently of the SDK.
 *
 * This utility can be used in a server side Nodejs environment, or in the browser.
 * When used in Nodejs, require the module 'joi' use it to initialize the class.  When used in browser, require the module <code>joi-browser</code> instead.
 *
 * A MessageModel class instance can be instantiated using the constructor taking the payload
 * that represents the message.  The payload is then parsed and validated.
 *
 * The payload can be created using the various static utility methods for creating different
 * response types including TextConversationMessage, CardConversationMessage, AttachmentConversationMessage, etc.
 */
export class MessageModel {
  private _payload: any;
  private _messagePayload: MessagePayload;
  private _validationError: any;
  /**
   * To create a MessageModel object using a string or an object representing the message.
   * The object is one of a known Common Message Model message type such as Text, Card, Attachment, Location, Postback, Agent or Raw type.  This object can be created
   * using the static methods in this class.  To support older message format, the object can also be of the 'choice' type or
   * text.
   *
   * The input will be parsed.  If it is a valid message, messagePayload() will return the valid message object.  If not, the message content can be retrieved via payload().
   * @constructor
   * @param payload - The payload to be parsed into a MessageModel object
   */
  constructor(payload: string | object) {
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
   * @return The common message model payload.
   */
  messagePayload(): MessagePayload {
    return this._messagePayload;
  }

  /**
   * If messagePayload() returns null or if isValid() is false, this method can be used
   * to retrieve the payload that could not be converted to a Conversation Message Model payload.
   * @return The payload which may not comply to Conversation Message Model
   */
  rawPayload() {
    return this._payload;
  }

  /**
   * returns if the instance contains a valid message according to Conversation Message Model
   * @return if the message is valid common message model.
   */
  isValid() {
    return (!!this._messagePayload);
  }

  /**
   * Retrieves the validation error messages, if any.  Use if messagePayload() returns null or isValid() is false, signifying validation errors;
   * @return The validation error(s) encountered when converting the payload to the Conversation Message Model.
   */
  validationError() {
    return this._validationError;
  }

  private static _parseLegacyChoice(payload) {
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
   * @return A TextConversationMessage.
   * @param text - The text of the message payload.
   * @param actions - A list of actions related to the text.
   * @param footerText - The footerText to be added at the bottom of the message.
   * @param headerText - The headerText to be added at the top of the message.
   * @param keywords - A list of postback keywords that can be created with the postbackKeyword function
   */
  static textConversationMessage(text: string, actions?:  Action[], footerText?: string, headerText?: string, keywords?: Keyword[]): TextMessage {
    var instance: TextMessage = {
      type: 'text',
      text: text
    };
    if (actions) {
      instance.actions = actions;
    }
    if (footerText) {
      instance.footerText = footerText;
    }
    if (headerText) {
      instance.headerText = headerText;
    }
    if (keywords) {
      instance.keywords = keywords;
    }
    return instance;
  }

  private static _baseActionObject<T extends BaseAction>(type: string, label?: string, imageUrl?: string | undefined): T {
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
   * @return A postbackActionObject.
   * @param label - label of the action.
   * @param imageUrl - image to show for the action.
   * @param postback - object or string to send as postback if action is taken.
   * @param keywords - array of keywords that can be used to trigger the postback action
   * @param skipAutoNumber - Boolean flag that can be used to exclude a postback action 
   * from auto-numbering. Only applicable when 'autoNumberPostbackActions' context variable or
   * 'autoNumberPostbackActions' component property is set to true.
   */
  public static postbackActionObject(label: string, imageUrl: string  | undefined, postback: string | object, keywords?: string[], skipAutoNumber?: boolean): PostbackAction {
    var instance = this._baseActionObject<PostbackAction>('postback', label, imageUrl);
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
   * Static utility method to create a url Action.  A label or an imageUrl is required.
   * @return A urlActionObject.
   * @param label - label of the action.
   * @param imageUrl - image to show for the action.
   * @param url - url to open if action is taken.
   */
  public static urlActionObject(label: string, imageUrl: string  | undefined, url: string): UrlAction {
    var instance = this._baseActionObject<UrlAction>('url', label, imageUrl);
    instance.url = url;
    return instance;
  }

  /**
   * Static utility method to create a call Action.  A label or an imageUrl is required.
   * @return A callActionObject.
   * @param label - label of the action.
   * @param imageUrl - image to show for the action.
   * @param phoneNumber - phoneNumber to call if action is taken.
   */
  public static callActionObject(label: string, imageUrl: string  | undefined, phoneNumber: string): CallAction {
    var instance = this._baseActionObject<CallAction>('call', label, imageUrl);
    instance.phoneNumber = phoneNumber;
    return instance;
  }

  /**
   * Static utility method to create a location Action.  A label or an imageUrl is required.
   * @return A locationActionObject.
   * @param label - label of the action.
   * @param imageUrl - image to show for the action.
   */
  public static locationActionObject(label?: string, imageUrl?: string): LocationAction {
    return this._baseActionObject<LocationAction>('location', label, imageUrl);
  }

  /**
   * Static utility method to create a share Action.  A label or an imageUrl is required.
   * @return A shareActionObject.
   * @param label - label of the action.
   * @param imageUrl - image to show for the action.
   */
  public static shareActionObject(label?: string, imageUrl?: string): ShareAction {
    return this._baseActionObject<ShareAction>('share', label, imageUrl);
  }

  /**
   * Static utility method to create a card object for CardConversationMessage
   * @return A Card.
   * @param title - The title of the card.
   * @param description - The description of the card.
   * @param imageUrl - URL of the image.
   * @param url - URL for a hyperlink of the card.
   * @param actions - A list of actions available for this card.
   */
  public static cardObject(title: string, description?: string, imageUrl?: string, url?: string, actions?: Action[]): Card {
    var instance: Card = {
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
   * Static utility method to create a CardConversationMessage
   * @return A CardConversationMessage.
   * @param layout - 'vertical' or 'horizontal'.  Whether to display the cards horizontally or vertically.  Default is vertical.
   * @param cards - The list of cards to be rendered.
   * @param actions - A list of actions for the cardConversationMessage.
   * @param footerText - The footerText to be added at the bottom of the message.
   * @param headerText - The headerText to be added at the top of the message.
   * @param keywords - A list of postback keywords that can be created with the postbackKeyword function
   */
  static cardConversationMessage(layout: 'vertical' | 'horizontal', cards: Card[], actions?: Action[], footerText?: string, headerText?: string, keywords?: Keyword[]): CardMessage {
    var response: CardMessage = {
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
    if (headerText) {
      response.headerText = headerText;
    }
    if (keywords) {
      response.keywords = keywords;
    }
    return response;
  }

  /**
   * Static utility method to create an AttachmentConversationMessage
   * @return An AttachmentConversationMessage.
   * @param type - type of attachment - file, image, video or audio.
   * @param url - the url of the attachment.
   * @param actions - A list of actions for the attachmentConversationMessage.
   * @param footerText - The footerText to be added at the bottom of the message.
   * @param headerText - The headerText to be added at the top of the message.
   * @param keywords - A list of postback keywords that can be created with the postbackKeyword function
   */
  static attachmentConversationMessage(type: 'file' | 'video' | 'audio' | 'image', url: string, actions?: Action[], footerText?: string, headerText?: string, keywords?: Keyword[]): AttachmentMessage {
    var attachment: Attachment = {
      type: type,
      url: url
    };
    var response: AttachmentMessage = {
      type: 'attachment',
      attachment: attachment
    };
    if (actions) {
      response.actions = actions;
    }
    if (footerText) {
      response.footerText = footerText;
    }
    if (headerText) {
      response.headerText = headerText;
    }
    if (keywords) {
      response.keywords = keywords;
    }
    return response;
  }

  /**
   * Static utility method to create a LocationConversationMessage
   * @return A LocationConversationMessage.
   * @param latitude - The latitude.
   * @param longitude - The longitude.
   * @param title - The title for the location.
   * @param url - A url for displaying a map of the location.
   * @param actions - A list of actions for the locationConversationMessage.
   */
  public static locationConversationMessage(latitude: number, longitude: number, title?: string, url?: string, actions?: Action[]): LocationMessage {
    var location: Location = {
      latitude: latitude,
      longitude: longitude
    };
    if (title) {
      location.title = title;
    }
    if (url) {
      location.url = url;
    }
    var response: LocationMessage = {
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
   * @return A PostbackConversationMessage.
   * @param postback - object or string to send as postback
   * @param label - The label associated with the postback.
   * @param actions - A list of actions for the postbackConversationMessage.
   */
  public static postbackConversationMessage(postback: object | string, label?: string, actions?: Action[]): PostbackMessage {
    var response: PostbackMessage = {
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
   * Static method to create a keyword for a postack payload that is not associated to a postback action button
   * @return A Keyword object.
   * @param keywords - array of keywords that can be used to trigger the postback action.
   * @param postback - object to send as postback if keyword is entered
   * @param skipAutoNumber - Boolean flag that can be used to exclude the keyword from autoNumbering
   */
  public static postbackKeyword(keywords: string[], postback: object | string, skipAutoNumber?: boolean): Keyword {
    var keyword: Keyword = {
      keywords: keywords,
      postback: postback,
      skipAutoNumber: skipAutoNumber || false
    };
    return keyword;
  }

  /**
   * Static utility method to create a RawConversationMessage
   * @return A RawConversationMessage.
   * @param payload - The raw (channel-specific) payload to send.
   */
  public static rawConversationMessage(payload): RawMessage {
    return {
      type: 'raw',
      payload: payload
    };
  }

  /**
   * Static method to add channel extensions to a payload object.
   * @return The message object with channel extensions.
   * @param message - The message, card or action object to add channel extensions to.
   * @param channel - The channel type ('facebook', 'webhook', etc) to set extensions on.
   * @param extensions - The channel-specific extensions to be added.
   */
  public static addChannelExtensions(messageObject: NonRawMessagePayload | Card | Action, channel: ChannelType, extensions: any): NonRawMessagePayload | Card | Action {
    if (messageObject && channel && extensions) {
      if (!messageObject.channelExtensions) {
        messageObject.channelExtensions = {};
      }
      messageObject.channelExtensions[channel] = (messageObject.channelExtensions[channel] ? Object.assign(messageObject.channelExtensions[channel], extensions) : extensions);
    }
    return messageObject;
  }

  /**
   * Static utility method to add global actions to a payload
   * @return A ConversationMessage with global actions.
   * @param message - The message to add global actions to.
   * @param globalActions - The global actions to be added.
   */
  public static addGlobalActions(message: NonRawMessagePayload, globalActions: Action[]): NonRawMessagePayload {
    if (message && globalActions) {
      message.globalActions = globalActions;
    }
    return message;
  }

  /**
   * Static utility method to validate a common ConversationMessage
   * @return true if valid; return Validation Error object (error & value) if invalid
   * @param payload - The payload object to be verified
   */
  public static validateConversationMessage(payload) {
    const result = CommonValidator.validate(MessageModelSchemaFactory, payload);
    if (result && !result.error) {
      return true;
    } else {
      return <any>result;
    }
  }

}
