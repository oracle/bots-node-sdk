/* eslint-disable no-prototype-builtins */
'use strict';

const { BaseContext } = require("../component/baseContext");

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
class RestServiceContext extends BaseContext {

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
  getMethod() {
    return this._restServiceContext.method;
  }

  /**
   * Returns REST service URL
   * @return the URL
   */
  getEndPoint() {
    return this._restServiceContext.endpoint;
  }

  /**
   * Returns the request  payload
   * @return the payload
   */
  getRequestPayload() {
    return this.getResponse().requestPayload;
  }

  /**
   * Set the request payload
   */
  setRequestPayload(payload) {
    this.getResponse().requestPayload = payload;
  }

  /**
   * Returns the response payload
   * @return the payload
   */
  getResponsePayload() {
    return this.getResponse().responsePayload;
  }

  /**
   * Set the response payload
   */
  setResponsePayload(payload) {
    this.getResponse().responsePayload = payload;
  }

}

module.exports = { RestServiceContext }