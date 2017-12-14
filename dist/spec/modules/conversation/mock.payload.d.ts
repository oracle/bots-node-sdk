export declare const Mock: {
    req: {
        nocontext: {
            'botId': string;
            'platformVersion': string;
            'properties': {
                'minAge': number;
            };
            'message': {
                'messagePayload': {
                    'text': string;
                    'type': string;
                };
                'retryCount': number;
                'channelConversation': {
                    'botId': string;
                    'sessionId': string;
                    'type': string;
                    'userId': string;
                    'channelId': string;
                };
                'tenantId': string;
                'createdOn': string;
                'id': string;
            };
        };
        novars: {
            'botId': string;
            'platformVersion': string;
            'context': {};
            'properties': {
                'minAge': number;
            };
            'message': {
                'messagePayload': {
                    'text': string;
                    'type': string;
                };
                'retryCount': number;
                'channelConversation': {
                    'botId': string;
                    'sessionId': string;
                    'type': string;
                    'userId': string;
                    'channelId': string;
                };
                'tenantId': string;
                'createdOn': string;
                'id': string;
            };
        };
        complete: {
            'botId': string;
            'platformVersion': string;
            'context': {
                'variables': {
                    'type': {
                        'type': {
                            'enumValues': string;
                            'name': string;
                            'parentEntity': any;
                            'ruleParameters': any;
                            'patternExpression': any;
                            'type': string;
                        };
                        'value': any;
                        'entity': boolean;
                    };
                    'age': {
                        'type': string;
                        'value': number;
                        'entity': boolean;
                    };
                    'name': {
                        'type': string;
                        'value': string;
                        'entity': boolean;
                    };
                    'hungry': {
                        'type': string;
                        'value': boolean;
                        'entity': boolean;
                    };
                    'iResult': {
                        'type': string;
                        'value': {
                            'timeStamp': number;
                            'intentMatches': {
                                'summary': {
                                    'score': number;
                                    'intent': string;
                                }[];
                                'detail': {
                                    'final_norm': {
                                        'sentence': any[];
                                        'score': number;
                                        'intent': string;
                                    }[];
                                };
                            };
                            'trainingDataUnit': any;
                            'botName': string;
                            'appId': string;
                            'query': string;
                            'entityMatches': {
                                'PizzaType': string[];
                                'PizzaSize': string[];
                            };
                        };
                        'entity': boolean;
                    };
                    'system.errorAction': {
                        'type': string;
                        'value': any;
                        'entity': boolean;
                    };
                    'system.errorState': {
                        'type': string;
                        'value': any;
                        'entity': boolean;
                    };
                };
            };
            'properties': {
                'minAge': number;
            };
            'message': {
                'messagePayload': {
                    'type': string;
                    'text': string;
                };
                'retryCount': number;
                'channelConversation': {
                    'botId': string;
                    'sessionId': string;
                    'type': string;
                    'userId': string;
                    'channelId': string;
                };
                'tenantId': string;
                'createdOn': string;
                'id': string;
            };
        };
    };
    res: {
        complete: {
            'platformVersion': string;
            'context': {
                'variables': {
                    'type': {
                        'type': {
                            'enumValues': string;
                            'name': string;
                            'parentEntity': any;
                            'ruleParameters': any;
                            'patternExpression': any;
                            'type': string;
                        };
                        'value': any;
                        'entity': boolean;
                    };
                    'age': {
                        'type': string;
                        'value': number;
                        'entity': boolean;
                    };
                    'name': {
                        'type': string;
                        'value': string;
                        'entity': boolean;
                    };
                    'hungry': {
                        'type': string;
                        'value': boolean;
                        'entity': boolean;
                    };
                    'iResult': {
                        'type': string;
                        'value': {
                            'timeStamp': number;
                            'intentMatches': {
                                'summary': {
                                    'score': number;
                                    'intent': string;
                                }[];
                                'detail': {
                                    'final_norm': {
                                        'sentence': any[];
                                        'score': number;
                                        'intent': string;
                                    }[];
                                };
                            };
                            'trainingDataUnit': any;
                            'botName': string;
                            'appId': string;
                            'query': string;
                            'entityMatches': {
                                'PizzaType': string[];
                                'PizzaSize': string[];
                            };
                        };
                        'entity': boolean;
                    };
                    'system.errorAction': {
                        'type': string;
                        'value': any;
                        'entity': boolean;
                    };
                    'system.errorState': {
                        'type': string;
                        'value': any;
                        'entity': boolean;
                    };
                };
            };
            'action': string;
            'keepTurn': boolean;
            'transition': boolean;
            'error': boolean;
            'modifyContext': boolean;
        };
    };
};
