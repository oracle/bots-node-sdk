"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("../../../lib/");
describe('MessageModel', () => {
    describe('CardMessageConversionToText', () => {
        it('Simple Text', function () {
            const cardContents = [
                { title: 'HAWAIIAN CHICKEN', description: 'grilled chicken, ham, pineapple and green bell peppers' },
                { title: 'PEPPERONI', description: 'Classic marinara sauce with authentic old-world style pepperoni.' },
                {
                    title: 'BACON SPINACH ALFREDO',
                    description: 'Garlic Parmesan sauce topped with bacon, mushrooms and roasted spinach with a salted pretzel crust.'
                }
            ];
            const cards = cardContents.map(function (content, index) {
                return _1.MessageModel.cardObject(content.title, content.description);
            });
            const cardMsg = _1.MessageModel.cardConversationMessage('horizontal', cards);
            const convertedCardMsg = _1.Util.MessageModel.convertRespToText(cardMsg);
            // console.log(convertedCardMsg);
            expect(convertedCardMsg.trim()) // tslint:disable-next-line
                .toEqual('You can choose from the following cards for more information: Card HAWAIIAN CHICKEN, Card PEPPERONI, Card BACON SPINACH ALFREDO.');
        });
    });
    describe('TextMessageConversionToText', function () {
        it('Simple Text', function () {
            const textMsg = _1.MessageModel.textConversationMessage('Hello can I help you?');
            const convertedTextMsg = _1.Util.MessageModel.convertRespToText(textMsg);
            expect(convertedTextMsg.trim()).toEqual('Hello can I help you?');
        });
        it('Text with Actions', function () {
            const actionLabels = ['Menu', 'Start over', 'Agent'];
            const actions = actionLabels.map(function (label, index) {
                return _1.MessageModel.postbackActionObject(label, null, { index: index, label: label });
            });
            const textMsg = _1.MessageModel.textConversationMessage('Hello can I help you?', actions);
            const convertedTextMsg = _1.Util.MessageModel.convertRespToText(textMsg);
            // console.log(convertedTextMsg);
            expect(convertedTextMsg.trim()).toEqual('Hello can I help you? You can choose from the following options: Menu, Start over, Agent.');
        });
        it('Text with Global Actions', function () {
            const actionLabels = ['Menu', 'Start over', 'Agent'];
            const actions = actionLabels.map(function (label, index) {
                return _1.MessageModel.postbackActionObject(label, null, { index: index, label: label });
            });
            let textMsg = _1.MessageModel.textConversationMessage('Hello can I help you?');
            textMsg = _1.MessageModel.addGlobalActions(textMsg, actions);
            const convertedTextMsg = _1.Util.MessageModel.convertRespToText(textMsg);
            // console.log(convertedTextMsg);
            expect(convertedTextMsg.trim()).toEqual('Hello can I help you? The following global actions are available: Menu, Start over, Agent.');
        });
    });
});
//# sourceMappingURL=messageModel.spec.js.map