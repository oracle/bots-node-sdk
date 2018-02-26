"use strict";

const messageModelUtil = require('./messageModelUtil');
const webhookUtil = require('./webhookUtil');
const textUtil = require('./textUtil');

module.exports = {
  // message model
  messageModelUtil,
  MessageModel: messageModelUtil, // rename for require(...).Util.MessageModel
  // webhook
  webhookUtil,
  Webhook: webhookUtil, // rename for require(...).Util.Webhook
  // text
  textUtil,
  Text: textUtil, // rename for require(...).Util.Text
};
