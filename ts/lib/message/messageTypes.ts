// export namespace MM {
export interface Message {
  userId: string;
  text?: string; // Simple (1.0)
  messagePayload?: MessagePayload; // CMM (1.1)
  profile?: { firstName?: string; lastName?: string; [key: string]: any };
  choices?: string[];
}

/**
 * define message action types
 */
export type Action = PostbackAction | UrlAction | CallAction | LocationAction | ShareAction;

export type ActionType = 'postback' | 'url' | 'call' | 'location' | 'share';

export type AlignmentType = 'left' | 'center' | 'right';

export type FieldDisplayType = 'text' | 'link';

export type ChannelType = 'facebook' | 'webhook' | 'slack' | 'msteams' | 'cortana' | 'websdk' | 'androidsdk' | 'iossdk' | 'twilio' | 'test'

export interface BaseAction {
  type: ActionType;
  label?: string;
  imageUrl?: string;
  channelExtensions?: any;
}
export interface PostbackAction extends BaseAction {
  type: 'postback';
  postback: string | object;
  keywords?: string[];
  skipAutoNumber?: boolean
}

export interface UrlAction extends BaseAction { type: 'url'; url: string; }
export interface CallAction extends BaseAction { type: 'call'; phoneNumber: string; }
export interface LocationAction extends BaseAction { type: 'location'; }
export interface ShareAction extends BaseAction { type: 'share'; }

/**
 * define special object types
 */
export interface Card {
  title: string;
  description?: string;
  imageUrl?: string;
  url?: string;
  actions?: Action[];
  channelExtensions?: any;
}

export type AttachmentType = 'file' | 'image' | 'video' | 'audio';
export interface Attachment {
  type: AttachmentType;
  url: string;
  title?: string;
}

export interface Location {
  latitude: number | string;
  longitude: number | string;
  title?: string;
  url?: string;
}

export interface Keyword {
  keywords: string[];
  postback?: any;
  skipAutoNumber?: boolean;
}

export interface TableHeaderColumn {
  label: string;
  width?: number;
  alignment?: AlignmentType;
}

export interface TableColumn {
  value?: any;
  alignment?: AlignmentType;
  displayType?: FieldDisplayType;
  linkLabel?: string;
}

export interface FormField {
  label: string;
  value?: any;
  displayType?: FieldDisplayType;
  linkLabel?: string
}

export interface TableRow {
  fields: TableColumn[];
}

export interface Form {
  title?: string;
  fields: FormField[];
}

export interface PaginationInfo {
  totalCount: number;
  rangeSize: number;
  rangeStart: number;
  status?: string
}

/**
 * define message payload types
 */
export type MessageType = 'text' | 'card' | 'attachment'| 'table'| 'form'| 'tableForm' | 'location' | 'postback';
export type NonRawMessagePayload = TextMessage | CardMessage | AttachmentMessage | LocationMessage | PostbackMessage ;
export type MessagePayload = NonRawMessagePayload | RawMessage;
export interface BaseMessagePayload {
  type: MessageType;
  actions?: Action[];
  globalActions?: Action[];
  channelExtensions?: any;
  headerText?: string;
  footerText?: string;
  keywords?: Keyword[];
}

export interface TextMessage extends BaseMessagePayload {
  type: 'text';
  text: string
}

export interface CardMessage extends BaseMessagePayload {
  type: 'card';
  layout: 'vertical' | 'horizontal';
  cards: Card[];
}
export interface AttachmentMessage extends BaseMessagePayload {
  type: 'attachment';
  attachment: Attachment;
}

export interface TableMessage extends BaseMessagePayload {
  type: 'table';
  headings: TableHeaderColumn[];
  rows: TableRow[];
  paginationInfo?: PaginationInfo;
}

export interface FormMessage extends BaseMessagePayload {
  type: 'form';
  forms: Form[];
  formColumns?: number;
  paginationInfo?: PaginationInfo;
}

export interface TableFormMessage extends BaseMessagePayload {
  type: 'tableForm';
  headings: TableHeaderColumn[];
  rows: TableRow[];
  forms: Form[];
  formColumns?: number;
  showFormButtonLabel?: string
  paginationInfo?: PaginationInfo;
}

export interface LocationMessage extends BaseMessagePayload {
  type: 'location';
  location: Location;
}
export interface PostbackMessage extends BaseMessagePayload {
  type: 'postback';
  postback: string | object;
  text?: string;
}
export interface RawMessage {
  type: 'raw';
  payload: any;
}
