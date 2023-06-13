import {
  LocationAction, PostbackAction, ShareAction, CallAction, UrlAction, SubmitFormAction, Keyword, ReadOnlyForm, PaginationInfo
  , Voice, MessageUtil, Row, TableHeading, DatePickerField, MultiSelectField, SelectFieldOption, NumberInputField, SingleSelectField
  , TextField, TextInputField, TimePickerField, ToggleField, LinkField, Field, ReadOnlyField, TextMessage, Attachment, AttachmentType
  , AttachmentMessage, Card, CardMessage, CommandMessage, CommandType, EditFormMessage, FormMessage, NonRawMessage, RawMessage
  , TableMessage, TableFormMessage
} from './internal';

/**
 * Factory class to create the various message types of Oracle Digital Assistant Conversation Message Model (CMM)
 */
export class MessageFactory {

  /**
   * Converts a message from JSON representation into an instance of corresponding message type class.
   * @param {any} json - The JSON representation of the message
   * @returns {NonRawMessage} An instance of a subclass of a NonRawMessage.
   */
  public static messageFromJson<T extends NonRawMessage>(json: any): T {
    return MessageUtil.deserializeMessage(json);
  }

  /**
   * Create a new voice settings object
   * @param {string} text - The text of the voice settings
   * @returns {Voice} A new instance of the Voice class.
   */
  public static createVoice(text: string): Voice {
    return new Voice(text);
  }

  /**
   * Create a new text message
   * @param {string} text - The text content of the message.
   * @returns {TextMessage} A new instance of the TextMessage class.
   */
  public static createTextMessage(text: string): TextMessage {
    return new TextMessage(text);
  }

  /**
   * Creates a new card
   * @param {string} title The title of the card
   * @returns {Card} A new instance of the Card.
   */
  public static createCard(title: string): Card {
    return new Card(title);
  }

  /**
   * Creates a new card message
   * @param {Card[]} cards The cards of the message.
   * @returns {CardMessage} A new instance of the CardMessage.
   */
  public static createCardMessage(cards?: Card[]): CardMessage {
    return new CardMessage(cards);
  }

  /**
   * Creates a new attachment
   * @param {AttachmentType} type The type of the attachment (required).
   * @param {string} url The URL of the attachment (required).
   * @returns {Attachment} A new instance of the Attachment class.
   */
  public static createAttachment(type: AttachmentType, url: string): Attachment {
    return new Attachment(type, url);
  }

  /**
   * Creates a new attachment message
   * @param {Attachment} attachment The attachment of the message.
   * @returns {AttachmentMessage} A new instance of AttachmentMessage.
   */
  public static createAttachmentMessage(attachment: Attachment): AttachmentMessage {
    return new AttachmentMessage(attachment);
  }

  /**
   * Creates an instance of the CommandMessage class.
   * @param {CommandType} command The command type.
   * @returns {CommandMessage} The created instance of the CommandMessage.
   */
  public static createCommandMessage(command: CommandType): CommandMessage {
    return new CommandMessage(command);
  }

  /**
   * Creates an instance of the EditFormMessage class.
   * @param {Field[]} fields The list of fields in the edit form message.
   * @returns {EditFormMessage} The created instance of the EditFormMessage.
   */
  public static createEditFormMessage(fields?: Field[]): EditFormMessage {
    return new EditFormMessage(fields);
  }

  // Other message creation methods...

  /**
   * Creates an instance of the ReadOnlyForm class.
   * @param {ReadOnlyField[]} fields The list of fields in the read-only form.
   * @returns {ReadOnlyForm} The created instance of the ReadOnlyForm.
   */
  public static createReadOnlyForm(fields?: ReadOnlyField[]): ReadOnlyForm {
    return new ReadOnlyForm(fields);
  }

  /**
   * Creates an instance of the FormMessage class.
   * @param {ReadOnlyForm[]} forms The list of forms in the message.
   * @returns {FormMessage} The created instance of the FormMessage.
   */
  public static createFormMessage(forms?: ReadOnlyForm[]): FormMessage {
    return new FormMessage(forms);
  }

  /**
   * Creates an instance of the Row class.
   * @param {ReadOnlyField[]} fields The list of fields in the row
   * @returns {Row} The created instance of the Row.
   */
  public static createRow(fields?: ReadOnlyField[]): Row {
    return new Row(fields);
  }

