'use strict';

function updatedItemsMessage(context) {
  if (context.getItemsUpdated().length>0) {
    let message = "I have updated"+context.getItemsUpdated().map((item, i) => (i!==0 ? " and the " : " the ")+item.toLowerCase()+" to "+context.getDisplayValue(item)); 
    context.addMessage(message);
  }
}

function outOfOrderItemsMessage(context) {
  if (context.getItemsMatchedOutOfOrder().length>0) {
    let message = "I got"+context.getItemsMatchedOutOfOrder().map((item, i) => (i!==0 ? " and the " : " the ")+item.toLowerCase()+" "+context.getDisplayValue(item)); 
    context.addMessage(message);
  }
}

module.exports = {
  metadata: () => ({
    name: 'resolveExpense',    
    eventHandlerType: 'ResolveEntities'
  }),
  handlers: () => ({ 
    Expense: {
      entity: {
        /**
         * Generic fallback handler that is executed when item-level publishMessage event handler is not defined
         */        
        publishMessage:async (event, context) => {
          updatedItemsMessage(context);   
          outOfOrderItemsMessage(context);       
          context.addCandidateMessages(); 
        },
        /**
         * Entity-level vaidation, used for validations that involve more than one bag item value
         */
        validate:async (event, context) => {
          if (context.getItemValue('Type')==='Taxi' && context.getItemValue('Amount') && context.getItemValue('Amount').amount > 100) {
            context.addValidationError("Amount",`Taxi expenses are not allowed to exceed 100 ${context.getItemValue('Amount').currency}!`);
          }
        },      
        /**
         * entity resolved event is typically used to call backed API to process the transaction.
         */
        resolved:async (event, context) => {
          context.addMessage(`Your expense report with ${resolvedExpenses(context).length} items is now submitted!`);
        }
      },
      items: {
        Type: {
          /**
           * Validation of a custom entity: the event.newValue contains the string value to be validated
           */
          validate:async (event, context) => {
            if (event.newValue==='Meal') {
              context.addValidationError("Type", "Sorry, you are on per-diem expenses, you cannot expense a meal.");
            }
          }
        },
        Amount: {
          /**
           * Validation of a system entity (CURRENCY): the event.newValue contains a JSON object representing the
           * system entity value
           */
          validate:async (event, context) => {
            if (event.newValue.amount < 5) {
              context.addValidationError("Amount",`Amounts below 5 ${event.newValue.currency} cannot be expensed. Enter a higher amount or type 'cancel'.`);
              return false;
            }
            else if (context.getItemValue("Receipt")!==undefined && context.getItemValue("Amount")!==undefined) {
              context.addMessage("You cannot change the amount that is extracted from the scanned receipt", true);
              return false;
            }
          }      
        },
        Date: {
          /**
           * If date is set by scanning receipt, it cannot be changed, so we prompt the user to ask whether he wnats
           * to change date anyway, and remove the receipt. This is an example usage of a custom event, when the users 
           * taps the Yes button, the renoveReceipt event will be called.
           */
          validate:async (event, context) => {
            if (new Date(event.newValue.date) > new Date()) {
              context.addValidationError("Date","Expense date cannot be in the future. Please enter 'today' or a date in the past.");
              return false;
            }
            else if (context.getItemValue("Receipt")!==undefined && context.getItemValue("Date")!==undefined) {
              let MessageModel = context.getMessageModel();
              let yes = MessageModel.postbackActionObject("Yes",null,{"event" : {"name":"removeReceipt","properties":{"Date":event.newValue}}});
              let no = MessageModel.postbackActionObject("No",null,{});
              let message = MessageModel.textConversationMessage("You cannot change the date that is extracted from the scanned receipt. Do you want to remove the receipt and change the date?",[yes,no] );
              context.addMessage(new MessageModel(message));
              return false;
            }
          }      
        },
        Receipt: {
          /**
           * Only prompt user for a receipt when expense amount is more than 25
           */
          shouldPrompt:async (event, context) => {
            return context.getItemValue("Amount").amount > 25;
          },
          /**
           * Simulate scanning of receipt: set date and amount in the bag entity
           */
          validate:async (event, context) => {
            if (event.newValue.type==='image') {
              if (event.newValue.url==='https://upload.wikimedia.org/wikipedia/commons/0/0b/ReceiptSwiss.jpg') {
                let amount =  {"entityName": "CURRENCY", "amount": 54.5,"currency":"chf","totalCurrency": "CHF 54.50 scanned from receipt"};
                context.setItemValue("Amount",amount);
                let date =  {"entityName": "DATE", "date": 1185753600000,"originalString": "30 july 2007 scanned from receipt"};
                context.setItemValue("Date",date);
                context.addMessage(`Receipt scanned, amount set to CHF 54.50 and date set to 30 july 2007`,true);
              }   
            } else {
              context.addValidationError("Receipt",`Receipt must be an image, cannot be ${event.newValue.type}`);
            }
          }
        }
      },
      custom: {
        /**
         * removeReceipt is custom event that is fired when user taps Yes button in dialog created in validate Date event
         */
        removeReceipt:async (event, context) => {
          context.clearItemValue("Receipt");
          if (event.properties.Date) {
            context.setItemValue("Date", event.properties.Date);
            context.addMessage("Receipt removed, date set to "+context.getDisplayValue("Date"),true);
          }
        }    
      }
    }
  })     
}; 