const { CommonValidator } = require("../../common/validator");
const MessageModel = require('./messageModel');

CommonValidator.useInBrowser();

module.exports = MessageModel;
