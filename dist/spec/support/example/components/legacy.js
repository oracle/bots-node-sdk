"use strict";
module.exports = {
    metadata() {
        return {
            name: 'legacy.style'
        };
    },
    invoke(sdk, done) {
        sdk.reply('example response');
        done();
    }
};
//# sourceMappingURL=legacy.js.map