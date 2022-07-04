/* eslint-disable no-prototype-builtins */
'use strict';

const { BaseContext } = require("../component/baseContext");

// Response template
const RESPONSE = {
  context: undefined,
  error: false
};

/**
 * The Bots DataQueryContext is a class for changing the result and presentation of C2SQL data queries
 * </p>
 * An DataQueryContext class instance is passed as an argument to every data query event handler function.
 * @memberof module:Lib
 * @extends BaseContext
 * @alias DataQueryContext
 */
class DataQueryContext extends BaseContext {

  /**
   * Constructor of data query context. 
   * DO NOT USE - INSTANCE IS ALREADY PASSED TO EVENT HANDLERS 
   * @param {object} request 
   */
  constructor(request) {
    // Initilize the response
    const response = Object.assign({}, RESPONSE, {
      dataQueryContext: request.dataQueryContext,
    });
    super(request, response);
    this._queryData = request.dataQueryContext.queryData;
    this._uiMetadata = request.dataQueryContext.uiMetadata;
    this._uiDataItemMetadata = request.dataQueryContext.uiDataItemMetadata;
  }

  /**
   * Return the name of the root entity of the query
   * @return {string} root entity name
   */
  getRootEntity() {
    return this._queryData.rootEntity;
  }

  /**
   * Returns the result of the query
   * @return {object} query result
   */
  getQueryResult() {
    return this._queryData.queryResult;
  }

  /**
   * Modify the query result
   */
  setQueryResult(result) {
    this._queryData.queryResult = result;
  }

  /**
   * Returns the number of rows returned by the query
   * @return {number} row count
   */
  getRowCount() {
    return this._queryData.numRowsFetched;
  }

  /**
   * Returns the OMRL query
   */
  getOMRLQuery() {
    return this._queryData.omrlQuery;
  }

  /**
   * Returns the time it took to execute the OMRL query
   */
  getOMRLQueryExecutionTime() {
    return this._queryData.omrlQueryExecutionTime;
  }

  /**
   * Returns the SQL query that is executed
   */
  getSQLQuery() {
    return this._queryData.omrlSql;
  }


  /**
   * 
   */
  getUISettings() {
    return this._uiMetadata;
  }


  /**
   * 
   */
  getLayout() {
    return this._uiMetadata.layout;
  }

  /**
   * 
   */
  setUISettings(settings) {
    this._uiMetadata = settings;
  }

  /**
   * 
   */
  setShowSlackFormInDialog(uiMetadata, value) {
    uiMetadata.channelCustomProperties.filter(p => p.channel === 'slack')[0].properties.showFormInDialog = value; 
  }

  /**
   * 
   */
  getAttributesUISettings() {
    return this._uiDataItemMetadata;
  }

  /**
   * 
   */
  getAttributeUISettings(attributeName) {
    let metadata = this._uiDataItemMetadata.filter( m => m.name === attributeName);
    if (metadata.length > 0) {
      return metadata[0];
    }
  }

  /**
   * 
   */
  setAttributeUISettings(attributeName, settings) {
    let index = this._uiDataItemMetadata.findIndex(m => m.name == attributeName);
    if (index > -1) {
      this._uiDataItemMetadata[index] = settings;
    } else {
      // metadata not found, add it to the end of the array
      this._uiDataItemMetadata.push(settings);
    }
  }

  /**
   * Returns a list of the candidate bot messages created by the the ResolveEntities or CommonResponse component
   * that will be sent to the user when you use addCandidateMessages() function.
   * @return {object[]} list of candidate messages. Note that these messages are in the format of the conversation 
   * message model (CMM), and can be either a text, attachment or card message payload
   */
  getCandidateMessages() {
    return this.getRequest().candidateMessages;
  }

  /**
   * Add the bot messages created by ResolveEntities or CommomResponse component to the response that will
   * be sent to the user.
   * Note that these messages are in the format of the conversation message model (CMM), and can be either 
   * a text, attachment or card message payload
   */
  addCandidateMessages() {
    if (this.getRequest().candidateMessages) {
      if (!this.getResponse().messages) {
        this.getResponse().messages = [];
      }
      this._logger.debug("Using candidate bot messages");
      for (let message of this.getRequest().candidateMessages) {
        this.getResponse().messages.push(message);
      }  
      this.getResponse().keepProcessing = false;
    } else {
      this._logger.debug("No candidate bot messages found");
    }
  }

  createOMRLQueryAction(label, query) {
    const messageModel = this.getMessageModel();
    let payload =  { 'action': 'system.omrlQuery', 'variables': {'system.omrql': query} };
    return messageModel.postbackActionObject(label, undefined, payload);
  }

  setColumnIndex(attributeName, newIndex) {
    newIndex = newIndex < this.getAttributesUISettings().length ? newIndex :  this.getAttributesUISettings().length - 1;
    if (this.getAttributeUISettings(attributeName)) {
      let oldIndex = this._uiDataItemMetadata.indexOf(this.getAttributeUISettings(attributeName));
      this._uiDataItemMetadata =  this._uiDataItemMetadata.splice(newIndex, 0, this._uiDataItemMetadata.splice(oldIndex, 1)[0]);  
    }
  }
}

module.exports = { DataQueryContext }