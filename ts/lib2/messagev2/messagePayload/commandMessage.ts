import { NonRawMessage } from '../internal';

/**
 * Represents a command message.
 * @extends NonRawMessage
 */
export class CommandMessage extends NonRawMessage {
  public readonly type: string = 'command';
  private command: CommandType;

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
