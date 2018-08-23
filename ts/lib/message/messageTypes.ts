// export namespace MM {
export interface IMessage {
  userId: string;
  text?: string; // Simple (1.0)
  messagePayload?: IMessagePayload; // CMM (1.1)
  profile?: { firstName?: string; lastName?: string; [key: string]: any };
  choices?: string[];
}

/**
 * define message action types
 */
export type IAction = IPostbackAction | IUrlAction | ICallAction | ILocationAction | IShareAction;
export type IActionType = 'postback' | 'url' | 'call' | 'location' | 'share';
export interface IBaseAction {
  type: IActionType;
  label?: string;
  imageUrl?: string;
}
export interface IPostbackAction extends IBaseAction { type: 'postback'; postback: string | object; }
export interface IUrlAction extends IBaseAction { type: 'url'; url: string; }
export interface ICallAction extends IBaseAction { type: 'call'; phoneNumber: string; }
export interface ILocationAction extends IBaseAction { type: 'location'; }
export interface IShareAction extends IBaseAction { type: 'share'; }

/**
 * define special object types
 */
export interface ICard {
  title: string;
  description?: string;
  imageUrl?: string;
  url?: string;
  actions?: IAction[];
}
export type IAttachmentType = 'file' | 'image' | 'video' | 'audio';
export interface IAttachment {
  type: IAttachmentType;
  url: string;
}

export interface ILocation {
  latitude: number | string;
  longitude: number | string;
  title?: string;
  url?: string;
}

/**
 * define message payload types
 */
export type IMessageType = 'text' | 'card' | 'attachment' | 'location' | 'postback' | 'raw';
export type IMessagePayload = ITextMessage | ICardMessage | IAttachmentMessage | ILocationMessage | IPostbackMessage | IRawMessage;
export interface IBaseMessagePayload {
  type: IMessageType;
  actions?: IAction[];
  globalActions?: IAction[];
  channelExtensions?: any;
}
export interface ITextMessagePayload extends IBaseMessagePayload { text: string }
export interface ITextMessage extends ITextMessagePayload { type: 'text'; }
export interface ICardMessage extends IBaseMessagePayload {
  type: 'card';
  layout: 'vertical' | 'horizontal',
  cards: ICard[];
}
export interface IAttachmentMessage extends IBaseMessagePayload {
  type: 'attachment';
  attachment: IAttachment;
}
export interface ILocationMessage extends IBaseMessagePayload {
  type: 'location';
  location: Location;
}
export interface IPostbackMessage extends IBaseMessagePayload {
  type: 'postback';
  postback: string | object;
  text?: string;
}
export interface IRawMessage extends IBaseMessagePayload {
  type: 'raw';
  payload: any;
}
