import {
  Action, LocationAction, PostbackAction, ShareAction, CallAction, UrlAction, SubmitFormAction, Keyword, Voice
  , DatePickerField, MultiSelectField, SelectFieldOption, NumberInputField, SingleSelectField, TextField, TextInputField
  , TimePickerField, ToggleField, LinkField, Field, TextMessage, Attachment, AttachmentMessage, Card, CardMessage
  , CommandMessage, EditFormMessage, FormMessage, FormSubmissionMessage, NonRawMessage, TableMessage, TableFormMessage, ReadOnlyForm
  , PaginationInfo, ChannelExtensions, Row, TableHeading, Location, LocationMessage, PostbackMessage
}
  from '../internal';

  /**
   * Utility class for message deserialization
   *
   * FOR INTERNAL USE ONLY
   */
export class MessageUtil {

  public static deserializeMessage<T extends NonRawMessage>(json: any): T {
    const type: string = json.type;
    let msg: T;
    switch (type) {
      case 'attachment':
        msg = Object.assign(new AttachmentMessage(null), json);
        break;
      case 'card':
        msg = Object.assign(new CardMessage(), json);
        break;
      case 'command':
        msg = Object.assign(new CommandMessage(null), json);
        break;
      case 'editForm':
        msg = Object.assign(new EditFormMessage(), json);
        break;
      case 'form':
        msg = Object.assign(new FormMessage(), json);
        break;
      case 'formSubmission':
        msg = Object.assign(new FormSubmissionMessage(), json);
        break;
      case 'location':
        msg = Object.assign(new LocationMessage(null), json);
        break;
      case 'postback':
        msg = Object.assign(new PostbackMessage(), json);
        break;
      case 'tableForm':
        msg = Object.assign(new TableFormMessage(), json);
        break;
      case 'table':
        msg = Object.assign(new TableMessage(), json);
        break;
      case 'text':
        msg = Object.assign(new TextMessage(null), json);
        break;
      default:
        throw new Error(`Error deserializing message, unknown message type: ${type}`);
    }
    msg.deserializeNestedProperties();
    return msg;
  }

  public static deserializeActions(json: Action[]): Action[] {
    let actions: Action[] = [];
    json.forEach(a => actions.push(MessageUtil.deserializeAction(a)));
    return actions;
  }

  public static deserializeAction<T extends Action>(json: any): T {
    const type: string = json.type;
    let action: T;
    switch (type) {
      case 'call':
        action = Object.assign(new CallAction(null, null), json);
        break;
      case 'location':
        action = Object.assign(new LocationAction(null), json);
        break;
      case 'postback':
        action = Object.assign(new PostbackAction(null, null), json);
        break;
      case 'share':
        action = Object.assign(new ShareAction(null), json);
        break;
      case 'submitForm':
        action = Object.assign(new SubmitFormAction(null), json);
        break;
      case 'url':
        action = Object.assign(new UrlAction(null, null), json);
        break;
      default:
        throw new Error(`Error deserializing action, unknown action type: ${type}`);
    }
    action.deserializeNestedProperties();
    return action;
  }

  public static deserializeKeywords(json: Keyword[]): Keyword[] {
    let keywords: Keyword[] = [];
    json.forEach(keyword => keywords.push(Object.assign(new Keyword(null), keyword)));
    return keywords;
  }

  public static deserializeSelectFieldOptions(json: SelectFieldOption[]): SelectFieldOption[] {
    let options: SelectFieldOption[] = [];
    json.forEach(option => options.push(Object.assign(new SelectFieldOption(null), option)));
    return options;
  }

  public static deserializeCards(json: Card[]): Card[] {
    let cards: Card[] = [];
    json.forEach(card => {
      let cardInstance = Object.assign(new Card(null), card);
      cardInstance.deserializeNestedProperties();
      cards.push(cardInstance);
    });
    return cards;
  }

  public static deserializeReadOnlyForms(json: ReadOnlyForm[]): ReadOnlyForm[] {
    let forms: ReadOnlyForm[] = [];
    json.forEach(form => {
      let formInstance = Object.assign(new ReadOnlyForm(), form);
      formInstance.deserializeNestedProperties();
      forms.push(formInstance);
    });
    return forms;
  }

  public static deserializeVoice(json: Voice): Voice {
    return Object.assign(new Voice(null), json);
  }

  public static deserializeAttachment(json: Attachment): Attachment {
    return Object.assign(new Attachment(null, null), json);
  }

  public static deserializeLocation(json: Location): Location {
    return Object.assign(new Location(null, null), json);
  }

  public static deserializeChannelExtensions(json: ChannelExtensions): ChannelExtensions {
    let extensions = Object.assign(new ChannelExtensions(), json);
    for (const [key, value] of Object.entries(extensions)) {
      let valueMap = Object.assign(new Map(), value);
      extensions[key] = valueMap;
    };
    return extensions;
  }

  public static deserializePaginationInfo(json: PaginationInfo): PaginationInfo {
    return Object.assign(new PaginationInfo(null, null, null), json);
  }

  public static deserializeTableHeadings(json: TableHeading[]): TableHeading[] {
    let headings: TableHeading[] = [];
    json.forEach(row => {
      let instance = Object.assign(new TableHeading(null), row);
      instance.deserializeNestedProperties();
      headings.push(instance);
    });
    return headings;
  }

  public static deserializeRows(json: Row[]): Row[] {
    let rows: Row[] = [];
    json.forEach(row => {
      let rowInstance = Object.assign(new Row(), row);
      rowInstance.deserializeNestedProperties();
      rows.push(rowInstance);
    });
    return rows;
  }

  public static deserializeFields<T extends Field>(json: T[]): T[] {
    let fields: T[] = [];
    json.forEach(f => fields.push(MessageUtil.deserializeField(f)));
    return fields;
  }

  public static deserializeField<T extends Field>(json: any): T {
    const type: string = json.displayType;
    let field: T;
    switch (type) {
      case 'datePicker':
        field = Object.assign(new DatePickerField(null, null), json);
        break;
      case 'link':
        field = Object.assign(new LinkField(null, null), json);
        break;
      case 'multiSelect':
        field = Object.assign(new MultiSelectField(null, null), json);
        break;
      case 'numberInput':
        field = Object.assign(new NumberInputField(null, null), json);
        break;
      case 'singleSelect':
        field = Object.assign(new SingleSelectField(null, null), json);
        break;
      case 'text':
        field = Object.assign(new TextField(null, null), json);
        break;
      case 'textInput':
        field = Object.assign(new TextInputField(null, null), json);
        break;
      case 'timePicker':
        field = Object.assign(new TimePickerField(null, null), json);
        break;
      case 'toggle':
        field = Object.assign(new ToggleField(null, null, null, null), json);
        break;
      default:
        throw new Error(`Error deserializing field, unknown field displayType: ${type}`);
    }
    field.deserializeNestedProperties();
    return field;
  }

}

