'use strict';

var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var Dispatcher = require('../dispatcher');
var GiftActions = require('../actions/GiftActions');
var GiftEventEnum = require('../enums/GiftEvent');
var GiftActionEnum = require('../enums/GiftAction');

var initDeferred;
var gifts = [];

var GiftStore = assign({}, EventEmitter.prototype, {

  init: function(forceRefresh) {
    if(initDeferred === undefined || this.forceRefresh) {
      initDeferred = GiftActions.all();
    }
    return initDeferred;
  },

  all: function() {
    return gifts;
  },

  withId: function(id) {
    var i = gifts.length;
    var gift;
    while(--i > -1) {
      gift = gifts[i];
      if(gift._id === id) {
        return gift;
      }
    }
    return undefined;
  },

  addChangeListener: function(callback) {
    this.on(GiftEventEnum.CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(GiftEventEnum.CHANGE_EVENT, callback);
  }

});

Dispatcher.register(GiftStore, function(payload) {

  var action = payload.action;
  switch(action.type) {
    case GiftActionEnum.GET_GIFTS:
      gifts = action.list;
      GiftStore.emit(GiftEventEnum.CHANGE_EVENT);
      break;
  }

});

module.exports = GiftStore;
