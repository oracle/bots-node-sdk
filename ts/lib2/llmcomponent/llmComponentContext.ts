import { BaseContext } from '../../lib/component/baseContext';
import { MessagePayload } from '../../lib/message';
import { PostbackAction } from '../messagev2';
import { ChatEntry } from './llmComponentTypes';

// Response template
const RESPONSE = {
  context: undefined
};

/**
 * The Bots LlmComponentContext is a class with convenience methods when working wih large language models
 * </p>
 * An LlmComponentContext class instance is passed as an argument to every llm event handler function.
 * @memberof module:Lib
 * @extends BaseContext
 * @alias LlmComponentContext
 */
export class LlmComponentContext extends BaseContext {

  private _chatEntries: ChatEntry[];
  private _turn: number;

  /**
   * Constructor of rest service context.
   * DO NOT USE - INSTANCE IS ALREADY PASSED TO EVENT HANDLERS
   * @param {object} request
   */
  constructor(request) {
    // Initilize the response
    const response = Object.assign({}, RESPONSE, {
      messageHistory: request.messageHistory,
    });
    super(request, response);
    this._chatEntries = request.messageHistory.entries;
    this._turn = request.messageHistory.turn;
  }

  /**
   * Adds a message to the bot response sent to the user.
   * @param {object} payload - can take a string message, or a message created using the MessageFactory
   */
  public addMessage(payload: string | MessagePayload): void {
    this.getResponse().messages = this.getResponse().messages || [];
    this.getResponse().messages.push(super.constructMessagePayload(payload));
  }

  /**
   * Set a transition action. When you use this function, the dialog engine will transition to the state defined for this transition action.
   * <p>
   * @param {string} action - name of the transition action
   */
  public setTransitionAction(action: string): void {
    this.getResponse().transitionAction = action;
  }

  /**
   * Sets an LLM prompt that will be sent next to the LLM
   * <p>
   * @param {string} prompt - the text of the prompt
   * @param {boolean} isRetry - is the prompt used to try to fix a prior invalid LLM response
   */
  public setNextLLMPrompt(prompt: string, isRetry: boolean): void {
    this.getResponse().llmPrompt = prompt;
    this.getResponse().retryPrompt = isRetry;
  }

  /**
   * Set the value of the LLM result variable
   * <p>
   * @param {object} result - the value
   */
  public setResultVariable(result: object): void {
    const varName = this.getRequest().resultVariable;
    if (varName) {
      this.setVariable(varName, result);
    }
  }

  /**
   * Get the value of the LLM result variable
   * <p>
   * @returns {object} the result value
   */
  public getResultVariable(): object | undefined {
    const varName = this.getRequest().resultVariable;
    if (varName) {
      return this.getVariable(varName);
    }
    return undefined;
  }

  /**
   * Array of chat messages that are exchanged with the LLM.
   * Each message has the following properties:
   * - role: the role under which the message is sent: system, user or assistant
   * - content: the message text
   * - turn: number indicating the refinement turn of the chat messages exchange
   * @returns {ChatEntry[]} the chat messages
   */
  public getChatHistory(): ChatEntry[] {
    return this._chatEntries;
  }

  /**
   * Returns number indicating the current refinement turn of the chat messages exchange.
   * When the first prompt is sent to the LLM the turn is 1.
   * @returns {number} the turn
   */
  public getCurrentTurn(): number {
    return this._turn;
  }

  /**
   * Returns the LLM system prompt
   * @returns {string} the prompt
   */
  public getSystemPrompt(): string {
    return this._chatEntries[0].content;
  }

  /**
   * Returns the last response sent by the LLM
   * @returns {ChatEntry} the message
   */
  public getLastAssistantMessage(): ChatEntry {
    return this.getLastMessage('assistant');
  }

  /**
   * Returns the last message sent by the user
   * @returns {ChatEntry} the message
   */
  public getLastUserMessage(): ChatEntry {
    return this.getLastMessage('user');
  }

  /**
   * Update the LLM system prompt
   * @param {string} prompt - the new prompt
   */
  public updateSystemPrompt(prompt: string): void {
    this._chatEntries[0].content = prompt;
  }

  /**
   * Update the last LLM response message
   * @param {string} message - the new message
   */
  public updateLastAssistantMessage(message: string): void {
    for (let index = this._chatEntries.length - 1; index > 0; index--) {
      if (this._chatEntries[index].role === 'assistant') {
        this._chatEntries[index].content = message;
        break;
      }
    }
  }

  /**
   * Set the request or LLM response validation error
   * @param {string} errorMessage - the error message
   * @param {string} errorCode - allowable values: 'requestFlagged', 'responseFlagged', 'requestInvalid',
   *  'responseInvalid', 'modelLengthExceeded'
   */
  public setValidationError(errorMessage: string, errorCode?: 'requestFlagged' | 'responseFlagged' | 'requestInvalid' | 'responseInvalid' | 'modelLengthExceeded'): void {
    this.getResponse().validationErrorMessage = errorMessage;
    this.getResponse().validationErrorCode = errorCode;
  }

