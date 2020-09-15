export const Mock = {
  req: {
    nocontext: {
      'botId' : '963B57F7-CFE6-439D-BB39-2E342AD4EC92',
      'platformVersion': '1.1',
      'state': 'someState',
      'properties' : {
        'minAge' : 18
      },
      'message' : {
        'messagePayload' : {
          'text' : '22',
          'type' : 'text'
        },
        'retryCount' : 0,
        'channelConversation' : {
          'botId' : '963B57F7-CFE6-439D-BB39-2E342AD4EC92',
          'sessionId' : '1769637',
          'type' : 'test',
          'userId' : '1769637',
          'channelId' : '18DE5AEF-65A4-461B-B14D-0A4BCF1D6F71'
        },
        'tenantId' : 'DefaultOliveTenant',
        'createdOn': '2016-12-20T00:23:53.593Z',
        'id' : '8c9556b2-9930-4228-985e-f972bfcfe26d'
      }
    },
    novars: {
      'botId' : '963B57F7-CFE6-439D-BB39-2E342AD4EC92',
      'platformVersion': '1.1',
      'state': 'someState',
      'context' : {
      },
      'properties' : {
        'minAge' : 18
      },
      'message' : {
        'messagePayload' : {
          'text' : '22',
          'type' : 'text'
        },
        'retryCount' : 0,
        'channelConversation' : {
          'botId' : '963B57F7-CFE6-439D-BB39-2E342AD4EC92',
          'sessionId' : '1769637',
          'type' : 'test',
          'userId' : '1769637',
          'channelId' : '18DE5AEF-65A4-461B-B14D-0A4BCF1D6F71'
        },
        'tenantId' : 'DefaultOliveTenant',
        'createdOn': '2016-12-20T00:23:53.593Z',
        'id' : '8c9556b2-9930-4228-985e-f972bfcfe26d'
      }
    },
    complete: {
      'botId': '963B57F7-CFE6-439D-BB39-2E342AD4EC92',
      'platformVersion': '1.1',
      'state': 'someState',
      'context': {
        'variables': {
          'type': {
            'type': {
              // tslint:disable-next-line:max-line-length
              'enumValues': ' cheese,Veggie Lovers, pepperoni,Hawaiian,Meat Lovers,mushroom,sausage,supreme,Chicken,Italian, Gourmet Veggie',
              'name': 'PizzaType',
              'parentEntity': null,
              'ruleParameters': null,
              'patternExpression': null,
              'type': 'ENUMVALUES'
            },
            'value': null,
            'entity': true
          },
          'age': {
            'type': 'float',
            'value': 100.0,
            'entity': false
          },
          'name': {
            'type': 'string',
            'value': 'Joe',
            'entity': false
          },
          'hungry': {
            'type': 'boolean',
            'value': true,
            'entity': false
          },
          'iResult': {
            'type': 'nlpresult',
            'value': {
              'timeStamp': 1510192951256,
              'intentMatches': {
                'summary': [{
                    'score': 0.9977130404520472,
                    'intent': 'OrderPizza'
                  },
                  {
                    'score': 0.0022869595479527573,
                    'intent': 'CancelPizza'
                  }
                ],
                'detail': {
                  'final_norm': [{
                      'sentence': [],
                      'score': 0.9977130404520472,
                      'intent': 'OrderPizza'
                    },
                    {
                      'sentence': [],
                      'score': 0.0022869595479527573,
                      'intent': 'CancelPizza'
                    }
                  ]
                }
              },
              'trainingDataUnit': null,
              'botName': 'PizzaBot',
              'appId': '98C3F6F8-3D9C-4F32-B62A-3B06185422B4',
              'query': 'order large pepperoni pizza',
              'entityMatches': {
                'PizzaType': [
                  'pepperoni'
                ],
                'PizzaSize': [
                  'Large'
                ]
              }
              'fullEntityMatches': {
                  'PizzaType': [
                    {
                      'entityName': 'PizzaType',
                      'originalString': 'pepperoni',
                      'canonicalName': 'pepperoni'
                    }
                  ],
                  'PizzaSize': [
                    {
                      'entityName': 'PizzaSize',
                      'originalString': 'large',
                      'canonicalName': 'Large'
                    }
                  ]
                }
              }
            },
            'entity': false
          },
          'system.errorAction': {
            'type': 'string',
            'value': null,
            'entity': false
          },
          'system.errorState': {
            'type': 'string',
            'value': null,
            'entity': false
          }
        }
      },
      'properties': {
        'minAge': 18
      },
      'message': {
        'messagePayload': {
          'type': 'text',
          'text': '22'
        },
        'retryCount': 0,
        'channelConversation': {
          'botId': '963B57F7-CFE6-439D-BB39-2E342AD4EC92',
          'sessionId': '1769637',
          'type': 'test',
          'userId': '1769637',
          'channelId': '18DE5AEF-65A4-461B-B14D-0A4BCF1D6F71'
        },
        'tenantId': 'DefaultOliveTenant',
        'createdOn': '2016-12-20T00:23:53.593Z',
        'id': '8c9556b2-9930-4228-985e-f972bfcfe26d'
      }
    }

  },

  res: {
    complete: {
      'platformVersion': '1.1',
      'state': 'someState',
      'context': {
        'variables': {
          'type': {
            'type': {
              // tslint:disable-next-line:max-line-length
              'enumValues': ' cheese,Veggie Lovers, pepperoni,Hawaiian,Meat Lovers,mushroom,sausage,supreme,Chicken,Italian, Gourmet Veggie',
              'name': 'PizzaType',
              'parentEntity': null,
              'ruleParameters': null,
              'patternExpression': null,
              'type': 'ENUMVALUES'
            },
            'value': null,
            'entity': true
          },
          'age': {
            'type': 'float',
            'value': 55.5,
            'entity': false
          },
          'name': {
            'type': 'string',
            'value': 'Ken',
            'entity': false
          },
          'hungry': {
            'type': 'boolean',
            'value': false,
            'entity': false
          },
          'iResult': {
            'type': 'nlpresult',
            'value': {
              'timeStamp': 1510192951256,
              'intentMatches': {
                'summary': [{
                    'score': 0.9977130404520472,
                    'intent': 'OrderPizza'
                  },
                  {
                    'score': 0.0022869595479527573,
                    'intent': 'CancelPizza'
                  }
                ],
                'detail': {
                  'final_norm': [{
                      'sentence': [],
                      'score': 0.9977130404520472,
                      'intent': 'OrderPizza'
                    },
                    {
                      'sentence': [],
                      'score': 0.0022869595479527573,
                      'intent': 'CancelPizza'
                    }
                  ]
                }
              },
              'trainingDataUnit': null,
              'botName': 'PizzaBot',
              'appId': '98C3F6F8-3D9C-4F32-B62A-3B06185422B4',
              'query': 'order large pepperoni pizza',
              'entityMatches': {
                'PizzaType': [
                  'pepperoni'
                ],
                'PizzaSize': [
                  'Large'
                ]
              },
              'fullEntityMatches': {
                'PizzaType': [
                  {
                    'entityName': 'PizzaType',
                    'originalString': 'pepperoni',
                    'canonicalName': 'pepperoni'
                  }
                ],
                'PizzaSize': [
                  {
                    'entityName': 'PizzaSize',
                    'originalString': 'large',
                    'canonicalName': 'Large'
                  }
                ]
              }
            },
            'entity': false
          },
          'system.errorAction': {
            'type': 'string',
            'value': null,
            'entity': false
          },
          'system.errorState': {
            'type': 'string',
            'value': null,
            'entity': false
          }
        }
      },
      'action': 'eatpizza',
      'keepTurn': true,
      'transition': true,
      'error': false,
      'modifyContext': true
    }


  }
};
