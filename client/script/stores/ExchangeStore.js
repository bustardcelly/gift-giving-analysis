'use strict';

var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var Dispatcher = require('../dispatcher');
var ExchangeActions = require('../actions/ExchangeActions');
var ExchangeEventEnum = require('../enums/ExchangeEvent');
var ExchangeActionEnum = require('../enums/ExchangeAction');

var initDeferred;
var exchanges = [];

var ExchangeStore = assign({}, EventEmitter.prototype, {

  init: function(forceRefresh) {
    if(initDeferred === undefined || forceRefresh) {
      initDeferred = ExchangeActions.all();
    }
    return initDeferred;
  },

  all: function() {
    return exchanges;
  },

  withId: function(id) {
    var i = exchanges.length;
    var exchange;
    while(--i > -1) {
      exchange = exchanges[i];
      if(exchange._id === id) {
        return exchange;
      }
    }
    return undefined;
  },

  indexOfTitle: function(title) {
    var i = exchanges.length;
    while(--i > -1) {
      if(exchanges[i].title === title) {
        return i;
      }
    }
    return -1;
  },

  addChangeListener: function(callback) {
    this.on(ExchangeEventEnum.CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(ExchangeEventEnum.CHANGE_EVENT, callback);
  }

});

Dispatcher.register(ExchangeStore, function(payload) {

  var action = payload.action;
  switch(action.type) {
    case ExchangeActionEnum.GET_EXCHANGES:
      exchanges = action.list;
      ExchangeStore.emit(ExchangeEventEnum.CHANGE_EVENT);
      break;
  }

});

module.exports = ExchangeStore;

