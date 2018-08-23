'use strict';

const { MessageModel } = require("../../main");

function createActions(actionDefs) {
  return actionDefs.map(function(actionDef, index) {
    if (actionDef.postback) {
      return MessageModel.postbackActionObject(actionDef.postback, null, {
        index: index,
        label: actionDef.postback
      });
    } else if (actionDef.url) {
      return MessageModel.urlActionObject(
        actionDef.url,
        null,
        "http://oracle.com"
      );
    } else if (actionDef.location) {
      return MessageModel.locationActionObject(actionDef.location);
    } else if (actionDef.call) {
      return MessageModel.callActionObject(actionDef.call, null, "1234567890");
    } else if (actionDef.share) {
      return MessageModel.shareActionObject(actionDef.share);
    }
  });
}

function validateMessage(msgObj, type) {
  expect(msgObj.type).toEqual(type);
  const messageModel = new MessageModel(msgObj);
  expect(msgObj).toEqual(messageModel.messagePayload());
}

describe("MessageModel", () => {
  describe("TextConversationMessage", () => {
    it("Create and Validate Text", function() {
      const msg = MessageModel.textConversationMessage(
        "May I help you?",
        createActions([{ postback: "Yes" }, { postback: "No" }])
      );
      validateMessage(msg, "text");
    });
  });

  describe("CardConversationMessage", () => {
    it("Create and Validate Card", function() {
      const cardContents = [
        {
          title: "HAWAIIAN CHICKEN",
          description: "grilled chicken, ham, pineapple and green bell peppers"
        },
        {
          title: "PEPPERONI",
          description:
            "Classic marinara sauce with authentic old-world style pepperoni."
        },
        {
          title: "BACON SPINACH ALFREDO",
          description:
            "Garlic Parmesan sauce topped with bacon, mushrooms and roasted spinach with a salted pretzel crust."
        }
      ];
      const cards = cardContents.map(function(content) {
        return MessageModel.cardObject(content.title, content.description);
      });
      const msg = MessageModel.cardConversationMessage("horizontal", cards);
      validateMessage(msg, "card");
    });
  });

  describe("AttachmentConversationMessage", () => {
    it("Create and Validate Attachment", function() {
      const msg = MessageModel.attachmentConversationMessage(
        "image",
        "https://cloud.oracle.com/opc/images/why-cloud-09.jpg",
        createActions([
          { url: "Open" },
          { call: "Call" },
          { share: "Share" },
          { location: "Location" }
        ])
      );
      validateMessage(msg, "attachment");
    });
  });

  describe("AttachmentConversationMessage Negative", () => {
    it("Create and Validate Invalid Attachment", function() {
      const msg = MessageModel.attachmentConversationMessage(
        "unknown",
        "https://cloud.oracle.com/opc/images/why-cloud-09.jpg",
        createActions([
          { url: "Open" },
          { call: "Call" },
          { share: "Share" },
          { location: "Location" }
        ])
      );
      const messageModel = new MessageModel(msg);
      expect(messageModel.isValid()).toBeFalsy();
    });
  });

  describe("LocationConversationMessage and Channel Extensions", () => {
    it("Create and Validate Location", function() {
      const msg = MessageModel.locationConversationMessage(
        37.3435,
        -121.8887,
        "Is it the right location?",
        null,
        createActions([{ postback: "Yes" }, { postback: "No" }])
      );
      validateMessage(msg, "location");
      MessageModel.addChannelExtensions(msg, "webhook", { map: "google" });
      validateMessage(msg, "location");
    });
  });

  describe("PostbackConversationMessage and Global Actions", () => {
    it("Create and Validate Postback", function() {
      const msg = MessageModel.postbackConversationMessage(
        { serious: true },
        "Seriously?"
      );
      validateMessage(msg, "postback");
      MessageModel.addGlobalActions(
        msg,
        createActions([{ postback: "Menu" }, { postback: "Bye" }])
      );
      validateMessage(msg, "postback");
    });
  });

  describe("RawConversationMessage", () => {
    it("Create and Validate Raw", function() {
      const payload = { foo: "酒吧" };
      const msg = MessageModel.rawConversationMessage(
        payload
      );
      validateMessage(msg, "raw");
    });
  });
});
