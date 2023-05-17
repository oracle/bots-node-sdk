import { BaseContext } from '../component/baseContext';

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
  setResponsePayload(payload: any) {
    this.getResponse().responsePayload = payload;
  }

}
