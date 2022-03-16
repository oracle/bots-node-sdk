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
    postbackConversationMessageSchema, rawConversationMessageSchema, agentConversationMessageSchema,
    tableConversationMessageSchema, formConversationMessageSchema, tableFormConversationMessageSchema
  );
  return conversationMessageSchema;
};
