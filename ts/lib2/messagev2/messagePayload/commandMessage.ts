import { NonRawMessage } from '../internal';

/**
 * Represents a command message.
 * @extends NonRawMessage
 */
export class CommandMessage extends NonRawMessage {
  public readonly type: string = 'command';
  private command: CommandType;
  private properties?: Map<string, any>;

  /**
   * Creates an instance of the CommandMessage class.
   * @param {CommandType} command The command type.
   */
  constructor(command: CommandType) {
    super();
    this.command = command;
  }

  /**
   * Gets the command of the message.
   * @returns {CommandType} The command of the message.
   */
  public getCommand(): CommandType {
    return this.command;
  }

  /**
   * Sets the command of the message.
   * @param {CommandType} command The command to set.
   * @returns {this} The updated instance of the CommandMessage.
   */
  public setCommand(command: CommandType): this {
    this.command = command;
    return this;
  }

  /**
   * Gets the properties of the message.
   * @returns {Map<string, any>} The properties of the message.
   */
  public getProperties(): Map<string, any> {
    return this.properties;
  }

  /**
   * Gets the value of a property.
   * @param {string} propertyName The name of the property.
   * @returns {any} The property value.
   */
  public getPropertyValue(propertyName: string): any {
    return this.properties ? this.properties[propertyName] : undefined;
  }

  /**
   * Sets the properties of the message.
   * @param {Map<string, any>} properties The properties to set.
   * @returns {this} The updated instance of the CommandMessage.
   */
  public setProperties(properties: Map<string, any>): this {
    this.properties = properties;
    return this;
  }

  /**
   * Add a property to the message.
   * @param {string} name The name of the property.
   * @param {any} value The value of the property.
   * @returns {this} The updated instance of the CommandMessage.
   */
  public addProperty(name: string, value: any): this {
    if (!this.properties) {
      this.properties = new Map();
    }
    this.properties[name] = value;
    return this;
  }
}

/**
 * Represents the type of command.
 */
export enum CommandType {
  repeat = 'repeat',
  readToMe = 'readToMe',
  speakSlowly = 'speakSlowly',
  volumeUp = 'volumeUp',
  volumeDown = 'volumeDown',
  mute = 'mute',
  unmute = 'unmute',
  startDictationMode = 'startDictationMode',
  stopDictationMode = 'stopDictationMode',
  startAmbientMode = 'startAmbientMode',
  stopAmbientMode = 'stopAmbientMode',
  startAudioRecording = 'startAudioRecording',
  stopAudioRecording = 'stopAudioRecording',
  repeatLouder = 'repeatLouder',
  repeatSlowly = 'repeatSlowly',
  humanAgent = 'humanAgent',
  hold = 'hold',
  resume = 'resume',
  goBack = 'goBack',
  home = 'home',
  exit = 'exit',
  startDoNotDisturbMode = 'startDoNotDisturbMode',
  stopDoNotDisturbMode = 'stopDoNotDisturbMode'
}
