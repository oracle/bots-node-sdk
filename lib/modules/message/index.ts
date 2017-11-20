import * as Joi from 'joi';
import { MessageModel } from './common';

// exports
export * from './facebook';
export { MessageModel }
export const MessageModelProvider = (joi: any) => {
  return MessageModel;
}