import { CommonProvider } from '../../common/provider';
import { Logger } from '../../common/definitions';

/**
 * The Bots LlmTransformationContext is a class with convenience methods for transforming the request and response of LLM REST services
 * </p>
 * A LlmTransformationContext class instance is passed as an argument to every rest service event handler function.
 * @memberof module:Lib
 * @alias LlmTransformationContext
 */
export class LlmTransformationContext {

  protected readonly _request: any;
  protected readonly _response: any;
  protected readonly _logger: Logger;
  private _llmTransformationContext: any;

  /**
   * Constructor of rest service context.
   * DO NOT USE - INSTANCE IS ALREADY PASSED TO EVENT HANDLERS
   * @param {object} request
   */
  constructor(request) {
    // Initilize the response
    const response = Object.assign({}, {
      requestPayload: request.requestPayload,
      responsePayload: request.responsePayload,
    });
    this._request = request;
    this._response = response;
    this._logger = CommonProvider.getLogger();
    this._llmTransformationContext = request.llmTransformationContext;
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
   * Returns the name of the REST service method
   * @return {string} method name
   */
  getMethod(): string {
    return this._llmTransformationContext.method;
  }

  /**
   * Returns REST service URL
   * @return the URL
   */
  getEndPoint(): string {
    return this._llmTransformationContext.endpoint;
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

}
