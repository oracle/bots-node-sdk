import { BaseComponentMetadata } from '../component/kinds';
import { DataQueryContext } from './dataQueryContext';
import { NonRawMessagePayload } from '../message/messageTypes';

export interface DataQueryEventHandlerMetadata extends BaseComponentMetadata {
  eventHandlerType: 'DataQuery';
  events?: string[];
}

export interface DataQueryEventHandler {
  metadata(): DataQueryEventHandlerMetadata;
  handlers(): DataQueryEventHandlers
}

export interface DataQueryEventHandlers {
  entity?: DataQueryEntityEvent;
  attributes?: DataQueryEntityAttributes;
  custom?: any;
}

export interface DataQueryEntityAttributes {
  [key: string]: DataQueryEntityAttributeEvents;
}

export interface DataQueryEntityEvent {
  changeUISettings?(event: ChangeUISettingsEvent, context: DataQueryContext): void
  changeResponseData?(event: ChangeResponseDataEvent, context: DataQueryContext): void
  changeBotMessages?(event: ChangeBotMessagesEvent, context: DataQueryContext): void
}

export interface DataQueryEntityAttributeEvents {
  changeUISettings?(event: ChangeAttributeUISettingsEvent, context: DataQueryContext): void
  format?(event: FormatAttributeEvent, context: DataQueryContext): void
}

export interface ChangeUISettingsEvent {
  settings: DataQueryUISettings
}

export interface ChangeResponseDataEvent {
  responseData: QueryResult
}

export interface ChangeBotMessagesEvent {
  messages: NonRawMessagePayload[]
}

export interface ChangeAttributeUISettingsEvent {
  settings: ReadOnlyFieldMetadata
}

export interface FormatAttributeEvent {
  attributeValue: any
}

export interface Iteratable {
  iteratorVariable?: string
  iteratorExpression?: string
  rangeSize?: number
}

export interface DataQueryUISettings extends Iteratable {
  type: QueryMessageType
  layout?: Layout
  headerText?: string
  footerText?: string
  formColumns?: number
  showFormButtonLabel?: string
  actions?: ActionMetadata[]
  channelCustomProperties?: any
}

export interface ReadOnlyFieldMetadata {
  name?: string
  label?: string
  displayInTable?: boolean
  displayInForm?: boolean
  value?: object
  width?: number
  alignment?: FieldAlignment
  channelCustomProperties?: any
}

export interface ActionMetadata extends Iteratable {
  label?: string
  keyword?: string
  type?: string
  visible?: VisibleProperty
  imageUrl?: string
  channelCustomProperties?: any
  skipAutoNumber?: boolean;
}

export interface VisibleProperty {
  expression?: string
  channels?: IncludeExcludeProperty
}

export interface IncludeExcludeProperty {
  include?: string
  exclude?: string
}

export interface QueryResult {
  omrlQuery?: string
  omrlSql?: string
  interpretation?: string
  rootEntity?: string
  queryResult?: any
  omrlQueryExecutionTime?: number
  numRowsFetched?: number
}

export type QueryMessageType = 'text' | 'dataSet'

export type Layout = 'table' | 'form' | 'tableForm'

export type FieldAlignment = 'left' | 'center' | 'right'

