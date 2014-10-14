'use strict';
module.exports = {
  inflate: function(exchangeId, fromObj) {
    return {
      exchange_id: exchangeId,
      accepted: fromObj.hasOwnProperty('accepted') ? fromObj.accepted : false,
      actual: fromObj.hasOwnProperty('actual') ? fromObj.actual : false,
      description: fromObj['description'],
      giver: fromObj['giver'],
      kind: fromObj['kind'],
      location_str: fromObj['location_str'],
      type: fromObj['type'],
      recipient: fromObj['recipient']
    };
  }
};