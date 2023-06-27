import { BaseContext } from './baseContext';
import { MessageModel } from '../message/messageModel';
import ComponentRequestSchemaFactory = require('./schema/componentRequestSchema');
import { ComponentRequestBody } from './request';

// fix for MIECS-23476, we need to return "2.0" until all customers have migrated to 20.05 which
// no longer checks whether version returned is a valid platform version
// const sdkVersion = '2.0';
const sdkVersion = require('../../../package.json').version;

export interface CustomComponentResponse {
  platformVersion: string;
  context: any,
  action?: string,
  keepTurn?: boolean,
  transition?: boolean,
  error?: boolean,
  modifyContext?: boolean
  messages?: any[];
  callbackToken?: string;
}

// Response template
const RESPONSE: CustomComponentResponse = {
  platformVersion: undefined,
  context: undefined,
  action: undefined,
  keepTurn: true,
  transition: false,
  error: false,
  modifyContext: false,
};

// Variable types supported by the dialog engine
const CONST = {
  SYSTEM_INVALID_USER_INPUT: 'system.invalidUserInput'
};

/**
 * The Bots JS SDK exports a class that wraps an invocation to the custom component.
 * Create it with the request payload (as an object) that was used to invoke
 * the component.
 *
 * It offers a friendlier interface to reading context for the invocation
 * as well as changing variables and sending results back to the diaog engine.
 */
export class CustomComponentContext extends BaseContext {

  /**
   * Retrieves the sdk version.
   * @return {string} The sdk version.
   */
  static sdkVersion() {
    return sdkVersion;
  }

  /**
   * @param {object} requestBody - The request body
   */
  constructor(request: ComponentRequestBody) {
    // Initilize the response, filling in platformVersion, context/vars
    // from the incoming request as needed.
    const response: CustomComponentResponse = Object.assign({}, RESPONSE, { platformVersion: request.platformVersion });
    super(request, response, ComponentRequestSchemaFactory);

    // Reset system.invalidUserInput variable if set to true.  Requested by runtime to do this in sdk
    this._resetInvalidUserInput();
  }

  /**
   * Retrieves the request body.
   * @return {object} The request body.
   */
  request() {
    return super.getRequest();
  }

  /**
   * Retrieves the bot id.
   * @return {string} The bot id.
   */
  botId() {
    return this.request().botId;
  }

  /**
   * Retrieves the platform version of the request.
   * @return {string} The platform version.
   */
  platformVersion() {
    return this.request().platformVersion;
  }

  /**
   * Retrieves the raw payload of the current input message.
   * @return {object} The raw payload.
   */
  rawPayload() {
    return this.request().message.payload;
  }

  /**
   * Retrieves the payload of the current input message in the common message format.
   * @return {object} The common message payload.
   */
  messagePayload() {
    return this.request().message.messagePayload;
  }

  /**
   * Retrieves the payload of the current input message. For backward compatibility purposes.
   * However, the payload returned may be in the new message format.
   * @return {object} The message payload.
   * @deprecated to be removed in favor of rawPayload() and messagePayload()
   * @private
   */
  payload() {
    this.logger().warn('conversation SDK payload() is deprecated in favor of messagePayload()');
    return this.rawPayload();
  }

  /**
   * Retrieves the channel type of the current input message.
   * @return {string} The channel type - facebook, webhook, test, etc.
   */
  channelType(): string {
    return this.request().message.channelConversation.type;
  }

  /**
   * Retrieves the channel Id of the current input message.
   * @return {string} The channel id.
   */
  channelId(): string {
    return this.request().message.channelConversation.channelId;
  }

  /**
   * Retrieves the userId for the current input message.
   * @return {string} The userId.
   */
  userId(): string {
    return this.request().message.channelConversation.userId;
  }

  /**
   * Retrieves the sessionId for the current input message.
   * @return {string} The sessionId.
   */
  sessionId(): string {
    return this.request().message.channelConversation.sessionId;
  }

  // retrieve v1.0 facebook postback
  _postback10() {
    const rawPayload = this.rawPayload();
    if (rawPayload && this.channelType() === 'facebook') {
      if (rawPayload.hasOwnProperty('postback') && rawPayload.postback.hasOwnProperty('payload')) {
        return rawPayload.postback.payload;
      }
    }
    return null;
  }

