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
  const keywordSchema = Joi.object().keys({
    keywords: Joi.array().required(),
    postback: Joi.any().required(),
    skipAutoNumber: Joi.boolean().optional()
  });
  const keywordsSchema = Joi.array().items(keywordSchema);
  const attachmentSchema = Joi.object().keys({
    type: Joi.string().required().valid('file', 'video', 'audio', 'image'),
    url: Joi.string().uri(),
    title: Joi.string().optional(),
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
    headerText: Joi.string().optional(),
    keywords: keywordsSchema.optional(),
    globalActions: actionsSchema.optional(),
    channelExtensions: Joi.object().optional()
  });
  const cardConversationMessageSchema = Joi.object().keys({
    type: Joi.string().required().valid('card'),
    layout: Joi.string().required().valid('horizontal', 'vertical'),
    cards: Joi.array().items(cardSchema).min(1),
    actions: actionsSchema.optional(),
    footerText: Joi.string().optional(),
    headerText: Joi.string().optional(),
    keywords: keywordsSchema.optional(),
    globalActions: actionsSchema.optional(),
    channelExtensions: Joi.object().optional()
  });
  const tableHeadingSchema = Joi.object().keys({
    label: Joi.string().required(),
    width: Joi.number().optional(),
    alignment: Joi.string().optional().valid('left', 'right', 'center'),
    channelExtensions: Joi.object().optional()
  });
  const tableOrFormFieldSchema = Joi.object().keys({
    label: Joi.string().optional(),
    value: Joi.any().optional(),
    width: Joi.number().optional(),
    alignment: Joi.string().optional().valid('left', 'right', 'center'),
    displayType: Joi.string().optional().valid('text', 'link'),
    linkLabel: Joi.string().optional(),
    channelExtensions: Joi.object().optional()
  });
  const tableRowSchema = Joi.object().keys({
    fields: Joi.array().items(tableOrFormFieldSchema),
    channelExtensions: Joi.object().optional()
  });
  const formSchema = Joi.object().keys({
    title: Joi.string().optional(),
    fields: Joi.array().items(tableOrFormFieldSchema),
    actions: actionsSchema.optional(),
    channelExtensions: Joi.object().optional()
  });
  const paginationInfoSchema = Joi.object().keys({
    totalCount: Joi.number().required(),
    rangeSize: Joi.number().required(),
    rangeStart: Joi.number().required(),
    status: Joi.string().optional(),
  });
  const tableConversationMessageSchema = Joi.object().keys({
    type: Joi.string().required().valid('table'),
    headings: Joi.array().items(tableHeadingSchema),
    rows: Joi.array().items(tableRowSchema),
    paginationInfo: paginationInfoSchema.optional(),
    actions: actionsSchema.optional(),
    footerText: Joi.string().optional(),
    headerText: Joi.string().optional(),
    keywords: keywordsSchema.optional(),
    globalActions: actionsSchema.optional(),
    channelExtensions: Joi.object().optional()
  });
  const formConversationMessageSchema = Joi.object().keys({
    type: Joi.string().required().valid('form'),
    forms: Joi.array().items(formSchema),
    formColumns: Joi.number().required(),
    paginationInfo: paginationInfoSchema.optional(),
    actions: actionsSchema.optional(),
    footerText: Joi.string().optional(),
    headerText: Joi.string().optional(),
    keywords: keywordsSchema.optional(),
    globalActions: actionsSchema.optional(),
    channelExtensions: Joi.object().optional()
  });
  const tableFormConversationMessageSchema = Joi.object().keys({
    type: Joi.string().required().valid('tableForm'),
    headings: Joi.array().items(tableHeadingSchema),
    rows: Joi.array().items(tableRowSchema),
    forms: Joi.array().items(formSchema),
    formColumns: Joi.number().required(),
    showFormButtonLabel: Joi.string().optional(),
    paginationInfo: paginationInfoSchema.optional(),
    actions: actionsSchema.optional(),
    footerText: Joi.string().optional(),
    headerText: Joi.string().optional(),
    keywords: keywordsSchema.optional(),
    disclosedFormIndex: Joi.number().optional(),
    globalActions: actionsSchema.optional(),
    channelExtensions: Joi.object().optional()
  });    
  const attachmentConversationMessageSchema = Joi.object().keys({
    type: Joi.string().required().valid('attachment'),
    attachment: attachmentSchema.required(),
    actions: actionsSchema.optional(),
    footerText: Joi.string().optional(),
    headerText: Joi.string().optional(),
    keywords: keywordsSchema.optional(),
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
  const conversationMessageSchema = Joi.alternatives().try(textConversationMessageSchema, cardConversationMessageSchema, attachmentConversationMessageSchema, locationConversationMessageSchema, postbackConversationMessageSchema, rawConversationMessageSchema, agentConversationMessageSchema, tableConversationMessageSchema, formConversationMessageSchema, tableFormConversationMessageSchema);
  return conversationMessageSchema;
};