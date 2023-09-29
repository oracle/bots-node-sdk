import { BaseComponentMetadata } from '../../lib/component/kinds';
import { LlmComponentContext } from './llmComponentContext';
import { NonRawMessage } from '../messagev2';

export interface LlmComponentHandlerMetadata extends BaseComponentMetadata {
  eventHandlerType: 'LlmComponent';
  events?: string[];
}

export interface LlmComponentHandler {
  metadata(): LlmComponentHandlerMetadata;
  handlers(): LlmComponentHandlers;
}

export interface LlmComponentHandlers {
  custom?: any;
  validateRequestPayload?(event: ValidateRequestEvent, context: LlmComponentContext): void;
  validateResponsePayload?(event: ValidateResponseEvent, context: LlmComponentContext): void;
  changeBotMessages?(event: ChangeBotMessagesLlmEvent, context: LlmComponentContext): void;
  submit?(event: SubmitEvent, context: LlmComponentContext): void;
}

export interface ValidateRequestEvent {
  payload: string;
}

export interface SubmitEvent {
}

export interface ChangeBotMessagesLlmEvent {
  messages: NonRawMessage[];
  messageType: 'fullResponse' | 'outOfScopeMessage' | 'refineQuestion'
}

export interface ChatEntry {
  role: 'user' | 'system' | 'assistant';
  content: string;
  turn: number;
  retry: boolean;
  tag?: string;
}

export interface ValidateResponseEvent {
  payload: string;
  validationEntities?: string[];
  entityMatches?: Map<string, object[]>
  entityValidationErrors?: Map<string, string>
  jsonValidationErrors?: Map<string, string>
  allValidationErrors?: string[];
}

