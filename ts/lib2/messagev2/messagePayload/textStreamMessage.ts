import { TextMessage } from './textMessage';

/**
 * Represents a text stream message.
 * @extends TextMessage
 */
export class TextStreamMessage extends TextMessage {
  public readonly type: string = 'textStream';

  /**
   * Create a new TextStreamMessage object.
   * @param {string} text - The latest text chunk of the stream
   * @param {string} aggregateText - Aggregate text that has been streamed so far
   * @param {string} streamId - Unique identifier of the text stream
   * @param {StreamState} streamState - the state of the stream: start, running or end
   */
  constructor(text: string, private aggregateText: string, private streamId: string, private streamState: StreamState) {
    super(text);
    this.aggregateText = aggregateText;
    this.streamId = streamId;
    this.streamState = streamState;
  }

  /**
   * Get the aggregate text content of the message.
   * @returns {string} The aggregate message text.
   */
  public getAggregateText(): string {
    return this.aggregateText;
  }

  /**
   * Set the aggregate text content of the message.
   * @param {string} aggregateText - The text to set.
   * @returns {TextStreamMessage} The current instance of the TextStreamMessage class.
   */
  public setAggregateText(aggregateText: string): this {
    this.aggregateText = aggregateText;
    return this;
  }

  /**
   * Get the ID of the text stream
   * @returns {string} The stream ID
   */
  public getStreamId(): string {
    return this.streamId;
  }

  /**
   * Get the state of the text stream
   * @returns {StreamState} The stream state
   */
  public getStreamState(): StreamState {
    return this.streamState;
  }

}

/**
 * Represents the state of the text stream
 */
export enum StreamState {
  start = 'start',
  running = 'running',
  end = 'end'
}
