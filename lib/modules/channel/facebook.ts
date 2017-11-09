export module Facebook {
  /**
   * define message classes
   */
  export class Message {
    public quick_replies: QuickReply[];
    public text: string;
    public attachment: Attachment;

    public static messageWithText(text: string, quick_replies?: QuickReply[]): Message {
      return Object.assign(new this(), { text, quick_replies });
    }

    public static messageWithTemplate(payload: TemplatePayload) {
      return this.messageWithAttachment(new Template(payload));
    }

    protected static messageWithAttachment(attachment: Attachment) {
      return Object.assign(new this(), { attachment });
    }

    addQuickReplies(replies: QuickReply[]): this {
      this.quick_replies = (this.quick_replies || []).concat(replies).slice(0, 10);
      return this;
    }
  }

  /**
   * define attachment types (for attachment messages)
   */
  export type AttachmentType = 'audio' | 'file' | 'image' | 'video' | 'template';
  export abstract class Attachment {
    constructor(public type: AttachmentType, public payload: AttachmentPayload) { }
  }
  export abstract class AttachmentPayload { }


  // TODO: additional Attachment template implementations
  export class AudioAttachment extends Attachment { /* ... */ }
  export class FileAttachment extends Attachment { /* ... */ }
  export class ImageAttachment extends Attachment { /* ... */ }
  export class VideoAttachment extends Attachment { /* ... */ }

  /**
   * https://developers.facebook.com/docs/messenger-platform/send-messages/templates
   */
  export type TemplateType = 'button' | 'generic' | 'list' | 'open_graph' | 'receipt'; // TODO: airline + others
  export class Template extends Attachment {
    constructor(public payload: TemplatePayload) {
      super('template', payload);
    }
  }
  export abstract class TemplatePayload extends AttachmentPayload {
    constructor(public template_type: TemplateType) { super(); }
  }

  /**
   * ButtonTemplate class. Template payload object
   * https://developers.facebook.com/docs/messenger-platform/send-messages/template/button
   */
  export class ButtonTemplate extends TemplatePayload {
    constructor(public text: string, public buttons: Button[]) {
      super('button');
    }
  }

  /**
   * GenericTemplate class. Template payload object
   * https://developers.facebook.com/docs/messenger-platform/send-messages/template/generic
   */
  export class GenericTemplate extends TemplatePayload {
    constructor(
      public elements: Element[], // max 10
      public sharable?: boolean,
      public image_aspect_ratio?: 'horizontal' | 'square',
    ) {
      super('generic');
    }
  }

  /**
   * ListTemplate class. Template payload object
   * https://developers.facebook.com/docs/messenger-platform/send-messages/template/list
   */
  export class ListTemplate extends TemplatePayload {
    constructor(
      public elements: Element[], // min 2, max 4
      public buttons?: Button[], // max 1
      public top_element_style?: 'large' | 'compact',
    ) {
      super('list');
    }
  }

  /**
   * ReceiptTemplate class. Template payload object.
   * https://developers.facebook.com/docs/messenger-platform/send-messages/template/receipt
   */
  export class ReceiptTemplate extends TemplatePayload {
    constructor(
      public order_number: string,
      public merchant_name: string,
      public recipient_name: string,
      public payment_method: string,
      public currency: string,
      public summary: ReceiptSummary,
      public elements: ReceiptElement[],
      public address?: Address,
      public adjustments?: {name: string, amount: number}[],
      public order_url?: string,
      public sharable?: boolean,
    ) {
      super('receipt');
    }
  }

  /**
   * Element class. for use in templates supporting "elements"
   */
  export class Element {
    constructor(
      public title: string,
      public subtitle?: string,
      public image_url?: string,
      public default_action?: URLButton,
      public buttons?: Button[], // max 3
    ) {
      if (default_action) { // default action is URLButton w/o title.
        delete default_action.title;
      }
    }
  }

  /**
   * ReceiptElement class. for use in ReceiptTemplate
   */
  export class ReceiptElement {
    constructor(
      public title: string,
      public price: number,
      public quantity: number,
      public image_url?: string,
      public subtitle?: string,
      public currency?: string
    ) { }
  }
  /**
   * ReceiptSummary class. for use in ReceiptTemplate
   */
  export class ReceiptSummary {
    constructor(
      public total_cost: number,
      public subtotal?: number,
      public shipping_cost?: number,
      public total_tax?: number,
    ) { }
  }

  /**
   * Address class.
   */
  export class Address {
    constructor(
      public street_1: string,
      public street_2: string,
      public city: string,
      public state: string,
      public postal_code: string,
      public country: string,
    ) { }
  }

  /**
   * Buttons
   * https://developers.facebook.com/docs/messenger-platform/send-messages/buttons
   */
  export type ButtonType = 'web_url' | 'postback' | 'phone_number' | 'element_share' | 'payment' | 'account_link' | 'account_unlink';
  export abstract class Button {
    constructor(public type: ButtonType, public title?: string) { }
  }

  /**
   * URlButton class.
   * https://developers.facebook.com/docs/messenger-platform/send-messages/buttons/url
   */
  export class URLButton extends Button {
    constructor(
      public title: string,
      public url: string,
      public webview_height_ratio?: 'compact' | 'tall' | 'full',
      public messenger_extensions?: boolean,
      public fallback_url?: string,
      public webview_share_button?: 'hide',
    ) {
      super('web_url', title);
      // TODO: url validation.
    }
  }

  /**
   * PostbackButton class.
   * https://developers.facebook.com/docs/messenger-platform/send-messages/buttons/postback
   */
  export class PostbackButton extends Button {
    constructor(
      public title: string,
      public payload: any,
    ) {
      super('postback', title);
    }
  }

  /**
   * CallButton class.
   * https://developers.facebook.com/docs/messenger-platform/send-messages/buttons/call
   */
  export class CallButton extends Button {
    constructor(
      public title: string,
      public payload: string,
    ) {
      super('phone_number', title);
      if (payload.indexOf('+') !== 0) {
        throw new Error('CallButton payload must begin with "+"');
        // TODO: other validations
      }
    }
  }

  /**
   * ShareButton class.
   * https://developers.facebook.com/docs/messenger-platform/send-messages/buttons/share
   */
  export class ShareButton extends Button {
    constructor(
      public share_contents?: Message,
    ) {
      super('element_share');
    }
  }

  /**
   * BuyButton class.
   * https://developers.facebook.com/docs/messenger-platform/send-messages/buttons/buy
   */
  export class BuyButton extends Button {
    constructor(
      public title: string,
      public payload: string,
      public payment_summary: PaymentSummary,
    ) {
      super('payment', title);
    }
  }

  export type PaymentSummary = {
    currency: string;
    is_test_payment?: boolean;
    payment_type: 'FIXED_AMOUNT' | 'FLEXIBLE_AMOUNT';
    merchant_name: string;
    requested_user_info: ('shipping_address' | 'contact_name' | 'contact_phone' | 'contact_email')[];
    price_list: { label: string; amount: string | number }[];
  }

  /**
   * https://developers.facebook.com/docs/messenger-platform/send-messages/buttons/login
   * https://developers.facebook.com/docs/messenger-platform/account-linking/authentication
   */
  export class LoginButton extends Button {
    constructor(public url: string) {
      super('account_link');
    }
  }

  /**
   * https://developers.facebook.com/docs/messenger-platform/send-messages/buttons/logout
   */
  export class LogoutButton extends Button {
    constructor(public url: string) {
      super('account_unlink');
    }
  }

  /**
   * https://developers.facebook.com/docs/messenger-platform/send-messages/quick-replies
   */
  export class QuickReply {
    constructor(
      content_type: 'text' | 'location',
      title?: string, // display text
      image_url?: string, // image in quickreply button
      payload?: any, // callback payload
    ) { }
  }

}
