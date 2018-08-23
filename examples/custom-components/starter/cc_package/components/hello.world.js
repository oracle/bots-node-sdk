'use strict';
 
module.exports = {
  metadata: () => ({
    name: 'hello.world',
    properties: {
      human: { required: true, type: 'string' },
    },
    supportedActions: []
  }),
  invoke: (conversation, done) => {
    // perform conversation tasks.
    const { human } = conversation.properties();
    conversation
      .reply(`Greetings ${human}`)
      .reply(`Today is ${new Date().toDateString()}`)
      .transition();
 
    done();
  }
};
