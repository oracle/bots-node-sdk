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
 * @alias MessageModel
 * @deprecated Use MessageFactory instead
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
   * @param {string} [headerText] - The headerText to be added at the top of the message.
   * @param {object[]} [keywords] - A list of postback keywords that can be created with the postbackKeyword function
   */
  static textConversationMessage(text, actions, footerText, headerText, keywords) {
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
    if (headerText) {
      instance.headerText = headerText;
    }
    if (keywords) {
      instance.keywords = keywords;
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
   * @param {string} [headerText] - The headerText to be added at the top of the message.
   * @param {object[]} [keywords] - A list of postback keywords that can be created with the postbackKeyword function
   */
  static cardConversationMessage(layout, cards, actions, footerText, headerText, keywords) {
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
    if (headerText) {
      response.headerText = headerText;
    }
    if (keywords) {
      response.keywords = keywords;
    }
    return response;
  }

  /**
   * Static method to create a TableHeaderColumn object.
   * @return {object} A TableHeaderColumn object.
   * @param {string} [label] - The label of the column header
   * @param {integer} [width] - The width of the column header (optional)
   * @param {string} [alignment] - The alignment of the column header label (left, right or center, defaults to left)
   */
  static tableHeaderColumn(label, width, alignment) {
    var response = {
      label: label,      
      alignment: alignment || 'left'
    };
    if (width) {
      response.width = width;
    }
    return response;
  }

  /**
   * Static method to create a TableColumn object.
   * @return {object} A TableColumn object.
   * @param {object} [value] - The value of the column
   * @param {string} [alignment] - The alignment of the column value (left, right or center, defaults to left)
   * @param {string} [displayType] - The display type (text or link, defaults to text)
   * @param {string} [linkLabel] - The label used when the displayType is set to 'link'.
   */
  static tableColumn(value, alignment, displayType, linkLabel) {
    var response = {
      alignment: alignment || 'left',
      displayType: displayType || 'text'
    };
    if (value) {
      response.value = value;
    }
    if (linkLabel) {
      response.linkLabel = linkLabel;
    }
    return response;
  }

  /**
   * Static method to create a FormField object.
   * @return {object} A FormField object.
   * @param {string} [label] - The label of the form field
   * @param {object} [value] - The value of the field
   * @param {string} [displayType] - The display type (text or link, defaults to text)
   * @param {string} [linkLabel] - The label used when the displayType is set to 'link'.
   */
  static formField(label, value, displayType, linkLabel) {
    var response = {
      label: label,
      displayType: displayType || 'text'
    };
    if (value) {
      response.value = value;
    }
    if (linkLabel) {
      response.linkLabel = linkLabel;
    }
    return response;
  }

  /**
   * Static method to create a TableRow object.
   * @return {object} A TableRow object.
   * @param {object[]} [columns] - The columns in the row, can be created with tableColumn function
   */
  static tableRow(columns) {
    var response = {
      fields: columns 
    };
    return response;
  }

  /**
   * Static method to create a Form object.
   * @return {object} A Form object.
   * @param {object[]} [fields] - The fields in the form, can be created with formField function
   * @param {string} [title] - The title of the form object
   * @param {object[]} [actions] - A list of actions added to the form
   */
  static form(fields, title, actions) {
    var response = {
      fields: fields 
    };
    if (title) {
      response.title = title;
    }
    if (actions) {
      response.actions = actions;
    }
    return response;
  }

  /**
   * Static method to create a PaginationInfo object.
   * @return {object} A PaginationInfo object.
   * @param {integer} [totalCount] - The total number of items that are paginated
   * @param {integer} [rangeSize] - The number of items shown at once
   * @param {integer} [rangeStart] - The current range start index within the list of items
   * @param {string} [status] - Pagination status message
   */
  static paginationInfo(totalCount, rangeSize, rangeStart, status) {
    var response = {
      totalCount: totalCount,
      rangeSize: rangeSize,
      rangeStart: rangeStart
    };
    if (status) {
      response.status = status;
    } 
    return response;
  }

  /**
   * Static method to create a TableConversationMessage.
   * @return {object} A TableConversationMessage.
   * @param {object[]} [headings] - The table header columns, can be created with tableHeaderColumn function
   * @param {object[]} [rows] - The table rows, can be created with tableRow function
   * @param {object[]} [paginationInfo] - The pagination info, can be created with the paginationInfo function
   * @param {object[]} [actions] - A list of actions added to the message
   * @param {string} [footerText] - The footerText to be added at the bottom of the message.
   * @param {string} [headerText] - The headerText to be added at the top of the message.
   * @param {object[]} [keywords] - A list of postback keywords that can be created with the postbackKeyword function
   */
  static tableConversationMessage(headings, rows, paginationInfo, actions, footerText, headerText, keywords) {
    var response = {
      type: 'table',
      headings: headings || [],
      rows: rows || []
    };
    if (paginationInfo) {
      response.paginationInfo = paginationInfo;
    } else {
      // default to no pagination
      let count = (rows || []).length
      response.paginationInfo = this.paginationInfo(count, count, 0);
    }
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
   * Static method to create a FormConversationMessage.
   * @return {object} A FormConversationMessage.
   * @param {object[]} [forms] - The list of forms, can be created with form function
   * @param {integer} [formColumns] - The number of columns used in the form layout, defaults to 1
   * @param {object[]} [paginationInfo] - The pagination info, can be created with the paginationInfo function
   * @param {object[]} [actions] - A list of actions added to the message
   * @param {string} [footerText] - The footerText to be added at the bottom of the message.
   * @param {string} [headerText] - The headerText to be added at the top of the message.
   * @param {object[]} [keywords] - A list of postback keywords that can be created with the postbackKeyword function
   */
  static formConversationMessage(forms, formColumns, paginationInfo, actions, footerText, headerText, keywords) {
    var response = {
      type: 'form',
      forms: forms,
      formColumns: formColumns || 1
    };
    if (paginationInfo) {
      response.paginationInfo = paginationInfo;
    } else {
      // default to no pagination
      let count = (forms || []).length
      response.paginationInfo = this.paginationInfo(count, count, 0);
    }
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
   * Static method to create a TableFormConversationMessage.
   * @return {object} A TableFormConversationMessage.
   * @param {object[]} [headings] - The table header columns, can be created with tableHeaderColumn function
   * @param {object[]} [rows] - The table rows, can be created with tableRow function
   * @param {object[]} [forms] - The list of forms, can be created with form function
   * @param {integer} [formColumns] - The number of columns used in the form layout, defaults to 1
   * @param {string} [showFormButtonLabel] - The label used for the button to open the form when the form is displayed in a dialog (Slack only) 
   * @param {object[]} [paginationInfo] - The pagination info, can be created with the paginationInfo function
   * @param {object[]} [actions] - A list of actions added to the message
   * @param {string} [footerText] - The footerText to be added at the bottom of the message.
   * @param {string} [headerText] - The headerText to be added at the top of the message.
   * @param {object[]} [keywords] - A list of postback keywords that can be created with the postbackKeyword function
   */
  static tableFormConversationMessage(headings, rows, forms, formColumns, showFormButtonLabel, paginationInfo, actions, footerText, headerText, keywords) {
    var response = {
      type: 'tableForm',
      headings: headings,
      rows: rows,
      forms: forms,
      formColumns: formColumns || 1,
      paginationInfo: paginationInfo
    };
    if (paginationInfo) {
      response.paginationInfo = paginationInfo;
    } else {
      // default to no pagination
      let count = (rows || []).length
      response.paginationInfo = this.paginationInfo(count, count, 0);
    }
    if (showFormButtonLabel) {
      response.showFormButtonLabel = showFormButtonLabel;
    }
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
   * Static method to create an AttachmentConversationMessage
   * @return {object} An AttachmentConversationMessage.
   * @param {string} type - type of attachment - file, image, video or audio.
   * @param {string} url - the url of the attachment.
   * @param {object[]} [actions] - A list of actions for the attachmentConversationMessage.
   * @param {string} [footerText] - The footerText to be added at the bottom of the message.
   * @param {string} [headerText] - The headerText to be added at the top of the message.
   * @param {object[]} [keywords] - A list of postback keywords that can be created with the postbackKeyword function
   */
  static attachmentConversationMessage(type, url, actions, footerText, headerText, keywords) {
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
    if (headerText) {
      response.headerText = headerText;
    }
    if (keywords) {
      response.keywords = keywords;
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
   * Static method to create a keyword for a postack payload that is not associated to a postback action button
   * @return {object} A Keyword object.
   * @param {string[]} [keywords] - array of keywords that can be used to trigger the postback action.
   * @param {object|string} postback - object to send as postback if keyword is entered
   * @param {boolean} [skipAutoNumber] - Boolean flag that can be used to exclude the keyword from autoNumbering
   */
  static postbackKeyword(keywords, postback, skipAutoNumber) {
    var keyword = {
      keywords: keywords,
      postback: postback,
      skipAutoNumber: skipAutoNumber || false
    };
    return keyword;
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
   * @return {object} The message object with channel extensions.
   * @param {object} message - The message, card or action object to add channel extensions to.
   * @param {string} channel - The channel type ('facebook', 'webhook', etc) to set extensions on.
   * @param {object} extensions - The channel-specific extensions to be added.
   */
  static addChannelExtensions(messageObject, channel, extensions) {
    if (messageObject && channel && extensions) {
      if (!messageObject.channelExtensions) {
        messageObject.channelExtensions = {};
      }
      messageObject.channelExtensions[channel] = (messageObject.channelExtensions[channel] ? Object.assign(messageObject.channelExtensions[channel], extensions) : extensions);
    }
    return messageObject;
  }

  /**
   * Static method to add global actions to a message payload object. This method replaces any existing global actions.
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
   * Static method to add a global action to a message payload object. 
   * @return {object} A ConversationMessage with global actions.
   * @param {object} message - The message to add the global action to.
   * @param {object} globalAction - The global action to be added.
   */
  static addGlobalAction(message, globalAction) {
    let globalActions = message.globalActions || [];
    globalActions.push(globalAction);
    message.globalActions = globalActions;
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