'use strict';

const { CommonProvider } = require("../../common/provider");
const { CommonValidator } = require("../../common/validator");
const { ERROR } = require("../../common/error");
const { MessageModel } = require("../message/messageModel");

const VARIABLE = {
  type: "string",
  entity: false
};

/**
 * Super class for concrete context classes used to invoke custom components
 * and event handlers
 * @memberof module:Lib
 * @alias BaseContext
 */
class BaseContext {
  /**
   * @param {object} request - invocation request payload
   * @param {object} response - initial response payload
   * @param {Function} [validationSchema] - callback returns a schema for request body validation
   */
  constructor(request, response, validationSchema) {
    const validation = validationSchema && validateRequestSchema(request, validationSchema);
    if (validation && validation.error) {
      const err = new Error('Request body malformed');
      err.name = 'badRequest';
      err.details = createErrorDetails('Request body malformed',
        JSON.stringify(validation.error),
        'BOTS-1000', {
          requestBody: request,
        });
      throw err;
    }
    // filling in response context vars fromn request
    response.context = Object.assign({variables: {}}, request.context);
    this._request = request;
    this._response = response;
    this._logger = CommonProvider.getLogger();
  }

  /**
   * Retrieves the request object.
   * @return {object} The request object.
   */
  getRequest() {
    return this._request;
  }

  /**
   * Retrieves the response object.
   * @return {object} The response object.
   */
  getResponse() {
    return this._response;
  }
 
  /**
   * Retrieves the response object.
   * @return {object} The response object.
   */
  getLogger() {
    return this._logger;
  }

  /**
   * Read or write variables defined in the current flow.
   * It is not possible to change the type of an existing variable through
   * this method.  It is the caller's responsibility to ensure that the
   * value being set on a variable is of the correct type. (e.g. entity,
   * string or other primitive, etc).
   * <p>
   * A new variable can be created.  However, since the variable is not
   * defined in the flow, using it in the flow subsequently may be flagged
   * for validation warnings.
   * </p>
   * This function takes a variable number of arguments.
   * <p>
   * The first form:
   * variable(name);
   * reads the variable called "name", returning its value.
   * The name could be in the form of &lt;scope&gt;.&lt;variableName&gt;.  For example, a variable firstName in the
   * profile scope needs to be retrieved as variable("profile.firstName").
   * </p>
   * The second form:
   * variable(name, value);
   * writes the value "value" to the variable called "name".
   *
   * @param {string} name - The name of variable to be set or read
   * @param {string} [value] - value to be set for variable
   * @example
   * let firstName = conversation.variable("profile.firstName");
   * let lastName = conversation.variable("profile.lastName");
   * conversation.variable("fullName", firstName + ' ' + lastName);
   */
  variable(name, value) {

    var context = this.getResponse().context;
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
          if (possibleScope.variables && possibleScope.variables.hasOwnProperty(nameToUse)) {
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
      this._logger.debug('SDK: About to set variable ' + name);

      if (!context.variables) {
        context.variables = {};
      }
      if (!context.variables[nameToUse]) {
        this._logger.debug('SDK: Creating new variable ' + nameToUse);
        context.variables[nameToUse] = Object.assign({}, VARIABLE);
      }

      context.variables[nameToUse].value = value;
      this.getResponse().modifyContext = true;

      this._logger.debug('SDK: Setting variable ' + JSON.stringify(context.variables[nameToUse]));
      return this;
    }
  }

  /**
   * Returns the value of a context or user variable
   * @return {object} variable value
   * @param {string} name - name of the variable
   */
  getVariable(name) {
    return this.variable(name);
  }

  /**
   * Sets the value of a context or user variable
   * @param {string} name - name of the variable
   * @param {object} value - value of the variable
   */
  setVariable(name,value) {
    return this.variable(name,value);
  }

  /**
   * Returns the MessageModel class for creating or validating messages to or from bots.
   * @see MessageModel.js
   * @return {MessageModel} The MessageModel class
   */
  getMessageModel() {
    return MessageModel;
  }

  /**
   * Creates a message payload object
   * @param {object} payload - can take a string payload, an object payload or a MessageModel payload.  A string or object payload will be parsed
   * into a MessageModel payload.  If the MessageModel payload has a valid common message format, then reply will use it as
   * messagePayload, else it will use the payload to create a rawConversationMessage (see MessageModel) as messagePayload.
   */
  constructMessagePayload(payload) {
    var messagePayload;
    var messageModel;
    if (payload instanceof MessageModel) {
      this._logger.debug('messageModel payload provided');
      messageModel = payload;
    } else {
      this._logger.debug('creating messageModel with payload');
      messageModel = new MessageModel(payload);
    }
    if (messageModel.isValid()) {
      this._logger.debug('valid messageModel');
      messagePayload = messageModel.messagePayload();
    } else {
      this._logger.debug('message model validation error:', messageModel.validationError());
      this._logger.debug('using rawPayload');
      var rawMessagePayload = MessageModel.rawConversationMessage(payload);
      messageModel = new MessageModel(rawMessagePayload);
      if (messageModel.isValid()) {
        this._logger.debug('valid messageModel for rawMessagePayload');
        messagePayload = messageModel.messagePayload();
      } else {
        this._logger.debug('message model raw message validation error:', messageModel.validationError());
      }
    }
    return messagePayload;
  }

}

function createErrorDetails(title, detail, errorCode, errorDetails) {
  const details = Object.assign({}, ERROR);
  details.title = title;
  details.detail = detail;
  details['o:errorCode'] = errorCode;
  details['o:errorDetails'] = errorDetails;
  return details;
}

function validateRequestSchema(reqBody, validationSchema) {
  return CommonValidator.validate(validationSchema, reqBody, { allowUnknown: true });
}

module.exports = {
  BaseContext,
};
