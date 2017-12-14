/**
 * utility function to derive a string representation of a card within a conversation message for use with speech or text based channels like Alexa and SMS.
 * @function module:messageModelUtil.cardToText
 * @return {string} A string or speech representation of the card.
 * @param {object} card - A card (as defined in Conversation Message Model)
 * @param {string} [cardPrefix] - A string prefix used before the card content, for example 'Card'
 */
export declare function cardToText(card: any, cardPrefix: any): string;
/**
 * utility function to derive a string representation of a Conversation Message for use with speech or text based channels like Alexa and SMS.
 * @function module:messageModelUtil.convertRespToText
 * @return {string} A string or speech representation of the conversation message.
 * @param {object} convMsg - A message conforming to Conversation Message Model.
 */
export declare function convertRespToText(convMsg: any): string;