  /**
   * Creates an instance of the TableHeading class.
   * @param {string} label The label of the header column
   * @returns {TableHeading} The created instance of the TableHeading.
   */
  public static createTableHeading(label: string): TableHeading {
    return new TableHeading(label);
  }

  /**
   * Creates a new instance of TableMessage.
   * @param {TableHeading[]} headings The table headings.
   * @param {Row[]} rows The table rows.
   * @returns {TableMessage} A new instance of TableMessage.
   */
  public static createTableMessage(headings?: TableHeading[], rows?: Row[]): TableMessage {
    return new TableMessage(headings, rows);
  }

  /**
   * Creates an instance of TableFormMessage.
   * @param {TableHeading[]} headings The table headings.
   * @param {Row[]} rows The table rows.
   * @param {ReadOnlyForm[]} forms The read-only forms.
   * @returns {TableFormMessage} A new instance of TableFormMessage.
   */
  public static createTableFormMessage(headings?: TableHeading[], rows?: Row[], forms?: ReadOnlyForm[]): TableFormMessage {
    return new TableFormMessage(headings, rows, forms);
  }

  /**
   * Creates an instance of the RawMessage class.
   * @param {object} payload The message payload.
   * @returns {RawMessage} The created instance of the RawMessage.
   */
  public static createRawMessage(payload: object): RawMessage {
    return new RawMessage(payload);
  }

  /**
   * Creates an instance of the PaginationInfo class.
   * @param {number} totalCount The total count.
   * @param {number} rangeSize The range size.
   * @param {number} rangeStart The range start.
   * @returns {PaginationInfo} The created instance of the PaginationInfo.
   */
  public static createPaginationInfo(totalCount: number, rangeSize: number, rangeStart: number): PaginationInfo {
    return new PaginationInfo(totalCount, rangeSize, rangeStart);
  }

  /**
   * Create a new postback action
   * @param {string} label The label of the postback action.
   * @param {object} postback The postback associated with the action.
   * @returns {PostbackAction} A new instance of the PostbackAction class.
   */
  public static createPostbackAction(label: string, postback: object): PostbackAction {
    return new PostbackAction(label, postback);
  }

  /**
   * Create a new submit form action
   * @param {string} label The label of the action.
   * @param {object} postback The postback associated with the action.
   * @returns {SubmitFormAction} A new instance of the SubmitFormAction class.
   */
  public static createSubmitFormAction(label: string, postback?: object): SubmitFormAction {
    return new SubmitFormAction(label, postback);
  }

  /**
   * Create a new action to send the geo location
   * @param {string} label The label of the action.
   * @returns {LocationAction} A new instance of the LocationAction class.
   */
  public static createLocationAction(label: string): LocationAction {
    return new LocationAction(label);
  }

  /**
   * Create a new share action (facebook only)
   * @param {string} label The label of the action.
   * @returns {ShareAction} A new instance of the ShareAction class.
   */
  public static createShareAction(label: string): ShareAction {
    return new ShareAction(label);
  }

  /**
   * Create a new URL action
   * @param {string} label The label of the URL action.
   * @param {string} url The URL associated with the action.
   * @returns {UrlAction} A new instance of the UrlAction class.
   */
  public static createUrlAction(label: string, url: string): UrlAction {
    return new UrlAction(label, url);
  }

  /**
   * Create a new Call action
   * @param {string} label The label of the Call action.
   * @param {string} phoneNumber The phone number associated with the call action.
   * @returns {CallAction} A new instance of the CallAction class.
   */
  public static createCallAction(label: string, phoneNumber: string): CallAction {
    return new CallAction(label, phoneNumber);
  }

  /**
   * Creates an instance of Keyword.
   * @param {any} postback The postback to set.
   * @param {string[]} keywords The keywords to set.
   * @returns {Keyword} A new instance of the Keyword class.
   */
  public static createKeyword(postback: any, keywords?: string[]): Keyword {
    return new Keyword(postback, keywords);
  }

  /**
   * Creates an instance of the DatePickerField class.
   * @param {string} id The ID of the date picker field.
   * @param {string} label The label of the field.
   * @returns {DatePickerField} The created instance of the DatePickerField.
   */
  public static createDatePickerField(id: string, label: string): DatePickerField {
    return new DatePickerField(id, label);
  }