  /**
   * Converts the message to a JSON object:
   * - it first search the first occurrence of open-curly-bracket '{' and last occurrence of close-curly-bracket '}'
   * - it then tries to parse the message between the open and close curly brackets into a JSON object.
   * - if parsing is successful, the JSON object is returned, otherwise the method returns undefined
   * @param {string} message - the message to convert
   * @returns {object | undefined} the parsed message, or undefined
   */
  public convertToJSON(message: string): object | undefined {
    const startIndex = message.indexOf('{');
    const endIndex = message.lastIndexOf('}');
    if (!(startIndex >= 0 && endIndex > startIndex)) {
        return undefined
    } else {
      let jsonText = message.slice(startIndex, endIndex + 1).replace('/\\n', '').replace('/\\r', '');
      try {
        return JSON.parse(jsonText);
      } catch (err) {
        return undefined;
      }
    }
  }

  /**
   * Returns true when JSON formatting is enabled in the associated Invoke LLM state in Visual Fow Designer
   */
  public isJsonValidationEnabled(): boolean {
    return this.getRequest().validateJson;
  }

  /**
   * Returns the number of retry prompts that have been sent to the LLM since the last successful LLM response
   */
  public getRetries(): number {
    return this.getResponse().messageHistory.retries;
  }

  /**
   * Returns the maximum number of retry prompts that will be sent to the LLM when the response is invalid
   * @returns {number} the maximum number
   */
  public getMaxRetries(): number {
    return this.getRequest().maxRetries;
  }

  /**
   * Returns the status message that is sent to the user when the LLM is invoked with a retry prompt
   * @returns {string} the message
   */
  public getRetryUserMessage(): string | undefined {
    return this.getRequest().retryUserMessage;
  }

  /**
   * Returns the JSON schema used to validate the LLM response
   * @returns {object} the json schema
   */
  public getJsonSchema(): object | undefined {
    return this.getRequest().jsonSchema;
  }

  /**
   * Returns the template used to enrich the system prompt with instructions to comply with a JSON schema
   * @returns {string} the instrution
   */
  public getJsonSchemaInstructionTemplate(): string  {
    return this.getRequest().jsonSchemaInstruction;
  }

  /**
   * Returns the template used to send a retry prompt to the LLM when validation errors have been found.
   * @returns {string} the instrution
   */
  public getInvalidResponseTemplate(): string  {
    return this.getRequest().invalidResponsePrompt;
  }

  /**
   * Sets the value of a custom property that is stored in the LLM context. A custom property can be
   * used to maintain custom state accross event handler calls while interacting with the LLM within the
   * current state in visual flow designer.
   * If you set the value to null, the custom property will be removed.
   * @param {string} name - name of the custom property
   * @param {object} value - value of the custom property
   */
  public setCustomProperty(name: string, value: any) {
    if (value === null && this.getResponse().messageHistory.customProperties) {
      delete this.getResponse().messageHistory.customProperties[name];
    } else {
      if (!this.getResponse().messageHistory.customProperties) {
        this.getResponse().messageHistory.customProperties = {};
      }
      this.getResponse().messageHistory.customProperties[name] = value;
    }
  }

  /**
   * Returns the value of a custom property that is stored in the LLM context. A custom property can be
   * used to maintain custom state accross event handler calls while interacting with the LLM within the
   * current state  in visual flow designer.
   * @return {object} value of the custom property
   * @param {string} name - name of the custom property
   */
  public getCustomProperty(name: string): any {
    if (this.getResponse().messageHistory.customProperties) {
      return this.getResponse().messageHistory.customProperties[name];
    }
    return undefined;
  }

  /**
   * Create a postback action that sends a new prompt to the LLM.
   * <p>
   * @param {string} label - the label of the postback action button
   * @param {string} prompt - the text of the prompt
   * @returns {PostbackAction} the postback action
   */
  public createLLMPromptAction(label: string, prompt: string): PostbackAction {
    return this.getMessageFactory().createPostbackAction(label,
      {'action': 'system.textReceived', 'variables': {'system.text': prompt}});
  }

  /**
   * Enriches the system prompt with JSON schema formatting instruction
   */
  public addJSONSchemaFormattingInstruction(): void {
    if (this.getJsonSchema()) {
      let prompt = this.getJsonSchemaInstructionTemplate().replace('{0}',
        JSON.stringify(this.getJsonSchema())).replace('{1}', this.getSystemPrompt());
      this.updateSystemPrompt(prompt);
    }
  }

  /**
   * Handles an invalid LLM response by sending a retry prompt to the LLM if the maximum number of retries has
   * not been reached yet. If maximum number of retries is reached, a validation error is set which results in a
   * transition out of the LLM component using the 'error' transition.
   * <p>
   * @param {string[]} errors - messages describing what is invalid about the response
   * @returns {false} always returns false
   */
  public handleInvalidResponse(errors: string[]): false {
    this.getResponse().messageHistory.allValidationErrors = errors;
    if (this.getRetries() < this.getMaxRetries() ) {
      if (this.getRetryUserMessage()) {
        this.addMessage(this.getRetryUserMessage());
      }
      this.setNextLLMPrompt(this.getInvalidResponseTemplate().replace('{0}', errors.join('\n- ')), true);
    } else {
      this.setValidationError(errors.join('\n'));
    }
    return false;
  }

  private getLastMessage(role: ChatEntry['role']): ChatEntry {
    for (let index = this._chatEntries.length - 1; index > 0; index--) {
      if (this._chatEntries[index].role === role) {
        return this._chatEntries[index];
      }
    }
    return undefined;
  }

}
