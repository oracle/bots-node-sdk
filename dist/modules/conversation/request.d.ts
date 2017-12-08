/**
 * Definition of the component request object.
 * This interface represents the payload used for component invocation.
 */
export interface IComponentRequestBody {
    botId: string;
    platformVersion: string;
    context: {
        variables?: any;
        parent?: any;
    };
    properties: any;
    message: {
        type?: string;
        payload?: any;
        messagePayload?: any;
        stateCount?: number;
        retryCount: number;
        channelConversation: {
            botId: string;
            sessionId: string;
            type: string;
            userId: string;
            sessionExpiryDuration?: number;
            channelId: string;
        };
        componentResponse?: any;
        executionContext?: string;
        tenantId: string;
        createdOn: string;
        id: string;
        callbackToken?: string;
    };
}
