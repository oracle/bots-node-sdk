import * as Joi from '@hapi/joi';

/**
 * MessageModel validation schema factory
 */
export = (joi: any): Joi.Schema => {

  const actionSchema = joi.object().keys({
    type: joi.string().required().valid('postback', 'call', 'url', 'share', 'location'),
    postback: joi.when('type', {
      is: 'postback',
      then: joi.alternatives().try([joi.string(), joi.object()]),
      otherwise: joi.any().forbidden()
    }),
    phoneNumber: joi.when('type', {
      is: 'call',
      then: joi.string().required(),
      otherwise: joi.any().forbidden()
    }),
    url: joi.when('type', {
      is: 'url',
      then: joi.string().required().uri(),
      otherwise: joi.any().forbidden()
    }),
    label: joi.string().optional().trim(),
    imageUrl: joi.string().uri().optional(),
    skipAutoNumber: joi.boolean().optional(),
    keywords: joi.array().optional(),
    channelExtensions: joi.object().optional()
  });
  const actionsSchema = joi.array().items(actionSchema);
  const attachmentSchema = joi.object().keys({
    type: joi.string().required().valid('file', 'video', 'audio', 'image'),
    url: joi.string().uri()
  });
  const cardSchema = joi.object().keys({
    title: joi.string().required(),
    description: joi.string().optional(),
    imageUrl: joi.string().uri().optional(),
    url: joi.string().uri().optional(),
    actions: actionsSchema.optional(),
    channelExtensions: joi.object().optional()
  });
  const locationSchema = joi.object().keys({
    title: joi.string().optional(),
    url: joi.string().uri().optional(),
    latitude: joi.number().required(),
    longitude: joi.number().required()
  });
  const textConversationMessageSchema = joi.object().keys({
    type: joi.string().required().valid('text'),
    text: joi.string().required().trim(),
    actions: actionsSchema.optional(),
    footerText: joi.string().optional(),
    globalActions: actionsSchema.optional(),
    channelExtensions: joi.object().optional()
  });
  const cardConversationMessageSchema = joi.object().keys({
    type: joi.string().required().valid('card'),
    layout: joi.string().required().valid('horizontal', 'vertical'),
    cards: joi.array().items(cardSchema).min(1),
    actions: actionsSchema.optional(),
    footerText: joi.string().optional(),
    globalActions: actionsSchema.optional(),
    channelExtensions: joi.object().optional()
  });
  const attachmentConversationMessageSchema = joi.object().keys({
    type: joi.string().required().valid('attachment'),
    attachment: attachmentSchema.required(),
    actions: actionsSchema.optional(),
    footerText: joi.string().optional(),
    globalActions: actionsSchema.optional(),
    channelExtensions: joi.object().optional()
  });
  const locationConversationMessageSchema = joi.object().keys({
    type: joi.string().required().valid('location'),
    location: locationSchema.required(),
    actions: actionsSchema.optional(),
    globalActions: actionsSchema.optional(),
    channelExtensions: joi.object().optional()
  });
  const rawConversationMessageSchema = joi.object().keys({
    type: joi.string().required().valid('raw'),
    payload: joi.required(),
  });
  const postbackConversationMessageSchema = joi.object().keys({
    type: joi.string().required().valid('postback'),
    postback: joi.alternatives().try([joi.string(), joi.object()]).required(),
    text: joi.string().optional().trim(),
    actions: actionsSchema.optional(),
    globalActions: actionsSchema.optional(),
    channelExtensions: joi.object().optional()
  });
  const agentConversationMessageSchema = joi.object().keys({
    type: joi.string().required().valid('agentRequest', 'agentRequestResponse', 'agentConversationHistory', 'agentJoined', 'agentLeft',
      'botConversationEnded', 'agent', 'botToAgentText')
  }).options({
    'allowUnknown': true
  });

  const conversationMessageSchema = joi.alternatives().try(textConversationMessageSchema,
    cardConversationMessageSchema, attachmentConversationMessageSchema, locationConversationMessageSchema,
    postbackConversationMessageSchema, rawConversationMessageSchema, agentConversationMessageSchema
  );
  return conversationMessageSchema;
};
