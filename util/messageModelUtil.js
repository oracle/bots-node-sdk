'use strict';

function trailingPeriod(text) {
  if (!text || (typeof text !== 'string')) {
    return '';
  }
  return ((text.trim().endsWith('.') || text.trim().endsWith('?') || text.trim().endsWith(',')) ? text.trim() + ' ' : text.trim() + '. ');
}

function actionToText(action, actionPrefix) {
  var actionText = (actionPrefix ? actionPrefix + ' ' : '');
  if (action.label) {
    return actionText + action.label;
  }
  else {
    switch (action.type) {
    case 'postback':
      break;
    case 'call':
      actionText += 'Call the phone number ' + action.phoneNumber;
      break;
    case 'url':
      actionText += 'Open the Url ' + action.url;
      break;
    case 'share':
      actionText += 'Share the message';
      break;
    case 'location':
      actionText += 'Share the location';
      break;
    default:
      break;
    }
  }
  return actionText;
}

function actionsToText(actions, prompt, actionPrefix) {
  var actionsText = prompt || 'You can choose from the following actions: ';
  actions.forEach(function (action, index) {
    actionsText = actionsText + actionToText(action, actionPrefix);
    if (index < actions.length - 1) {
      actionsText = actionsText + ', ';
    }
  });
  return trailingPeriod(actionsText);
}

function textMessageToText(resp) {
  var result = "";
  result = trailingPeriod(resp.text);
  if (resp.actions && resp.actions.length > 0) {
    result = result + actionsToText(resp.actions, 'You can choose from the following options: ');
  }
  if (resp.globalActions && resp.globalActions.length > 0) {
    result = result + actionsToText(resp.globalActions, 'The following global actions are available: ');
  }
  return result;
}

/**
 * utility function to derive a string representation of a card within a conversation message for use with speech or text based channels like Alexa and SMS.
 * @function module:Util/MessageModel.cardToText
 * @return {string} A string or speech representation of the card.
 * @param {object} card - A card (as defined in Conversation Message Model)
 * @param {string} [cardPrefix] - A string prefix used before the card content, for example 'Card'
 */
function cardToText(card, cardPrefix) {
  var cardText = trailingPeriod((cardPrefix ? cardPrefix + ' ' : '') + card.title);
  if (card.description) {
    cardText = trailingPeriod(cardText + card.description);
  }
  if (card.actions && card.actions.length > 0) {
    cardText = cardText + actionsToText(card.actions, 'The following actions are available for this card: ');
    cardText = cardText + ' Or choose Return';
  }
  else {
    cardText = cardText + ' You could choose Return';
  }
  return cardText;
}

function cardsSummaryToText(cards, prompt) {
  var cardsText = prompt || 'You can choose from the following cards for more information: ';
  cards.forEach(function (card, index) {
    cardsText = cardsText + 'Card ' + card.title;
    if (index < cards.length - 1) {
      cardsText = cardsText + ', ';
    }
  });
  return trailingPeriod(cardsText);
}

function cardMessageToText(resp) {
  var result = "";
  result = trailingPeriod(resp.text);
  if (resp.cards && resp.cards.length > 0) {
    result = result + cardsSummaryToText(resp.cards);
  }
  if (resp.actions && resp.actions.length > 0) {
    result = result + actionsToText(resp.actions, 'The following options are available: ');
  }
  return trailingPeriod(result);
}

function attachmentMessageToText(resp) {
  var result = "";
  if (resp.actions && resp.actions.length > 0) {
    result = result + actionsToText(resp.actions, 'You can choose from the following options: ');
  }
  if (resp.globalActions && resp.globalActions.length > 0) {
    result = result + actionsToText(resp.globalActions, 'The following global actions are available: ');
  }
  return trailingPeriod(result);
}
/**
 * utility function to derive a string representation of a Conversation Message for use with speech or text based channels like Alexa and SMS.
 * @function module:Util/MessageModel.convertRespToText
 * @return {string} A string or speech representation of the conversation message.
 * @param {object} convMsg - A message conforming to Conversation Message Model.
 */
function convertRespToText(convMsg) {
  var sentence = "";
  if (convMsg.type) {
    switch (convMsg.type) {
    case 'text':
      sentence = textMessageToText(convMsg);
      break;
    case 'card':
      sentence = cardMessageToText(convMsg);
      break;
    case 'attachment':
      sentence = attachmentMessageToText(convMsg);
      break;
    case 'location':
      sentence = attachmentMessageToText(convMsg);
      break;
    }
  }
  return sentence;
}

/**
 * The messageModelUtil is a set of utility functions to help deriving string or speech representation
 * of a CMM (Conversation Message Model) message.  This is used primarily to output text or speech to
 * voice and text-based channels like Alexa and SMS.
 * @module Util/MessageModel
 */
module.exports = {
  convertRespToText,
  cardToText,
};
