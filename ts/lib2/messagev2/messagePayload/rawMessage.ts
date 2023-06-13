/**
 * Represents a raw message.
 */
export class RawMessage {
  public readonly type: string = 'raw';
  private payload: object;

  /**
   * Creates an instance of the RawMessage class.
   * @param payload The message payload.
   */
  constructor(payload: object) {
    this.payload = payload;
  }

  /**
   * Convert the message to JSON object
   * @returns The message in JSON format
   */
  public toJson(): object {
    return JSON.parse(JSON.stringify(this));
  }

  /**
   * Gets the payload of the raw message.
   * @returns The message payload.
   */
  public getPayload(): object {
    return this.payload;
  }

  /**
   * Sets the payload of the raw message.
   * @param payload The message payload to set.
   * @returns The updated instance of the RawMessage.
   */
  public setPayload(payload: object): this {
    this.payload = payload;
    return this;
  }
}
