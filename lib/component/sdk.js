"use strict";

const { MessageModel } = require("../message/messageModel");
const { CommonProvider } = require("../../common/provider");
const { CommonValidator } = require("../../common/validator");
const { ERROR } = require("../../common/error");
const ComponentRequestSchemaFactory = require("./schema/componentRequestSchema");

const sdkVersion = '1.1'; //server compatibility version

// Response template
const RESPONSE = {
  platformVersion: undefined,
  context: undefined,
  action: undefined,
  keepTurn: true,
  transition: false,
  error: false,
  modifyContext: false
};

const VARIABLE = {
  type: "string",
  entity: false
};

// Variable types supported by the dialog engine
// const PRIMITIVE_TYPES = ['int', 'float', 'double', 'boolean', 'string', 'map', 'list'];
const NLPRESULT_TYPE = 'nlpresult';

/**
 * Wrapper object for accessing nlpresult
 */
const NLPResult = class {
  constructor(nlpresult) {
    this._nlpresult = nlpresult;
  }

  /**
   * Returns matches for the specified entity; may be an empty collection.
   * If no entity is specified, returns the map of all entities.
   * @param {string} [entity] - name of the entity
   * @return {object} The entity match result.
   */
  entityMatches(entity) {
    if (!this._nlpresult) {
      return entity === undefined ? {} : [];
    }

    if (entity === undefined) {
      // Retrieving entityMatches collection, or an empty collection if none
      return this._nlpresult.entityMatches ? this._nlpresult.entityMatches : {};
    } else {
      if (this._nlpresult.entityMatches) {
        return this._nlpresult.entityMatches[entity] ? this._nlpresult.entityMatches[entity] : [];
      } else {
        return [];
      }
    }
  }

  /**
   * Returns intent matches if any.
   * Intent matches are returned in descending order of score,
   * @return {object[]} The intent match results, each match with properties score and intent.
   */
  intentMatches() {
    if (!this._nlpresult) {
      return [];
    }
    if (this._nlpresult.intentMatches && Array.isArray(this._nlpresult.intentMatches.summary) && this._nlpresult.intentMatches.summary.length > 0) {
      return this._nlpresult.intentMatches.summary;
    } else {
      logger().info('nlpResult structure', this._nlpResult);
      throw new Error('Unexpected nlpResult structure');
    }
  }

  /**
   * Returns top intent match (with highest score), if any.
   * @return {object} The top intent match (with properties score and intent)
   */
  topIntentMatch() {
    var intentMatches = this.intentMatches();
    return (intentMatches && intentMatches.length > 0 ? intentMatches[0] : {});
  }

  query() {
    return (this._nlpresult ? this._nlpresult.query : "");
  }

};

/**
 * The Bots Node SDK exports a class that wraps an invocation to the custom component.
 * Create it with the request payload (as an object) that was used to invoke
 * the component.
 * <p/>
 * It offers a friendlier interface to reading context for the invocation
 * as well as changing variables and sending results back to the dialog engine.
 * @memberof module:Lib
 */
