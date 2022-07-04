import { CommonProvider } from '../../common/provider';
import { CommonValidator } from '../../common/validator';
import { ERROR } from '../../common/error';
import { MessageModel } from '../message/messageModel';
import { Logger } from '../../common/definitions';
import { MessagePayload } from '../message';

const VARIABLE = {
  type: 'string',
  entity: false
};

/**
 * Super class for concrete context classes used to invoke custom components
 * and event handlers
 */
export abstract class BaseContext {
  protected readonly _request: any;
  protected readonly _response: any;
  protected readonly _logger: Logger;

  /**
   * @param {object} request - invocation request payload
   * @param {object} response - initial response payload
   * @param {Function} [validationSchema] - callback returns a schema for request body validation
   */
  constructor(request: any, response: any, validationSchema?: (joi: any) => any) {

    const validation = validationSchema ? validateRequestSchema(request, validationSchema) : null;
    if (validation && validation.error) {
      const err: any = new Error('Request body malformed');
      err.name = 'badRequest';
      err.details = createErrorDetails('Request body malformed',
        JSON.stringify(validation.error),
        'BOTS-1000', {
          requestBody: request,
        });
      throw err;
    }
    // filling in response context vars fromn re quest
    response.context = Object.assign({
      variables: {},
    }, request.context);
    this._request = request;
    this._response = response;
    this._logger = CommonProvider.getLogger();
  }

  /**
   * Retrieves the request object.
   * @return {object} The request object.
   */
  getRequest(): any {
    return this._request;
  }

  /**
   * Retrieves the response object.
   * @return {object} The response object.
   */
  getResponse(): any {
    return this._response;
  }

  /**
   * Retrieves the logger object.
   * @return {object} The logger object.
   */
  logger(): Logger {
    // this function is replaced with mixin logger when deployed to embedded functions to enable viewing logs in bots UI
    return this._logger;
  }

  /**
   * Retrieves the logger object.
   * @return {object} The logger object.
   * @deprecated use logger() function instead
   */
  getLogger(): Logger {
    this.logger().warn('The getLogger() method is deprecated, and will be removed in a future release. Use logger() method instead.');
    return this.logger();
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
   * @param {string}  name - The name of variable to be set or read
   * @param {*} [value] - value to be set for variable
   * @example
   *  let firstName = conversation.variable("profile.firstName");
   *  let lastName = conversation.variable("profile.lastName");
   *  conversation.variable("fullName", firstName + ' ' + lastName);
   */
  variable(name: string, value?: any): any | this {

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

    if (value === undefined) {
      if (!context.variables || !context.variables.hasOwnProperty(nameToUse)) {
        return undefined;
      }
      return context.variables[nameToUse].value;
    } else {
      this.logger().debug('SDK: About to set variable ' + name);

      if (!context.variables) {
        context.variables = {};
      }
      if (!context.variables[nameToUse]) {
        this.logger().debug('SDK: Creating new variable ' + nameToUse);
        context.variables[nameToUse] = Object.assign({}, VARIABLE);
      }

      context.variables[nameToUse].value = value;
      this.getResponse().modifyContext = true;

      this.logger().debug('SDK: Setting variable ' + JSON.stringify(context.variables[nameToUse]));
      return this;
    }
  }

  /**
   * Returns the value of a context or user variable
   * @return {object} variable value
   * @param {string} name - name of the variable
   */
  getVariable(name): any {
    return this.variable(name);
  }

  /**
   * Sets the value of a context or user variable
   * @param {string} name - name of the variable
   * @param {object} value - value of the variable
   */
  setVariable(name, value): this {
    return this.variable(name, value);
  }

  /**
   * Get translated string using a resource bundle key defined in the skill.
   * @return {string} resource bundle freemarker expression that will be resolved when event handler or custom component response is
   * received by dialog engine
   * @param {string} rbKey - key of the resource bundle entry defined with the skill that should be used to translate
   * @param {string} rbArgs - substitution variables
   */
  translate(rbKey: string, ...rbArgs: string[]) {
    // create freemarker expression that will be resolved in runtime after event handler or custom component response is received
    let exp = '${rb(\'' + rbKey + '\'';
    for (let arg of rbArgs) {
      // MIECS-38051: only string args should be enclosed in quotes
      typeof arg === 'string' ? exp += ',\'' + arg + '\'' : exp += ',' + arg;
    }
    exp += ')}';
    return exp;
  }

  /**
   * Return the channel conversation type
   * @return {string} the channel type
   */
  getChannelType(): string {
    return this.getRequest().message.channelConversation.type;
  }

  /**
   * Returns the MessageModel class for creating or validating messages to or from bots.
   * @see MessageModel.js
   * @return {MessageModel} The MessageModel class
   */
  getMessageModel(): typeof MessageModel {
    return MessageModel;
  }

  /**
   * Creates a message payload object
   * @param {object} payload - can take a string payload, an object payload or a MessageModel payload.  A string or object
   * payload will be parsed into a MessageModel payload.  If the MessageModel payload has a valid common message format,
   * then reply will use it as messagePayload, else it will use the payload to create a rawConversationMessage as messagePayload.
   */
  constructMessagePayload(payload): MessagePayload {
    let messagePayload: MessagePayload;
    let messageModel;
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
      let rawMessagePayload = MessageModel.rawConversationMessage(payload);
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

function validateRequestSchema(reqBody, validationSchema: (joi: any) => any) {
  return CommonValidator.validate(validationSchema, reqBody, { allowUnknown: true });
}
