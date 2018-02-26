// export interface Message {
//   userId: string;
//   text?: string; // Simple (1.0)
//   messagePayload?: MessagePayload; // CMM (1.1)
//   profile?: { firstName?: string; lastName?: string; [key: string]: any };
//   choices?: string[];
// };

// /**
//  * define message action types
//  */
// export type Action = PostbackAction | UrlAction | CallAction | LocationAction | ShareAction;
// export type ActionType = 'postback' | 'url' | 'call' | 'location' | 'share';
// export interface BaseAction {
//   type: ActionType;
//   label?: string;
//   imageUrl?: string;
// }
// export interface PostbackAction extends BaseAction { type: 'postback'; postback: string | object; }
// export interface UrlAction extends BaseAction { type: 'url'; url: string; }
// export interface CallAction extends BaseAction { type: 'call'; phoneNumber: string; }
// export interface LocationAction extends BaseAction { type: 'location'; }
// export interface ShareAction extends BaseAction { type: 'share'; }

// /**
//  * define special object types
//  */
// export interface Card {
//   title: string;
//   description?: string;
//   imageUrl?: string;
//   url?: string;
//   actions?: Action[];
// }
// export type AttachmentType = 'file' | 'image' | 'video' | 'audio';
// export interface Attachment {
//   type: AttachmentType;
//   url: string;
// }

// export interface Location {
//   latitude: number | string;
//   longitude: number | string;
//   title?: string;
//   url?: string;
// }

// /**
//  * define message payload types
//  */
// export type MessageType = 'text' | 'card' | 'attachment' | 'location' | 'postback' | 'raw';
// export type MessagePayload = TextMessage | CardMessage | AttachmentMessage | LocationMessage | PostbackMessage | RawMessage;
// export interface BaseMessagePayload {
//   type: MessageType;
//   actions?: Action[];
//   globalActions?: Action[];
//   channelExtensions?: any;
// }
// export interface TextMessagePayload extends BaseMessagePayload { text: string }
// export interface TextMessage extends TextMessagePayload { type: 'text'; }
// export interface CardMessage extends BaseMessagePayload {
//   type: 'card';
//   layout: 'vertical' | 'horizontal',
//   cards: Card[];
// }
// export interface AttachmentMessage extends BaseMessagePayload {
//   type: 'attachment';
//   attachment: Attachment;
// }
// export interface LocationMessage extends BaseMessagePayload {
//   type: 'location';
//   location: Location;
// }
// export interface PostbackMessage extends BaseMessagePayload {
//   type: 'postback';
//   postback: string | object;
//   text?: string;
// }
// export interface RawMessage extends BaseMessagePayload {
//   type: 'raw';
//   payload: any;
// }
