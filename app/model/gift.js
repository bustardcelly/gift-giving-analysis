'use strict';
module.exports = {
  inflate: function(exchangeId, fromObj) {
    return {
      exchange_id: exchangeId,
      accepted: fromObj.hasOwnProperty('accepted') ? fromObj.accepted : false,
      actual: fromObj.hasOwnProperty('actual') ? fromObj.actual : false,
      amount: fromObj.hasOwnProperty('amount') ? parseInt(fromObj.amount) : 1,
      description: fromObj['description'],
      giver: fromObj['giver'],
      kind: fromObj['kind'],
      type: fromObj['type'],
      recipient: fromObj['recipient']
    };
  }
};