const ComponentInvocation = class {
  /**
   * @constructor
   * @param {object} requestBody - The request body
   */
  constructor(requestBody) {
    const validationResult = validateRequestBody(requestBody);
    if (validationResult.error) {
      let err = new Error('Request body malformed');
      err.name = 'badRequest';
      err.details = createErrorDetails('Request body malformed',
        JSON.stringify(validationResult.error),
        'BOTS-1000', {
          requestBody: requestBody
        });
      throw err;
    }

    this._request = requestBody; // cache a ref to the request body

    // Initilize the response, filling in platformVersion, context/vars
    // from the incoming request as needed.
    this._response = Object.assign({}, RESPONSE);
    this._response.platformVersion = this._request.platformVersion;
    this._response.context = Object.assign({}, this._request.context);
    this._response.context.variables = this._response.context.variables || {};
  }

  /**
   * Retrieves the request body.
   * @return {object} The request body.
   */
  request() {
    return this._request;
  }

  /**
   * Retrieves the bot id.
   * @return {string} The bot id.
   */
  botId() {
    return this.request().botId;
  }

  /**
   * Retrieves the sdk version.
   * @return {string} The sdk version.
   */
  static sdkVersion() {
    return sdkVersion;
  }

  /**
   * Retrieves the platform version of the request.
   * @return {string} The platform version.
   */
  platformVersion() {
    return this.request().platformVersion;
  }

  /**
   * Retrieves the logger so the component can use the shared logger for logging.  The shared logger 
   * should support the methods log, info, warn, error and trace.
   * @return {object} The logger().
   */
  logger() {
    return logger();
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

  /* Do not show on jsdoc, show deprecation warning instead  
   * Retrieves the payload of the current input message. For backward compatibility purposes.  
   * However, the payload returned may be in the new message format.
   * @return {object} The message payload.
   * @deprecated to be removed in favor of rawPayload() and messagePayload()
   */
  payload() {
    logger().warn("conversation SDK payload() is deprecated in favor of messagePayload()"); 
    return this.rawPayload();
  }

  /**
   * Retrieves the channel type of the current input message.
   * @return {string} The channel type - facebook, webhook, test, etc.
   */
  channelType() {
    return this.request().message.channelConversation.type;
  }

  /**
   * Retrieves the userId for the current input message.
   * @return {string} The userId.
   */
  userId() {
    return this.request().message.channelConversation.userId;
  }

  /**
   * Retrieves the sessionId for the current input message.
   * @return {string} The sessionId.
   */
  sessionId() {
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
    logger().info('SDK: Retrieving request postback=' + postback);
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
        var postback = this.postback();
        if (postback && typeof postback === 'string') {
          text = postback;
        }
      }
    }
    if (!text) {
      text = this._text10();
    }
    logger().info('SDK: Retrieving request text=' + text);
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
    logger().info('SDK: Retrieving request attachment=' + attachment);
    return attachment;
  }

  /**
   * Retrieves the location of the current input message.
   * If the input message does not contain a location, this will return null.
   * @return {object} The location.
   */
  location() {
    let location = null;

    const messagePayload = this.messagePayload();
    if (messagePayload && messagePayload.location) {
      location = messagePayload.location;
    }
    logger().info('SDK: Retrieving request location=' + location);
    return location;
  }

  /**
   * Retrieves the properties defined for the current state.
   * @return {object} The properties
   */
  properties() {
    return this.request().properties;
  }

  /**
   * Read or write variables defined in the current flow.
   * It is not possible to change the type of an existing variable through
   * this method.  It is the caller's responsibility to ensure that the
   * value being set on a variable is of the correct type. (e.g. entity,
   * string or other primitive, etc).
   * <p/>
   * A new variable can be created.  However, since the variable is not
   * defined in the flow, using it in the flow subsequently may be flagged
   * for validation warnings.
   * <p/>
   * This function takes a variable number of arguments.
   * <p/>
   * The first form:
   * variable(name);
   * reads the variable called "name", returning its value.
   * The name could be in the form of <scope>.<variableName>.  For example, a variable firstName in the
   * profile scope needs to be retrieved as variable("profile.firstName").
   * <p/>
   * The second form:
   * variable(name, value);
   * writes the value "value" to the variable called "name".
   *
   * @param {string}  name - The name of variable to be set or read
   * @param {string} [value] - value to be set for variable
   * @example
   *  let firstName = conversation.variable("profile.firstName");
   *  let lastName = conversation.variable("profile.lastName");
   *  conversation.variable("fullName", firstName + ' ' + lastName);
   */
  variable(name, value) {

    var context = this._response.context;
    var scopeName = null;
    var nameToUse = name;
    var index = name.indexOf(".");

    if (index > -1) {
      scopeName = name.substring(0, index);
      var possibleScope = context;
      while (possibleScope) {
        if (possibleScope.scope === scopeName) {
          context = possibleScope;
          nameToUse = name.substring(index + 1, name.length);
          break;
        } else {
          //this is to handle the case when the variable name is system.XXX but system is not a scope 
          if (possibleScope.variables.hasOwnProperty(nameToUse)) {
            context = possibleScope;
            break;
          }
          possibleScope = possibleScope.parent;
        }
      }
    }

    if (value === undefined) {
      if (!context.variables || !context.variables.hasOwnProperty(nameToUse)) {
        return undefined;
      }
      return context.variables[nameToUse].value;
    } else {
      logger().info('SDK: About to set variable ' + name);

      if (!context.variables) {
        context.variables = {};
      }
      if (!context.variables[nameToUse]) {
        logger().info('SDK: Creating new variable ' + nameToUse);
        context.variables[nameToUse] = Object.assign({}, VARIABLE);
      }

      context.variables[nameToUse].value = value;
      this._response.modifyContext = true;

      logger().info('SDK: Setting variable ' + JSON.stringify(context.variables[nameToUse]));
      return this;
    }
  }

  /**
   * Returns the MessageModel class for creating or validating messages to or from bots.
   *
   * @return {MessageModel} The MessageModel class
   */
  MessageModel() {
    return MessageModel;
  }

  /**
   * Returns an NLPResult helper object for working with nlpresult variables.
   * See the NLPResult documentation for more information.
   * <p/>
   * You may specify a particular nlpresult by name (if you have multiple
   * nlpresult variables defined in the flow), or omit the name if you
   * only have 1 nlpresult.
   *
   * @param {string} [nlpVariableName] - variable to be given the nlpResult
   * @return {NLPResult} The nlp resolution result.
   */
  nlpResult(nlpVariableName) {
    if (nlpVariableName === undefined) {
      for (let name in this._response.context.variables) {
        if (this._response.context.variables[name].type === NLPRESULT_TYPE) {
          logger().info('SDK: using implicitly found nlpresult=' + name);
          nlpVariableName = name;
          break;
        }
      }
      if (nlpVariableName === undefined) {
        throw new Error('SDK: no nlpresult variable present');
      }
    }

    const nlpVariable = this.variable(nlpVariableName);

    if (nlpVariable === undefined) {
      throw new Error('SDK: undefined var=' + nlpVariableName);
    }

    if (this._response.context.variables[nlpVariableName].type !== NLPRESULT_TYPE) {
      throw new Error('SDK: var=' + nlpVariableName + ' not of type nlpresult');
    }

    return new NLPResult(nlpVariable);
  }

  /* Do not show on jsdoc, show deprecation warning instead  
   * Sets the action to return from this component, which will determine the
   * next state in the dialog.
   *
   * @param {string} a - action name
   * @deprecated to be removed in favor of transition(action)
   */
  action(a) {
    logger().warn("conversation SDK action() is deprecated in favor of transition(action)"); 
    if (a === undefined) {
      return this._response.action;
    }

    this._response.action = a;
    return this;
  }

  /* Do not show on jsdoc, show deprecation warning instead 
   * Set "exit" to true when your component has replies it wants to send to
   * the client.
   * <p/>
   * The SDK's "reply" function automatically sets "exit" to true, but
   * if you manually modify the response to send replies then you will need
   * to set this explicitly.
   *
   * @deprecated to be removed in favor of keepTurn(boolean)
   */
  exit(e) {
    logger().warn("conversation SDK exit() is deprecated in favor of keepTurn(boolean)"); 
    this._response.keepTurn = !e;
    return this;
  }

  /**
   * "keepTurn" is used to indicate if the Bot/component should send the next replies, or
   * or if the Bot/component should wait for user input (keepTurn = false).
   * <p/>
   * The SDK's "reply" function automatically sets "keepTurn" to false.
   * @param {boolean} [k] - whether to keep the turn for sending more replies
   */
  keepTurn(k) {
    this._response.keepTurn = (typeof k === "undefined" ? true : !!k);
    return this;
  }

  /**
   * "releaseTurn" is the shorthand for keepTurn(false)
   * @param {boolean} [k] - whether to keep the turn for sending more replies
   */
  releaseTurn(k) {
    this._response.keepTurn = (typeof k === "undefined" ? false : !k);
    return this;
  }

  /* Do not show on jsdoc, show deprecation warning instead  
   * Set "done" to true when your component has completed its logic and
   * the dialog should transition to the next state.
   * <p/>
   * This is only meaningful when you are sending replies (ie you have also
   * set "exit" to true).  If you are not sending replies ("exit" is false,
   * the default) then "done" is ignored; the dialog always moves to the next
   * state.
   * <p/>
   * If "exit" is true (replies are being sent), then leaving "done" as false
   * (the default) means the dialog will stay in this state after sending
   * the replies, and subsequent user input will come back to this component.
   * This allows a component to handle a series of interactions within itself,
   * however the component is responsible for keeping track of its own state
   * in such situations.
   * <p/>
   * Setting "done" to true will transition to the next state/component after
   * sending the replies.
   *
   * @deprecated to be removed in favor of transition()
   */
  done(d) {
    logger().warn("conversation SDK done() is deprecated in favor of transition()"); 
    this._response.transition = !!d;
    return this;
  }

  /**
   * Call "transition()" when your component has completed its logic and
   * the dialog should transition to the next state, after replies (if any) are sent.
   * <p/>
   * If transition() is not called, the dialog will stay in this state after sending
   * the replies (if any), and subsequent user input will come back to this component.
   * This allows a component to handle a series of interactions within itself,
   * however the component is responsible for keeping track of its own state
   * in such situations.
   * <p/>
   * transition() will cause the dialog to transition to the next state.
   * transition(outcome) will set te outcome of the component that would be used to
   * determine the next state to transition to.
   * @param {string} [t] - outcome of component
   */
  transition(t) {
    this._response.transition = true;
    if (typeof t !== 'undefined') {
      this._response.action = t;
    }
    return this;
  }

  /**
   * Sets the error flag on the response.
   * @param {boolean} e - sets error if true
   */
  error(e) {
    this._response.error = !!e;
    return this;
  }

  /**
   * Adds a reply to be sent back to the user.  May be called multiple times
   * to send multiple replies in a given response.  Automatically sets the
   * "keepTurn" as false.
   * <p/>
   * reply can take a string payload, an object payload or a MessageModel payload.  A string or object payload will be parsed
   * into a MessageModel payload.  If the MessageModel payload has a valid common message format, then reply will use it as
   * messagePayload, else it will use the payload to create a rawConversationMessage (see MessageModel) as messagePayload.
   * @param {object|string|MessageModel} payload - payload to be sent back.  payload could also be a string for text response
   * @param {object} [channelConversation] - to override the default channelConversation from request
   */
  reply(payload, channelConversation) {
    var response = {
      tenantId: this._request.message.tenantId,
      channelConversation: channelConversation || Object.assign({}, this._request.message.channelConversation)
    };

    var messageModel;
    if (payload instanceof MessageModel) {
      logger().info('messageModel payload provided', payload);
      messageModel = payload;
    } else {
      logger().info('creating messageModel with payload:', payload);
      messageModel = new MessageModel(payload);
    }
    if (messageModel.isValid()) {
      logger().info('valid messageModel');
      response.messagePayload = messageModel.messagePayload();
    } else {
      logger().info('message model validation error:', messageModel.validationError());
      logger().info('using rawPayload');
      var rawMessagePayload = MessageModel.rawConversationMessage(payload);
      messageModel = new MessageModel(rawMessagePayload);
      if (messageModel.isValid()) {
        logger().info('valid messageModel for rawMessagePayload');
        response.messagePayload = messageModel.messagePayload();
      } else {
        logger().info('message model validation error:', messageModel.validationError());
        logger().info('using payload instead of messagePayload');
        response.payload = messageModel.rawPayload();
      }
    }

    this._response.messages = this._response.messages || [];
    this._response.messages.push(response);

    // "keepTurn" false which signals to the engine to send replies and wait for user input
    this.keepTurn(false);

    return this;
  }


  // The HTTP response body
  response() {
    return this._response;
  }

  // BUGBUG: workaround for https://jira.oraclecorp.com/jira/browse/MIECS-2748
  resolveVariable(variable) {
    return variable.startsWith('${') ? null : variable;
  }

  /* Do not show method on jsdoc as this is for internal use
   * When expecting an out of band conversation continuation, such as a
   * user following the OAuth flow, completing a form and hitting submit, or
   * a human support agent or other third party sending a message, issue a
   * limited use token to allow calling back into Bots via the generic callback
   * endpoint.
   * The provided token should be a UUID or other unique and random number.  By setting it
   * here in the response the Bot will await a reply with that token and use it to
   * thread the message back into the current conversation with that user.
   * @param {string} callbackToken - token generated by you to allow reauthentication back 
   * into this conversation.  Should be unique, like userId + random.  It is ok to reissue 
   * the same token for the same conversation.
   */
  setCallbackToken(callbackToken) {
    this._response.callbackToken = (typeof callbackToken === "undefined" ? null : callbackToken);
    return this;
  }
};


function logger() {
  return CommonProvider.getLogger();
}

function createErrorDetails(title, detail, errorCode, errorDetails) {
  const details = Object.assign({}, ERROR);
  details.title = title;
  details.detail = detail;
  details['o:errorCode'] = errorCode;
  details['o:errorDetails'] = errorDetails;
  return details;
}

function validateRequestBody(reqBody) {
  return CommonValidator.validate(ComponentRequestSchemaFactory, reqBody, {
    allowUnknown: true
  });
}

module.exports = {
  ComponentInvocation,
}