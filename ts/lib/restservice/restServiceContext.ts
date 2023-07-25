import { BaseContext } from '../component/baseContext';
import { MessagePayload } from '../message';

// Response template
const RESPONSE = {
  context: undefined
};

/**
 * The Bots RestServiceContext is a class for transforming the request and response of REST services
 * </p>
 * An RestServiceContext class instance is passed as an argument to every rest service event handler function.
 * @memberof module:Lib
 * @extends BaseContext
 * @alias RestServiceContext
 */
export class RestServiceContext extends BaseContext {

  private _restServiceContext: any;

  /**
   * Constructor of rest service context.
   * DO NOT USE - INSTANCE IS ALREADY PASSED TO EVENT HANDLERS
   * @param {object} request
   */
  constructor(request) {
    // Initilize the response
    const response = Object.assign({}, RESPONSE, {
      requestPayload: request.requestPayload,
      responsePayload: request.responsePayload,
    });
    super(request, response);
    this._restServiceContext = request.restServiceContext;
  }

  /**
   * Returns the name of the REST service method
   * @return {string} method name
   */
  getMethod(): string {
    return this._restServiceContext.method;
  }

  /**
   * Returns REST service URL
   * @return the URL
   */
  getEndPoint(): string {
    return this._restServiceContext.endpoint;
  }

  /**
   * Returns the request  payload
   * @return the payload
   */
  getRequestPayload(): any {
    return this.getResponse().requestPayload;
  }

  /**
   * Set the request payload
   */
  setRequestPayload(payload: any) {
    this.getResponse().requestPayload = payload;
  }

  /**
   * Returns the response payload
   * @return the payload
   */
  getResponsePayload(): any {
    return this.getResponse().responsePayload;
  }

  /**
   * Set the response payload
   */
  setResponsePayload(payload: any): void {
    this.getResponse().responsePayload = payload;
  }

  /**
   * Adds a message to the bot response sent to the user.
   * NOTE: This method can only be used in the validateResponsePayload handler
   * @param {object} payload - can take a string message, or a message created using the MessageFactory
   */
  addMessage(payload: string | MessagePayload): void {
    this.getResponse().messages = this.getResponse().messages || [];
    this.getResponse().messages.push(super.constructMessagePayload(payload));
  }

  /**
   * Set a transition action. When you use this function, the dialog engine will transition to the state defined for this transition action.
   * <p>
   * NOTE: This method can only be used in the validateResponsePayload handler
   * @param {string} action - name of the transition action
   */
  setTransitionAction(action: string): void {
    this.getResponse().transitionAction = action;
  }

  /**
   * Sets an LLM prompt that will be sent to the LLM
   * <p>
   * NOTE: This method can only be used in the validateResponsePayload handler
   * @param {string} prompt - the text of the prompt
   */
  setLLMPrompt(prompt: string): void {
    this.getResponse().llmPrompt = prompt;
  }

}
