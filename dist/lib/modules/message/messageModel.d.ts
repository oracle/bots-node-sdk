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
export declare class MessageModel {
    private _payload;
    private _messagePayload;
    private _validationError;
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
    constructor(payload: any);
    _parse(): void;
    /**
     * Retrieves the validated common message model payload.
     * @return {object} The common message model payload.
     */
    messagePayload(): any;
    /**
     * If messagePayload() returns null or if isValid() is false, this method can be used
     * to retrieve the payload that could not be converted to a Conversation Message Model payload.
     * @return {object} The payload which may not comply to Conversation Message Model
     */
    rawPayload(): any;
    /**
     * returns if the instance contains a valid message according to Conversation Message Model
     * @return {boolean} if the message is valid common message model.
     */
    isValid(): boolean;
    /**
     * Retrieves the validation error messages, if any.  Use if messagePayload() returns null or isValid() is false, signifying validation errors;
     * @return {object} The validation error(s) encountered when converting the payload to the Conversation Message Model.
     */
    validationError(): any;
    static _provideValidator(): void;
    static _parseLegacyChoice(payload: any): any;
    /**
     * Static utility method to create a TextConversationMessage
     * @return {object} A TextConversationMessage.
     * @param {string} text - The text of the message payload.
     * @param {object[]} [actions] - A list of actions related to the text.
     */
    static textConversationMessage(text: any, actions?: any): any;
    static _baseActionObject(type: any, label: any, imageUrl: any): any;
    /**
     * Static utility method to create a postback Action.  A label or an imageUrl is required.
     * @return {object} A postbackActionObject.
     * @param {string} [label] - label of the action.
     * @param {string} [imageUrl] - image to show for the action.
     * @param {object|string} postback - object or string to send as postback if action is taken.
     */
    static postbackActionObject(label: any, imageUrl: any, postback: any): any;
    /**
     * Static utility method to create a url Action.  A label or an imageUrl is required.
     * @return {object} A urlActionObject.
     * @param {string} [label] - label of the action.
     * @param {string} [imageUrl] - image to show for the action.
     * @param {string} url - url to open if action is taken.
     */
    static urlActionObject(label: any, imageUrl: any, url: any): any;
    /**
     * Static utility method to create a call Action.  A label or an imageUrl is required.
     * @return {object} A callActionObject.
     * @param {string} [label] - label of the action.
     * @param {string} [imageUrl] - image to show for the action.
     * @param {string} phoneNumber - phoneNumber to call if action is taken.
     */
    static callActionObject(label: any, imageUrl: any, phoneNumber: any): any;
    /**
     * Static utility method to create a location Action.  A label or an imageUrl is required.
     * @return {object} A locationActionObject.
     * @param {string} [label] - label of the action.
     * @param {string} [imageUrl] - image to show for the action.
     */
    static locationActionObject(label?: any, imageUrl?: any): any;
    /**
     * Static utility method to create a share Action.  A label or an imageUrl is required.
     * @return {object} A shareActionObject.
     * @param {string} [label] - label of the action.
     * @param {string} [imageUrl] - image to show for the action.
     */
    static shareActionObject(label: any, imageUrl?: any): any;
    /**
     * Static utility method to create a card object for CardConversationMessage
     * @return {object} A Card.
     * @param {string} title - The title of the card.
     * @param {string} [description] - The description of the card.
     * @param {string} [imageUrl] - URL of the image.
     * @param {string} [url] - URL for a hyperlink of the card.
     * @param {object[]} [actions] - A list of actions available for this card.
     */
    static cardObject(title: any, description?: any, imageUrl?: any, url?: any, actions?: any): any;
    /**
     * Static utility method to create a CardConversationMessage
     * @return {object} A CardConversationMessage.
     * @param {string} [layout] - 'vertical' or 'horizontal'.  Whether to display the cards horizontally or vertically.  Default is vertical.
     * @param {object[]} cards - The list of cards to be rendered.
     * @param {object[]} [actions] - A list of actions for the cardConversationMessage.
     */
    static cardConversationMessage(layout: any, cards: any, actions?: any): any;
    /**
     * Static utility method to create an AttachmentConversationMessage
     * @return {object} An AttachmentConversationMessage.
     * @param {string} type - type of attachment - file, image, video or audio.
     * @param {string} url - the url of the attachment.
     * @param {object[]} [actions] - A list of actions for the attachmentConversationMessage.
     */
    static attachmentConversationMessage(type: any, url: any, actions?: any): any;
    /**
     * Static utility method to create a LocationConversationMessage
     * @return {object} A LocationConversationMessage.
     * @param {number} latitude - The latitude.
     * @param {number} longitude - The longitude.
     * @param {string} [title] - The title for the location.
     * @param {string} [url] - A url for displaying a map of the location.
     * @param {object[]} [actions] - A list of actions for the locationConversationMessage.
     */
    static locationConversationMessage(latitude: any, longitude: any, title?: any, url?: any, actions?: any): any;
    /**
     * Static utility method to create a postackConversationMessage
     * @return {object} A PostbackConversationMessage.
     * @param {object|string} postback - object or string to send as postback
     * @param {string} [label] - The label associated with the postback.
     * @param {object[]} [actions] - A list of actions for the postbackConversationMessage.
     */
    static postbackConversationMessage(postback: any, label?: any, actions?: any): any;
    /**
     * Static utility method to create a RawConversationMessage
     * @return {object} A RawConversationMessage.
     * @param {object} payload - The raw (channel-specific) payload to send.
     */
    static rawConversationMessage(payload: any): {
        type: string;
        payload: any;
    };
    /**
     * Static utility method to add channel extensions to a payload
     * @return {object} A ConversationMessage with channel extensions.
     * @param {object} message - The message to add channel extensions to.
     * @param {string} channel - The channel type ('facebook', 'webhook', etc) to set extensions on
     * @param {object} extensions - The channel-specific extensions to be added.
     */
    static addChannelExtensions(message: any, channel: any, extensions: any): any;
    /**
     * Static utility method to add global actions to a payload
     * @return {object} A ConversationMessage with global actions.
     * @param {object} message - The message to add global actions to.
     * @param {object} globalActions - The global actions to be added.
     */
    static addGlobalActions(message: any, globalActions: any): any;
    /**
     * Static utility method to validate a common ConversationMessage
     * @return {boolean|object} true if valid; return Validation Error object (error & value) if invalid
     * @param {object} payload - The payload object to be verified
     */
    static validateConversationMessage(payload: any): any;
}