  /**
   * Retrieves the postback of the current input message.
   * If the input message is not a postback, this will return null.
   * @return {object} The postback payload.
   */
  postback() {
    let postback = null;

    const messagePayload = this.messagePayload();
    if (messagePayload && messagePayload.postback) {
      postback = messagePayload.postback;
    }
    if (!postback) {
      postback = this._postback10();
    }
    return postback;
  }

  // return v1.0 facebook text and quick_reply text
  _text10() {
    const rawPayload = this.rawPayload();
    if (rawPayload && this.channelType() === 'facebook') {
      if (rawPayload.hasOwnProperty('message')) {
        if (rawPayload.message.hasOwnProperty('quick_reply') && rawPayload.message.quick_reply.hasOwnProperty('payload')) {
          return rawPayload.message.quick_reply.payload;
        } else if (rawPayload.message.hasOwnProperty('text')) {
          return rawPayload.message.text;
        }
      }
    }
    return null;
  }

  /**
   * Retrieves the text of the current input message.
   * Eventually not all messages will have a text value, in which case
   * this will return null.
   * @return {string} The text of the input message.
   */
  text() {
    let text = null;

    const messagePayload = this.messagePayload();
    if (messagePayload) {
      if (messagePayload.text) {
        text = messagePayload.text;
      } else {
        const postback = this.postback();
        if (postback && typeof postback === 'string') {
          text = postback;
        }
      }
    }
    if (!text) {
      text = this._text10();
    }
    return text;
  }

  /**
   * Retrieves the attachment of the current input message.
   * If the input message is not an attachment, this will return null.
   * @return {object} The attachment.
   */
  attachment() {
    let attachment = null;

    const messagePayload = this.messagePayload();
    if (messagePayload && messagePayload.attachment) {
      attachment = messagePayload.attachment;
    }
    return attachment;
  }

  /**
   * Retrieves the location of the current input message.
   * If the input message does not contain a location, this will return null.
   * @return {object} The attachment.
   */
  location() {
    let location = null;

    const messagePayload = this.messagePayload();
    if (messagePayload && messagePayload.location) {
      location = messagePayload.location;
    }
    return location;
  }

  /**
   * Retrieves the properties defined for the current state.
   * @return {object} The properties
   */
  properties() {
    return this.request().properties || {};
  }

  /**
   * Returns the MessageModel class for creating or validating messages to or from bots.
   *
   * @return {MessageModel} The MessageModel class
   * @deprecated Use getMessageFactory() instead
   */
  MessageModel(): typeof MessageModel {
    return super.getMessageModel();
  }

  /**
   * Sets the action to return from this component, which will determine the
   * next state in the dialog.
   *
   * @param {string} a - action name
   * @deprecated to be removed in favor of transition(action)
   * @private
   */
  action(a) {
    this.logger().warn('conversation SDK action() is deprecated in favor of transition(action)');
    if (a === undefined) {
      return this.response().action;
    }

    this.response().action = a;
    return this;
  }

  /**
   * Call this method if the input is not understood, and this would allow the bots runtime to
   * handle the issue.  The bots runtime may just display the message to the user and execute the same component again, or
   * it may try to interpret the input and process differently.
   * @param {object|string|MessageModel} [r] - optional payload to be sent to user.  payload could also be a string for text response
   */
  invalidUserInput(r) {
    this.variable(CONST.SYSTEM_INVALID_USER_INPUT, true);
    this.reply(r || 'Input not understood.  Please try again');
    return this;
  }

  _resetInvalidUserInput() {
    if (this.variable(CONST.SYSTEM_INVALID_USER_INPUT) === true) {
      this.variable(CONST.SYSTEM_INVALID_USER_INPUT, false);
    }
  }

  /**
   * Set "exit" to true when your component has replies it wants to send to
   * the client.
   *
   * The SDK's "reply" function automatically sets "exit" to true, but
   * if you manually modify the response to send replies then you will need
   * to set this explicitly.
   *
   * @deprecated to be removed in favor of keepTurn(boolean)
   * @private
   */
  exit(e) {
    this.logger().warn('conversation SDK exit() is deprecated in favor of keepTurn(boolean)');
    this.response().keepTurn = !e;
    return this;
  }

  /**
   * "keepTurn" is used to indicate if the Bot/component should send the next replies, or
   * or if the Bot/component should wait for user input (keepTurn = false).
   *
   * The SDK's "reply" function automatically sets "keepTurn" to false.
   * @param {boolean} [k] - whether to keep the turn for sending more replies
   */
  keepTurn(k?) {
    this.response().keepTurn = (typeof k === 'undefined' ? true : !!k);
    return this;
  }

