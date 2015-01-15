'use strict';
module.exports = {
  inflate: function(exchangeId, fromObj) {
    return {
      exchange_id: exchangeId,
      accepted: fromObj.hasOwnProperty('accepted') ? 
                  typeof fromObj.accepted === 'string' ?
                    fromObj.accepted === 'true' : false
                  : false,
      actual: fromObj.hasOwnProperty('actual') ? 
                  typeof fromObj.actual === 'string' ?
                    fromObj.actual === 'true' : false
                  : false,
      amount: fromObj.hasOwnProperty('amount') ? parseInt(fromObj.amount, 10) : 1,
      description: fromObj['description'],
      giver: fromObj['giver'],
      kind: fromObj['kind'],
      artist: fromObj['artist'],
      type: fromObj['type'],
      recipient: fromObj['recipient'],
      motifs: fromObj['motifs'] 
    };
  }
};