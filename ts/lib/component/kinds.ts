import { InvocationCallback } from '../../common/definitions';
import { EntityResolutionContext } from '../entity';
import { Attachment, Location } from '../message';
import { CustomComponentContext } from './sdk';
/**
 * Component metadata defintions
 */
export interface BaseComponentMetadata {
  name: string;
  supportedActions?: string[];
}

export type CustomComponentPropertyType =
  'object' | 'string' | 'boolean' | 'int' | 'double' | 'float' | 'long' | 'list' | 'map' | 'stringVariable' | 'booleanVariable' | 'intVariable' |
  'doubleVariable' | 'floatVariable' | 'longVariable' | 'mapVariable' | 'listVariable' | 'nlpresultVariable' | 'entityVariable'


export interface CustomComponentMetadata extends BaseComponentMetadata {
  properties?: {
    [name: string]: {
      type: CustomComponentPropertyType,
      required?: boolean,
    }
  };
}

export interface EntityEventHandlerMetadata extends BaseComponentMetadata {
  eventHandlerType: 'ResolveEntities';
  events?: string[];
}

export type ComponentMetadata = CustomComponentMetadata | EntityEventHandlerMetadata;

export type Component = CustomComponent | EntityEventHandler;

export interface CustomComponent {
  metadata(): CustomComponentMetadata;
  invoke(context: CustomComponentContext, done?: InvocationCallback): void;
}

export interface EntityEventHandler {
  metadata(): EntityEventHandlerMetadata;
  handlers(): EntityEventHandlers
}

export interface EntityEventHandlers {
  entity?: EntityEvent;
  items?: EntityItems;
  custom?: any;
}

export interface EntityItems {
  [key: string]: EntityItemEvents;
}

export interface EntityEvent {
  init?(event: EntityEvent, context: EntityResolutionContext): void
  validate?(event: EntityValidateEvent, context: EntityResolutionContext): void
  publishMessage?(event: EntityPublishMessageEvent, context: EntityResolutionContext): void
  maxPromptsReached?(event: EntityMaxPromptsReachedEvent, context: EntityResolutionContext): void
  resolved?(event: EntityEvent, context: EntityResolutionContext): void
  attachmentReceived?(event: EntityAttachmentReceivedEvent, context: EntityResolutionContext): void
  locationReceived?(event: EntityLocationReceivedEvent, context: EntityResolutionContext): void
}

export interface EntityItemEvents {
  shouldPrompt?(event: EntityValidateEvent, context: EntityResolutionContext): void
  validate?(event: EntityItemValidateEvent, context: EntityResolutionContext): void
  publishPromptMessage?(event: EntityItemPublishPromptMessageEvent, context: EntityResolutionContext): void
  publishDisambiguationMessage?(event: EntityItemPublishDisambiguationMessageEvent, context: EntityResolutionContext): void
  maxPromptsReached?(event: EntityItemMaxPromptsReachedEvent, context: EntityResolutionContext): void
}

// marker interface for entity event types, some events dont have any event properties, so thats why
// this is an empty interface
export interface EntityEvent {
}

export interface EntityValidateEvent extends EntityEvent {
  currentItem: string;
  oldValues: [string: object];
  newValues: [string: object];
}

export interface EntityPublishMessageEvent extends EntityEvent {
  currentItem: string;
  promptCount?: number;
  disambiguationValues?: [string: object];
}

export interface EntityMaxPromptsReachedEvent extends EntityEvent {
  currentItem: string;
  promptCount: number;
}

export interface EntityAttachmentReceivedEvent extends EntityEvent {
  value: Attachment;
}

export interface EntityLocationReceivedEvent extends EntityEvent {
  value: Location;
}

export interface EntityItemValidateEvent extends EntityEvent {
  oldValue: object;
  newValue: object;
}

export interface EntityItemPublishPromptMessageEvent extends EntityEvent {
  promptCount: number;
}

export interface EntityItemPublishDisambiguationMessageEvent extends EntityEvent {
  disambiguationValues: object[];
}

export interface EntityItemMaxPromptsReachedEvent extends EntityEvent {
  promptCount: number;
}