  /**
   * "releaseTurn" is the shorthand for keepTurn(false)
   * @param {boolean} [k] - whether to keep the turn for sending more replies
   */
  releaseTurn(k?) {
    this.response().keepTurn = (typeof k === 'undefined' ? false : !k);
    return this;
  }

  /**
  * Set "done" to true when your component has completed its logic and
  * the dialog should transition to the next state.
  *
  * This is only meaningful when you are sending replies (ie you have also
  * set "exit" to true).  If you are not sending replies ("exit" is false,
  * the default) then "done" is ignored; the dialog always moves to the next
  * state.
  *
  * If "exit" is true (replies are being sent), then leaving "done" as false
  * (the default) means the dialog will stay in this state after sending
  * the replies, and subsequent user input will come back to this component.
  * This allows a component to handle a series of interactions within itself,
  * however the component is responsible for keeping track of its own state
  * in such situations.
  *
  * Setting "done" to true will transition to the next state/component after
  * sending the replies.
  *
  * @deprecated to be removed in favor of transition()
  * @private
  */
  done(d) {
    this.logger().warn('conversation SDK done() is deprecated in favor of transition()');
    this.response().transition = !!d;
    return this;
  }

  /**
  * Call "transition()" when your component has completed its logic and
  * the dialog should transition to the next state, after replies (if any) are sent.
  *
  * If transition() is not called, the dialog will stay in this state after sending
  * the replies (if any), and subsequent user input will come back to this component.
  * This allows a component to handle a series of interactions within itself,
  * however the component is responsible for keeping track of its own state
  * in such situations.
  *
  * @param {string} [t] - outcome of component
  * transition() will cause the dialog to transition to the next state.
  * transition(outcome) will set te outcome of the component that would be used to
  * determine the next state to transition to.
  *
  */
  transition(t?) {
    this.response().transition = true;
    if (typeof t !== 'undefined') {
      this.response().action = t;
    }
    return this;
  }

  /**
  * Sets the error flag on the response.
  * @param {boolean} e - sets error if true
  */
  error(e) {
    this.response().error = !!e;
    return this;
  }

  /**
   * Adds a reply to be sent back to the user. May be called multiple times to send multiple replies in a given response.
   * Automatically sets the <code>keepTurn</code> as false.
   * </p>
   * @param {object} payload - can take a string message, a message created by the MessageFactory, or a message created by
   * the deprecated MessageModel.
   * @param {object} [channelConversation] - to override the default channelConversation from request
   * @returns the message payload in JSON format
   */
  reply(payload, channelConversation?): this {
    const response: any = {
      tenantId: this.request().message.tenantId,
      channelConversation: channelConversation || Object.assign({}, this.request().message.channelConversation)
    };
    const messagePayload =  super.constructMessagePayload(payload);
    if (messagePayload) {
      response.messagePayload = messagePayload;
    } else {
      // is invalid raw message payload, keep for backwards compatibility
      const rawMessagePayload = MessageModel.rawConversationMessage(payload);
      const messageModel = new MessageModel(rawMessagePayload);
      response.payload = messageModel.rawPayload();
    }

    this.response().messages = this.response().messages || [];
    this.response().messages.push(response);

    // "keepTurn" false which signals to the engine to send replies and wait for user input
    this.keepTurn(false);

    return this;
  }


  // The HTTP response body
  response(): CustomComponentResponse {
    return super.getResponse();
  }

  // BUGBUG: workaround for https://jira.oraclecorp.com/jira/browse/MIECS-2748
  resolveVariable(variable) {
    return variable.startsWith('${') ? null : variable;
  }

  /**
  * When expecting an out of band conversation continuation, such as a
  * user following the OAuth flow, completing a form and hitting submit, or
  * a human support agent or other third party sending a message, issue a
  * limited use token to allow calling back into Bots via the generic callback
  * endpoint.
  * The provided token should be a UUID or other unique and random number.  By setting it
  * here in the response the Bot will await a reply with that token and use it to
  * thread the message back into the current conversation with that user.
  * @param {string} callbackToken - token generated by you to allow reauthentication back into this conversation.
  * Should be unique, like userId + random.  It is ok to reissue the same token for the same conversation.
  * @private
  */
  setCallbackToken(callbackToken) {
    this.response().callbackToken = (typeof callbackToken === 'undefined' ? null : callbackToken);
    return this;
  }
}
