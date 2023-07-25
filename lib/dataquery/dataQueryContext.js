/* eslint-disable no-prototype-builtins */
'use strict';

const { BaseContext } = require("../component/baseContext");

// Response template
const RESPONSE = {
  context: undefined,
  error: false
};

/**
 * The Bots DataQueryContext is a class for changing the result and presentation of SQLDialog data queries
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
   * Returns the time it took to execute the query
   */
  getQueryExecutionTime() {
    return this._queryData.omrlQueryExecutionTime;
  }

  /**
   * Returns the SQL query that is executed
   */
  getSQLQuery() {
    return this._queryData.omrlSql;
  }

  /**
   * Returns the UI Settings
   */
  getUISettings() {
    return this._uiMetadata;
  }


  /**
   * Returns the layout used to render the query result set. One of table, form or tableForm.
   */
  getLayout() {
    return this._uiMetadata.layout;
  }

  /**
   * Change the UI settings
   */
  setUISettings(settings) {
    this._uiMetadata = settings;
  }

  /**
   * Returns an array of the attribute UI settings
   */
  getAttributesUISettings() {
    return this._uiDataItemMetadata;
  }

  /**
   * Returns the attribute UI settings for a specific attribute
   * @param {string} attributeName 
   */
  getAttributeUISettings(attributeName) {
    let metadata = this._uiDataItemMetadata.filter( m => m.name === attributeName);
    if (metadata.length > 0) {
      return metadata[0];
    }
  }

  /**
   * Change the attribute UI settings for a specific attribute
   * @param {string} attributeName 
   * @param {ReadOnlyFieldMetadata} settings 
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
   * Create a CMM postback action that when clicked / tapped by the user will execute a follow-up query.
   * @param {string} buttonLabel 
   * @param {string} the OMRL query 
   * @param {string} the title that is used when displaying the query results 
   * @return {PostbackActionType} the postback action to execute the query
   * @deprecated Use createQueryAction instead, this returns a PostbackAction created using the MessageFactory which replaces the
   * deprecated MessageModel.
   */
  createFollowUpQueryAction(buttonLabel, query, queryTitle) {
    const messageModel = this.getMessageModel();
    let payload =  { 'action': 'system.omrlQuery', 'variables': {'system.omrql': query, 'system.omrqlResultTitle': queryTitle || '', 'system.isFollowupResponse': true}};
    return messageModel.postbackActionObject(buttonLabel, undefined, payload);
  }

  /**
   * Create a CMM postback action that when clicked / tapped by the user will execute a follow-up query.
   * @param {string} buttonLabel
   * @param {string} the OMRL query
   * @param {string} the title that is used when displaying the query results
   * @return {PostbackAction} the postback action to exeute the query
   */
  createQueryAction(buttonLabel, query, queryTitle) {
    let payload =  { 'action': 'system.omrlQuery', 'variables': {'system.omrql': query, 'system.omrqlResultTitle': queryTitle || '', 'system.isFollowupResponse': true} };
    return this.getMessageFactory().createPostbackAction(buttonLabel, payload);
  }

  /**
   * Return true when the query executed is a follow-up query
   */
  isFollowUpQuery() {
    return this.getVariable('system.isFollowupResponse');
  }

  /**
   * The end flow  action that is set that can be used to transition to a different flow by defining a mapping for this action in the main flow.
   * @param {string} action - the end flow action that can be used to transition in the main flow
   */
  setEndFlowAction(action) {
    this.setVariable('system.sqlDialog.endFlowAction', action);
    this.getResponse().transitionAction = 'system.sqlDialog.endFlow';
  }

  /**
   * Creates a postback action that ends the flow with the specified end flow action.
   * @param {string} the label of the postback button 
   * @param {string} action - the end flow action that can be used to transition in the main flow
   */
  createEndFlowPostbackAction(label, action) {
    const mf = this.getMessageFactory();
    return mf.createPostbackAction(label, {'action': 'system.sqlDialog.endFlow', 'variables': {'system.sqlDialog.endFlowAction': action}});
  }

  /**
   * Invoke another flow
   * @param {string} flowName - name of the flow to invoke
   */
  invokeFlow(flowName) {
    this.setVariable('system.sqlDialog.invokeFlowName', flowName);
    this.getResponse().transitionAction = 'system.sqlDialog.invokeFlow';
  }

  /**
   * Creates a postback action that invokes the specified flow.
   * @param {string} the label of the postback button 
   * @param {string} flowName - name of the flow to invoke
   */
  createInvokeFlowPostbackAction(label, flowName) {
    const mf = this.getMessageFactory();
    return mf.createPostbackAction(label, {'action': 'system.sqlDialog.invokeFlow', 'variables': {'system.sqlDialog.invokeFlowName': flowName}});
  }

}

module.exports = { DataQueryContext }