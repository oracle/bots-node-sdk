import { BaseComponentMetadata } from '../../lib/component/kinds';
import { LlmTransformationContext } from './llmTransformationContext';

export interface LlmTransformationHandlerMetadata extends BaseComponentMetadata {
  eventHandlerType: 'LlmTransformation';
  events?: string[];
}

export interface LlmTransformationHandler {
  metadata(): LlmTransformationHandlerMetadata;
  handlers(): LlmTransformationHandlers
}

export interface LlmTransformationHandlers {
  transformRequestPayload?(event: TransformPayloadEvent, context: LlmTransformationContext): void
  transformResponsePayload?(event: TransformPayloadEvent, context: LlmTransformationContext): void
  transformErrorResponsePayload?(event: TransformPayloadEvent, context: LlmTransformationContext): void
}

export interface TransformPayloadEvent {
  payload: any;
  compartmentId?: string
}

