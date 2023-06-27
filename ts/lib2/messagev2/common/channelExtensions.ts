import { MessageUtil } from '../internal';

export enum ChannelType {
  facebook = 'facebook',
  webhook = 'webhook',
  slack = 'slack',
  msteams = 'msteams',
  cortana = 'cortana',
  websdk = 'websdk',
  androidsdk = 'androidsdk',
  iossdk = 'iossdk',
  twilio = 'twilio',
  test = 'test',
}


/**
 * This represents a set of channel-specific extension properties.
 */
export class ChannelExtensions extends Map<ChannelType, Map<string, any>> {

  /**
   * Set a new channel-specific extension property.
   * @param {ChannelType} channelType - The channel type.
   * @param {string} propertyName - The name of the property.
   * @param {any} propertyValue - The value of the property.
   */
  public setExtensionProperty(channelType: ChannelType, propertyName: string, propertyValue: any): void {
    if (!channelType || !propertyName) {
      throw new Error('channelType and propertyName must be provided.');
    }

    let channelSpecificProperties: Map<string, any> = this[channelType];
    if (!channelSpecificProperties) {
      channelSpecificProperties = new Map();
      this[channelType] = channelSpecificProperties;
    }
    channelSpecificProperties[propertyName] = propertyValue;
  }

  /**
   * Get a channel-specific extension property.
   * @param {ChannelType} channelType - The channel type.
   * @param {string} propertyName - The name of the property.
   * @returns {any} The value of the property.
   */
  public getExtensionProperty(channelType: ChannelType, propertyName: string): any {
    if (!channelType || !propertyName) {
      throw new Error('channelType and propertyName must be provided.');
    }
    let channelSpecificProperties = this[channelType];
    return channelSpecificProperties ?  channelSpecificProperties[propertyName] : undefined;
  }

  /**
   * Check whether a channel-specific extension property is defined or not.
   * @param {ChannelType} channelType - The channel type.
   * @param {string} propertyName - The name of the property.
   * @returns {boolean} flag that indicates if the property is set
   */
  public hasExtensionProperty(channelType: ChannelType, propertyName: string): boolean {
    if (!channelType || !propertyName) {
      throw new Error('channelType and propertyName must be provided.');
    }
    let channelSpecificProperties = this[channelType];
    return channelSpecificProperties?.has(propertyName);
  }
}

/**
 * Abstract class that can be extended by message objects that support channel extensions
 */
export abstract class ChannelCustomizable {
  private channelExtensions: ChannelExtensions;

  /**
   * Deserialize nested object properties into corresponding class instances
   */
  public deserializeNestedProperties(): void {
    if (this.channelExtensions) {
      this.channelExtensions = MessageUtil.deserializeChannelExtensions(this.channelExtensions);
    }
  }

  /**
   * Gets the channel extensions
   * @returns {ChannelExtensions} The channel extensions
   */
  public getChannelExtensions(): ChannelExtensions {
    return this.channelExtensions;
  }

  /**
   * Get the value of a channel extension property
   * @param {ChannelType} channelType - The channel type.
   * @param {string} propertyName - The name of the property.
   * @returns {any} The property value
   */
  public getChannelExtensionProperty(channelType: ChannelType, propertyName: string): any {
    return this.channelExtensions?.getExtensionProperty(channelType, propertyName);
  }

  /**
   * Sets a channel-specific extension property
   * @param {ChannelType} channelType - The channel type.
   * @param {string} propertyName - The name of the property.
   * @param {any} propertyValue - The value of the property.
   * @returns The current instance of this class.
   */
  public setChannelExtensionProperty(channelType: ChannelType, propertyName: string, propertyValue: any): this {
    if (!this.channelExtensions) {
      this.channelExtensions =  new ChannelExtensions();
    }
    this.channelExtensions.setExtensionProperty(channelType, propertyName, propertyValue);
    return this;
  }
}



