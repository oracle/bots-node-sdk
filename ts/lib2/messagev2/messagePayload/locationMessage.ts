import { NonRawMessage, MessageUtil } from '../internal';

/**
 * Represents a geo location message sent by the user to the bot.
 * @extends NonRawMessage
 */
export class LocationMessage extends NonRawMessage {
  public readonly type: string = 'location';
  private location: Location;

  /**
   * Deserialize nested object properties into corresponding class instances
   */
  public deserializeNestedProperties(): void {
      super.deserializeNestedProperties();
      this.location = MessageUtil.deserializeLocation(this.location);
  }

  /**
   * Constructs a LocationMessage object with the specified location.
   * @param {Location} location The location of the message.
   */
  constructor(location: Location) {
    super();
    this.location = location;
  }

  /**
   * Gets the location of the message.
   * @returns {Location} The location of the message.
   */
  public getLocation(): Location {
    return this.location;
  }

}

/**
 * Represents a location with title, URL, latitude, and longitude.
 */
export class Location {
  private title: string;
  private url: string;
  private latitude: number;
  private longitude: number;

  /**
   * Creates a new Location instance.
   * @param {number} latitude The latitude coordinate of the location.
   * @param {number} longitude The longitude coordinate of the location.
   */
  constructor(latitude: number, longitude: number) {
    this.latitude = latitude;
    this.longitude = longitude;
  }

  /**
   * Gets the title of the location.
   * @returns {string} The title of the location.
   */
  public getTitle(): string {
    return this.title;
  }

  /**
   * Gets the URL of the location.
   * @returns {string} The URL of the location.
   */
  public getUrl(): string {
    return this.url;
  }

  /**
   * Gets the latitude coordinate of the location.
   * @returns {number} The latitude coordinate of the location.
   */
  public getLatitude(): number {
    return this.latitude;
  }

  /**
   * Gets the longitude coordinate of the location.
   * @returns {number} The longitude coordinate of the location.
   */
  public getLongitude(): number {
    return this.longitude;
  }
}
