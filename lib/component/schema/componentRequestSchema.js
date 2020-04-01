'use strict';

module.exports = (joi) => {
  // joi does not seem to support recursive schemas.
  const contextSchema = joi.object().keys({
    variables: joi.object().pattern(/(.*)/, joi.object().keys({
      entity: joi.boolean().required(),
      type: joi.alternatives().when('entity', {
        is: true,
        then: joi.object().keys({
          type: joi.string().required(),
          name: joi.string().required(),
          patternExpression: joi.string().allow(null),
          parentEntity: joi.any(),
          ruleParameters: joi.any(),
          enumValues: joi.any()
        }).required(),
        otherwise: joi.string().required()
      }),
      value: joi.any().allow(null)
    })),
    parent: joi.object().allow(null)
  });
  const messageSchema = joi.object().keys({
    type: joi.string().optional(),
    payload: joi.any().optional(),
    messagePayload: joi.any().optional(),
    stateCount: joi.number().optional(),
    retryCount: joi.number().required(),
    channelConversation: joi.object().keys({
      botId: joi.string().required(),
      sessionId: joi.string().required(),
      type: joi.string().required(),
      userId: joi.string().required(),
      sessionExpiryDuration: joi.number().optional(),
      channelId: joi.string().required()
    }),
    componentResponse: joi.any(),
    executionContext: joi.string(),
    tenantId: joi.string().required(),
    createdOn: joi.string().required(),
    id: joi.string().required(),
    callbackToken: joi.string().optional()
  });
  const propertiesSchema = joi.object().pattern(/(.*)/, joi.alternatives().try([joi.string().allow(''), joi.number(), joi.boolean(), joi.array(), joi.object()]));
  const requestSchema = joi.object({
    botId: joi.string().required(),
    platformVersion: joi.string().required(),
    state: joi.string().optional(),
    context: contextSchema.required(),
    properties: propertiesSchema,
    message: messageSchema.required()
  });
  return requestSchema;
};