  /**
   * Creates an instance of the SingleSelectField class.
   * @param {string} id The unique identifier of the field.
   * @param {string} label The label of the field.
   * @param {SelectFieldOption[]} options The options of the field.
   * @returns {SingleSelectField} The created instance of the SingleSelectField.
   */
  public static createSingleSelectField(id: string, label: string, options?: SelectFieldOption[]): SingleSelectField {
    return new SingleSelectField(id, label, options);
  }

  /**
   * Creates an instance of the MultiSelectField class.
   * @param {string} id The ID of the field.
   * @param {string} label The label of the field.
   * @param {SelectFieldOption[]} options The options of the field.
   * @returns {MultiSelectField} The created instance of the MultiSelectField.
   */
  public static createMultiSelectField(id: string, label: string, options?: SelectFieldOption[]): MultiSelectField {
    return new MultiSelectField(id, label, options);
  }

  /**
   * Creates an instance of the SelectFieldOption class.
   * @param {string} label The label of the option.
   * @param {any} value The value of the option. If not specified, the label is used as the value.
   * @returns {SelectFieldOption} The created instance of the SelectFieldOption.
   */
  public static createSelectFieldOption(label: string, value?: any): SelectFieldOption {
    return new SelectFieldOption(label, value);
  }

  /**
   * Creates an instance of the NumberInputField class.
   * @param {string} id The unique identifier of the field.
   * @param {string} label The label of the field.
   * @returns {NumberInputField} The created instance of the NumberInputField.
   */
  public static createNumberInputField(id: string, label: string): NumberInputField {
    return new NumberInputField(id, label);
  }

  /**
   * Creates an instance of the TextField class.
   * @param {string} label The label of the field.
   * @param {any} value The value of the field.
   * @returns {TextField} The created instance of the TextField.
   */
  public static createTextField(label: string, value: any): TextField {
    return new TextField(label, value);
  }

  /**
   * Creates an instance of the TextInputField class.
   * @param {string} id The unique identifier of the field.
   * @param {string} label The label of the field.
   * @returns {TextInputField} The created instance of the TextInputField.
   */
  public static createTextInputField(id: string, label: string): TextInputField {
    return new TextInputField(id, label);
  }

  /**
   * Creates an instance of the TimePickerField class.
   * @param {string} id The unique identifier of the field.
   * @param {string} label The label of the field.
   * @returns {TimePickerField} The created instance of the TimePickerField.
   */
  public static createTimePickerField(id: string, label: string): TimePickerField {
    return new TimePickerField(id, label);
  }

  /**
   * Creates an instance of the ToggleField class.
   * @param {string} id The unique identifier of the field.
   * @param {string} label The label of the field.
   * @param {any} valueOff The value when the toggle is off.
   * @param {any} valueOn The value when the toggle is on.
   * @returns {ToggleField} The created instance of the ToggleField.
   */
  public static createToggleField(id: string, label: string, valueOff: any, valueOn: any): ToggleField {
    return new ToggleField(id, label, valueOff, valueOn);
  }

  /**
   * Creates an instance of the LinkField class.
   * @param {string} label The label of the link field.
   * @param {string} value The value of the link field.
   * @param {string} linkLabel The link label of the link field.
   * @returns {LinkField} The created instance of the LinkField.
   */
  public static createLinkField(label: string, value: string, linkLabel: string): LinkField {
    return new LinkField(label, value, linkLabel);
  }

  // fields below will be added in 23.08

  // /**
  //  * Creates an instance of the ActionField class.
  //  * @param action The action of the action field.
  //  * @returns The created instance of the ActionField.
  //  */
  // public static createActionField(action: Action) {
  //   return new ActionField(action);
  // }

  // /**
  //  * Creates an instance of the MediaField class.
  //  * @param label The label of the field.
  //  * @param value The URL value of the field
  //  * @param mediaType The media type for the field.
  //  * @returns The created instance of the MediaField.
  //  */
  // public static createMediaField(label: string, value: string, mediaType: MediaType): MediaField {
  //   return new MediaField(label, value, mediaType);
  // }

}
