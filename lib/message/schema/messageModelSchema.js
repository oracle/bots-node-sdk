'use strict';

module.exports = (Joi) => {
  const actionSchema = Joi.object().keys({
    type: Joi.string().required().valid('postback', 'call', 'url', 'share', 'location'),
    postback: Joi.when('type', {
      is: 'postback',
      then: Joi.alternatives().try([Joi.string(), Joi.object()]),
      otherwise: Joi.any().forbidden()
    }),
    phoneNumber: Joi.when('type', {
      is: 'call',
      then: Joi.string().required(),
      otherwise: Joi.any().forbidden()
    }),
    url: Joi.when('type', {
      is: 'url',
      then: Joi.string().required().uri(),
      otherwise: Joi.any().forbidden()
    }),
    label: Joi.string().optional().trim(),
    imageUrl: Joi.string().uri().optional(),
    skipAutoNumber: Joi.boolean().optional(),
    keywords: Joi.array().optional(),
    channelExtensions: Joi.object().optional()
  });
  const actionsSchema = Joi.array().items(actionSchema);
  const attachmentSchema = Joi.object().keys({
    type: Joi.string().required().valid('file', 'video', 'audio', 'image'),
    url: Joi.string().uri()
  });
  const cardSchema = Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().optional(),
    imageUrl: Joi.string().uri().optional(),
    url: Joi.string().uri().optional(),
    actions: actionsSchema.optional(),
    channelExtensions: Joi.object().optional()
  });
  const locationSchema = Joi.object().keys({
    title: Joi.string().optional(),
    url: Joi.string().uri().optional(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required()
  });
  const textConversationMessageSchema = Joi.object().keys({
    type: Joi.string().required().valid('text'),
    text: Joi.string().required().trim(),
    actions: actionsSchema.optional(),
    footerText: Joi.string().optional(),
    globalActions: actionsSchema.optional(),
    channelExtensions: Joi.object().optional()
  });
  const cardConversationMessageSchema = Joi.object().keys({
    type: Joi.string().required().valid('card'),
    layout: Joi.string().required().valid('horizontal', 'vertical'),
    cards: Joi.array().items(cardSchema).min(1),
    actions: actionsSchema.optional(),
    footerText: Joi.string().optional(),
    globalActions: actionsSchema.optional(),
    channelExtensions: Joi.object().optional()
  });
  const attachmentConversationMessageSchema = Joi.object().keys({
    type: Joi.string().required().valid('attachment'),
    attachment: attachmentSchema.required(),
    actions: actionsSchema.optional(),
    footerText: Joi.string().optional(),
    globalActions: actionsSchema.optional(),
    channelExtensions: Joi.object().optional()
  });
  const locationConversationMessageSchema = Joi.object().keys({
    type: Joi.string().required().valid('location'),
    location: locationSchema.required(),
    actions: actionsSchema.optional(),
    globalActions: actionsSchema.optional(),
    channelExtensions: Joi.object().optional()
  });
  const rawConversationMessageSchema = Joi.object().keys({
    type: Joi.string().required().valid('raw'),
    payload: Joi.required(),
  });
  const postbackConversationMessageSchema = Joi.object().keys({
    type: Joi.string().required().valid('postback'),
    postback: Joi.alternatives().try([Joi.string(), Joi.object()]).required(),
    text: Joi.string().optional().trim(),
    actions: actionsSchema.optional(),
    globalActions: actionsSchema.optional(),
    channelExtensions: Joi.object().optional()
  });
  const agentConversationMessageSchema = Joi.object().keys({
    type: Joi.string().required().valid('agentRequest', 'agentRequestResponse', 'agentConversationHistory', 'agentJoined', 'agentLeft', 'botConversationEnded', 'agent', 'botToAgentText')
  }).options({
    'allowUnknown': true
  });
  const conversationMessageSchema = Joi.alternatives().try(textConversationMessageSchema, cardConversationMessageSchema, attachmentConversationMessageSchema, locationConversationMessageSchema, postbackConversationMessageSchema, rawConversationMessageSchema, agentConversationMessageSchema);
  return conversationMessageSchema;
};