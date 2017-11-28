import { MessageModel } from '../message/messageModel';
import { Logger } from '../../common/definitions';
/**
 * Wrapper object for accessing nlpresult
 */
export declare class NLPResult {
    private _nlpresult;
    constructor(nlpresult: any);
    /**
     * Returns matches for the specified entity; may be an empty collection.
     * If no entity is specified, returns the map of all entities.
     * @param {string} [entity] - name of the entity
     * @return {object} The entity match result.
     */
    entityMatches(entity: any): any;
}
/**
 * The Bots JS SDK exports a class that wraps an invocation to the custom component.
 * Create it with the request payload (as an object) that was used to invoke
 * the component.
 *
 * It offers a friendlier interface to reading context for the invocation
 * as well as changing variables and sending results back to the diaog engine.
 */
export declare class ComponentInvocation {
    private _request;
    private _response;
    /**
     * @constructor
     * @param {object} requestBody - The request body
     */
    constructor(requestBody: any);
    /**
     * Retrieves the request body.
     * @return {object} The request body.
     */
    request(): any;
    /**
     * Retrieves the bot id.
     * @return {string} The bot id.
     */
    botId(): any;
    /**
     * Retrieves the sdk version.
     * @return {string} The sdk version.
     */
    static sdkVersion(): string;
    /**
     * Retrieves the platform version of the request.
     * @return {string} The platform version.
     */
    platformVersion(): any;
    /**
     * Retrieves the logger so the component can use the shared logger for logging.  The shared logger should support the methods log, info, warn, error and trace.
     * @return {object} The logger.
     */
    logger(): Logger;
    /**
     * Retrieves the raw payload of the current input message.
     * @return {object} The raw payload.
     */
    rawPayload(): any;
    /**
     * Retrieves the payload of the current input message in the common message format.
     * @return {object} The common message payload.
     */
    messagePayload(): any;
    /**
     * Retrieves the payload of the current input message. For backward compatibility purposes.  However, the payload returned may be in the new message format.
     * @return {object} The message payload.
     * @deprecated to be removed in favor of rawPayload() and messagePayload()
     */
    payload(): any;
    /**
     * Retrieves the channel type of the current input message.
     * @return {string} The channel type - facebook, webhook, test, etc.
     */
    channelType(): any;
    /**
     * Retrieves the userId for the current input message.
     * @return {string} The userId.
     */
    userId(): any;
    /**
     * Retrieves the sessionId for the current input message.
     * @return {string} The sessionId.
     */
    sessionId(): any;
    _postback10(): any;
    /**
     * Retrieves the postback of the current input message.
     * If the input message is not a postback, this will return null.
     * @return {object} The postback payload.
     */
    postback(): any;
    _text10(): any;
    /**
     * Retrieves the text of the current input message.
     * Eventually not all messages will have a text value, in which case
     * this will return null.
     * @return {string} The text of the input message.
     */
    text(): any;
    /**
     * Retrieves the attachment of the current input message.
     * If the input message is not an attachment, this will return null.
     * @return {object} The attachment.
     */
    attachment(): any;
    /**
     * Retrieves the location of the current input message.
     * If the input message does not contain a location, this will return null.
     * @return {object} The attachment.
     */
    location(): any;
    /**
     * Retrieves the properties defined for the current state.
     * @return {object} The properties
     */
    properties(): any;
    /**
     * Read or write variables defined in the current flow.
     * It is not possible to change the type of an existing variable through
     * this method.  It is the caller's responsibility to ensure that the
     * value being set on a variable is of the correct type. (e.g. entity,
     * string or other primitive, etc).
     *
     * A new variable can be created.  However, since the variable is not
     * defined in the flow, using it in the flow subsequently may be flagged
     * for validation warnings.
     *
     * This function takes a variable number of arguments.
     *
     * The first form:
     * variable(name);
     * reads the variable called "name", returning its value.
     *
     * The second form:
     * variable(name, value);
     * writes the value "value" to the variable called "name".
     *
     * @param {string}  name - The name of variable to be set or read
     * @param {string} [value] - value to be set for variable (optional)
     */
    variable(name: any, value?: any): any;
    MessageModel(): typeof MessageModel;
    /**
     * Returns an NLPResult helper object for working with nlpresult variables.
     * See the NLPResult documentation for more information.
     *
     * You may specify a particular nlpresult by name (if you have multiple
     * nlpresult variables defined in the flow), or omit the name if you
     * only have 1 nlpresult.
     *
     * @param {string} [nlpVariableName] - variable to be given the nlpResult
     * @return {NLPResult} The nlp resolution result.
     */
    nlpResult(nlpVariableName: any): NLPResult;
    /**
     * Sets the action to return from this component, which will determine the
     * next state in the dialog.
     *
     * @param {string} a - action name
     * @deprecated to be removed in favor of transition(action)
     */
    action(a: any): any;
    /**
     * Set "exit" to true when your component has replies it wants to send to
     * the client.
     *
     * The SDK's "reply" function automatically sets "exit" to true, but
     * if you manually modify the response to send replies then you will need
     * to set this explicitly.
     *
     * @deprecated to be removed in favor of keepTurn(boolean)
     */
    exit(e: any): this;
    /**
     * "keepTurn" is used to indicate if the Bot/component should send the next replies, or
     * or if the Bot/component should wait for user input (keepTurn = false).
     *
     * The SDK's "reply" function automatically sets "keepTurn" to false.
     * @param {boolean} [k] - whether to keep the turn for sending more replies
     */
    keepTurn(k: any): this;
    /**
     * "releaseTurn" is the shorthand for keepTurn(false)
     * @param {boolean} [k] - whether to keep the turn for sending more replies
     */
    releaseTurn(k: any): this;
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
    */
    done(d: any): this;
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
    transition(t: any): this;
    /**
    * Sets the error flag on the response.
    * @param {boolean} e - sets error if true
    */
    error(e: any): this;
    /**
    * Adds a reply to be sent back to the user.  May be called multiple times
    * to send multiple replies in a given response.  Automatically sets the
    * "keepTurn" as false.
    *
    * reply can take a string payload, an object payload or a MessageModel payload.  A string or object payload will be parsed
    * into a MessageModel payload.  If the MessageModel payload has a valid common message format, then reply will use it as
    * messagePayload, else it will use the payload to create a rawConversationMessage (see MessageModel) as messagePayload.
    * @param {object|string|MessageModel} payload - payload to be sent back.  payload could also be a string for text response
    * @param {object} [channelConversation] - to override the default channelConversation from request
    */
    reply(payload: any, channelConversation: any): this;
    response(): any;
    resolveVariable(variable: any): any;
    reformatDate(date: any): any;
    /**
    * When expecting an out of band conversation continuation, such as a
    * user following the OAuth flow, completing a form and hitting submit, or
    * a human support agent or other third party sending a message, issue a
    * limited use token to allow calling back into Bots via the generic callback
    * endpoint.
    * The provided token should be a UUID or other unique and random number.  By setting it
    * here in the response the Bot will await a reply with that token and use it to
    * thread the message back into the current conversation with that user.
    * @param {string} callbackToken - token generated by you to allow reauthentication back into this conversation.  Should be unique, like userId + random.  It is ok to reissue the same token for the same conversation.
    */
    setCallbackToken(callbackToken: any): this;
}
