'use strict';

exports.Mock = function() {
  const mockObject = {
    req: {
      complete: 
        {
          "botId" : "123-xxx-456",
          "platformVersion" : "1.1",
          "events": [
            { "name": "validate", "eventItem": "Type", "custom": false },
            { "name": "validate", "custom": false },
            { "name": "customEvent", "custom": true }
          ],
          "variableName": "expense",
          "candidateMessages": [
            {
              "text": "What is the expense type?",
              "type": "text"
            }
          ],
          "entityResolutionStatus": {
            "updatedEntities": [{"name": "Type", "type": "ENTITY", "entityName" : "ExpenseType"}],
            "outOfOrderMatches": [{"name": "Amount", "type": "ENTITY", "entityName" : "CURRENCY"}],
            "customProperties": {},
            "shouldPromptCache": {},
            "validationErrors": {"Type": "Meal is not allowed for you"},
            "skippedItems": [],
            "allMatches": [{"name": "Date", "type": "ENTITY", "entityName" : "DATE"}],
            "resolvingField": "Type",
            "userInput": "expense taxi and flight and meal",
            "disambiguationValues": {"Type": ["Taxi","Flight"]}
          },      
          "context": {
            "variables": {
              "expense" : {
                "type": {
                  "name": "Expense",
                  "type": "COMPOSITEBAG",
                  "multiValue": false,
                  "fuzzyMatch": false,
                  "promptForDisambiguation": true,
                  "compositeBagItems": [{
                    "sequenceNr": 1,
                    "name": "Type",
                    "type": "ENTITY",
                    "entityName": "ExpenseType",
                    "description": "the type"
                  }, {
                    "sequenceNr": 2,
                    "name": "Amount",
                    "type": "ENTITY",
                    "entityName": "CURRENCY",
                    "description": "the amount"
                  }, {
                    "sequenceNr": 4,
                    "name": "ReasonMaxAmountExceeded",
                    "type": "STRING",
                    "description": "the reason max amount exceeded"
                  }, {
                    "sequenceNr": 5,
                    "name": "Date",
                    "type": "ENTITY",
                    "entityName": "DATE",
                    "description": "the expense date"
                  }, {
                    "sequenceNr": 6,
                    "name": "Receipt",
                    "type": "ATTACHMENT",
                    "description": "the receipt"
                  }, {
                    "sequenceNr": 7,
                    "name": "ReceiptNotFound",
                    "type": "ENTITY",
                    "entityName": "ReceiptNotFound",
                    "description": "the receipt"
                  }, {
                    "sequenceNr": 8,
                    "name": "ReasonNoReceipt",
                    "type": "STRING"
                  }, {
                    "sequenceNr": 9,
                    "name": "Confirmation",
                    "type": "ENTITY",
                    "entityName": "YES_NO"
                  }],
                  "eventHandler": "ExpenseService:resolveExpense"
                },
                "value": null,
                "entity": true
              }
            }  
          }
        }        
    }
  };
  return mockObject;
};

