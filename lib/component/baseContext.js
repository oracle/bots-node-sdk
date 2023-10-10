/* eslint-disable no-prototype-builtins */
'use strict';

const { CommonProvider } = require("../../common/provider");
const { CommonValidator } = require("../../common/validator");
const { ERROR } = require("../../common/error");
const { MessageModel } = require("../message/messageModel");
const { MessageFactory, RawMessage, NonRawMessage } = require("../../typings/lib2");

const VARIABLE = {
  type: "string",
  entity: false
};

const CONST = {
  NLPRESULT_TYPE: 'nlpresult',
  SYSTEM_INVALID_USER_INPUT: 'system.invalidUserInput'
};

/**
 * Wrapper object for accessing nlpresult
 * @alias NLPResult
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
   * Returns full payload matches for the specified entity; may be an empty collection.
   * If no entity is specified, returns the full payload map of all entities.
   * @param {string} [entity] - name of the entity
   * @return {object} The full entity match result.
   */
  fullEntityMatches(entity) {
    if (!this._nlpresult) {
      return entity === undefined ? {} : [];
    }

    if (entity === undefined) {
      // Retrieving fullEntityMatches collection, or an empty collection if none
      return this._nlpresult.fullEntityMatches ? this._nlpresult.fullEntityMatches : {};
    } else {
      if (this._nlpresult.fullEntityMatches) {
        return this._nlpresult.fullEntityMatches[entity] ? this._nlpresult.fullEntityMatches[entity] : [];
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
      return null;
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

}

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
    const validation = validationSchema ? validateRequestSchema(request, validationSchema) : null;
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
   * Retrieves the logger object.
   * @return {object} The logger object.
   */
  logger() {
    // this function is replaced with mixin logger when deployed to embedded functions to enable viewing logs in bots UI
    return this._logger;
  }

  /**
   * Retrieves the logger object.
   * @return {object} The logger object.
   * @deprecated use logger() function instead
   */
  getLogger() {
    this.logger().warn('The getLogger() method is deprecated, and will be removed in a future release. Use logger() method instead.');
    return this.logger();
  }

  /**
   * Returns an NLPResult helper object for working with nlpresult variables.
   * See the NLPResult documentation for more information.
   * <p>
   * If your skill uses visual flows, you don't need to specify a variable name.
   * If your skill uses a YAML flow, you may specify a particular nlpresult by name (if you have multiple
   * nlpresult variables defined in the flow), or omit the name if you only have 1 nlpresult.
   * </p>
   *
   * @param {string} [nlpVariableName] - variable that holds the nlpResult
   * @return {NLPResult} The nlp resolution result.
   */
  nlpResult(nlpVariableName) {
    let isVisualDialog = this.getRequest().taskFlow;
    if (isVisualDialog) {
      nlpVariableName = 'skill.system.nlpresult';
    } else if (nlpVariableName === undefined) {
      for (let name in this.getResponse().context.variables) {
        if (this.getResponse().context.variables[name].type === CONST.NLPRESULT_TYPE) {
          this.logger().debug('SDK: using implicitly found nlpresult=' + name);
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
  
    if (!isVisualDialog && this.getResponse().context.variables[nlpVariableName].type !== CONST.NLPRESULT_TYPE) {
      throw new Error('SDK: var=' + nlpVariableName + ' not of type nlpresult');
    }

    return new NLPResult(nlpVariable);
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
      if (!context.variables) {
        context.variables = {};
      }
      if (!context.variables[nameToUse]) {
        context.variables[nameToUse] = Object.assign({}, VARIABLE);
      }

      context.variables[nameToUse].value = value;
      this.getResponse().modifyContext = true;

      return this;
    }
  }

  /**
   * Get the definition of a variable
   *
   * @param {string} name - The name of the variable
   */
  getVariableDefinition(name) {
    let context = this.getResponse().context;
    let scopeName = null;
    let nameToUse = name;
    let index = name.indexOf('.');
    if (index > -1) {
      scopeName = name.substring(0, index);
      let possibleScope = context;
      while (possibleScope) {
        if (possibleScope.scope === scopeName) {
          context = possibleScope;
          nameToUse = name.substring(index + 1, name.length);
          break;
        } else {
          // this is to handle the case when the variable name is system.XXX but system is not a scope
          if (possibleScope.variables && possibleScope.variables.hasOwnProperty(nameToUse)) {
            context = possibleScope;
            break;
          }
          possibleScope = possibleScope.parent;
        }
      }
    }
    if (!context.variables || !context.variables.hasOwnProperty(nameToUse)) {
      return undefined;
    } else {
      return context.variables[nameToUse];
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
   * Get translated string using a resource bundle key defined in the skill.
   * @return {string} resource bundle freemarker expression that will be resolved when event handler or custom component response is 
   * received by dialog engine
   * @param {string} rbKey - key of the resource bundle entry defined with the skill that should be used to translate
   * @param {string} rbArgs - substitution variables
   */
  translate(rbKey, ...rbArgs) {
    // create freemarker expression that will be resolved in runtime after event handler or custom component response is received
    let exp = "${rb('"+rbKey+"'";
    for (let arg of rbArgs) {
      // MIECS-38051: only string args should be enclosed in quotes
      typeof arg === 'string' ? exp += ",'" + arg + "'" : exp += "," + arg;  
    }
    exp += ")}";
    return exp;
  }  

  /**
   * Return the channel conversation type
   * @return {string} the channel type
   */
  getChannelType() {
    return this.getRequest().message.channelConversation.type;
  }

  /**
   * Returns the last user message.
   * @return {NonRawMessage} the last user message. You can cast this message to the appropriate message type.
   */
  getUserMessage() {
    return this.getMessageFactory().messageFromJson(this.getRequest().message.messagePayload);
  }

  /**
   * Returns the MessageModel class for creating or validating messages to or from bots.
   * @see MessageModel.js
   * @return {MessageModel} The MessageModel class
   * @deprecated Use getMessageFactory() instead
   */
  getMessageModel() {
    return MessageModel;
  }

  /**
   * Returns the MessageFactory class for creating bots messages
   * @return {MessageFactory} The MessageFactory class
   */
  getMessageFactory() {
    return MessageFactory;
  }

  /**
   * Creates a message payload object
   * @param {object} payload - can take a string message, a message created by the MessageFactory, or a message created by the 
   * deprecated MessageModel.
   * @returns {object} message payload in JSON format
   */
  constructMessagePayload(payload) {
    var messagePayload;
    var messageModel;
    if (payload instanceof RawMessage || payload instanceof NonRawMessage) {
      // message created with new MessageFactory
      return payload.toJson();
    }
    // Message created with deprecated MessageModel, keep for backwards compatibility
    if (payload instanceof MessageModel) {
      this.logger().debug('messageModel payload provided');
      messageModel = payload;
    } else {
      this.logger().debug('creating messageModel with payload');
      messageModel = new MessageModel(payload);
    }
    if (messageModel.isValid()) {
      this.logger().debug('valid messageModel');
      messagePayload = messageModel.messagePayload();
    } else {
      this.logger().debug('message model validation error:', messageModel.validationError());
      this.logger().debug('using rawPayload');
      var rawMessagePayload = MessageModel.rawConversationMessage(payload);
      messageModel = new MessageModel(rawMessagePayload);
      if (messageModel.isValid()) {
        this.logger().debug('valid messageModel for rawMessagePayload');
        messagePayload = messageModel.messagePayload();
      } else {
        this.logger().debug('message model raw message validation error:', messageModel.validationError());
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
