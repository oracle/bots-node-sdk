import { BaseComponentMetadata } from '../component/kinds';
import { RestServiceContext } from './restServiceContext';

export interface RestServiceEventHandlerMetadata extends BaseComponentMetadata {
  eventHandlerType: 'RestService';
  events?: string[];
}

export interface RestServiceEventHandler {
  metadata(): RestServiceEventHandlerMetadata;
  handlers(): RestServiceEventHandlers
}

export interface RestServiceEventHandlers {
  transformRequestPayload?(event: TransformPayloadEvent, context: RestServiceContext): void
  transformResponsePayload?(event: TransformPayloadEvent, context: RestServiceContext): void
}

export interface TransformPayloadEvent {
  payload: any
}


