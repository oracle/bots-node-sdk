import {CustomComponent,  CustomComponentMetadata, CustomComponentContext }  from '@oracle/bots-node-sdk/lib';

// You can use your favorite http client package to make REST calls, however, the node fetch API is pre-installed with the bots-node-sdk.
// Documentation can be found at https://www.npmjs.com/package/node-fetch
// Un-comment the next line if you want to make REST calls using node-fetch. 
// import * as fetch from 'node-fetch';

export class {{className}} implements CustomComponent {

  public metadata(): CustomComponentMetadata {
    return { 
      name: '{{name}}',
      properties: {
        human: { required: true, type: 'string' },
      },
      supportedActions: ['weekday', 'weekend']
      };
  }

  public async invoke(context: CustomComponentContext): Promise<void> {
    // perform conversation tasks.
    const { human } = context.properties();
    // determine date
    const now = new Date();
    const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' });
    const isWeekend = [0, 6].indexOf(now.getDay()) > -1;
    // reply
    context
      .reply(`Greetings ${human}`)
      .reply(`Today is ${now.toLocaleDateString()}, a ${dayOfWeek}`)
      .transition(isWeekend ? 'weekend' : 'weekday'); 
  }
  
}  
