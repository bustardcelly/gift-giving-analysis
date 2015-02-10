'use strict';

var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var Dispatcher = require('../dispatcher');
var ReproductionEventEnum = require('../enums/ReproductionEvent');
var ReproductionActionEnum = require('../enums/ReproductionAction');
var ReproductionListActions = require('../actions/ReproductionListActions');

var reproductions = [];

var ReproductionStore = assign({}, EventEmitter.prototype, {

  init: function() {
    ReproductionListActions.all();
  },
  all: function() {
    return reproductions;
  },
  add: function(item) {
    ReproductionListActions.add(item);
  },
  update: function(item) {
    ReproductionListActions.update(item);
  },
  remove: function(item) {
    ReproductionListActions.remove(item);
  },
  addChangeListener: function(callback) {
    this.on(ReproductionEventEnum.CHANGE_EVENT, callback);
  },
  removeChangeListener: function(callback) {
    this.removeListener(ReproductionEventEnum.CHANGE_EVENT, callback);
  },
  addUpdateListener: function(callback) {
    this.on(ReproductionEventEnum.UPDATE_COMPLETE, callback);
  },
  removeUpdateListener: function(callback) {
    this.removeListener(ReproductionEventEnum.UPDATE_COMPLETE, callback);
  },
  addRemoveListener: function(callback) {
    this.on(ReproductionEventEnum.REMOVE_COMPLETE, callback);
  },
  removeRemoveListener: function(callback) {
    this.removeListener(ReproductionEventEnum.REMOVE_COMPLETE, callback);
  }

});

Dispatcher.register(ReproductionStore, function(payload) {

  var action = payload.action;
  switch(action.type) {
    case ReproductionActionEnum.GET_REPRODUCTIONS:
      reproductions = action.list;
      ReproductionStore.emit(ReproductionEventEnum.CHANGE_EVENT);
      break;
    case ReproductionActionEnum.ADD_REPRODUCTION:
      reproductions.push(action.item);
      ReproductionStore.emit(ReproductionEventEnum.CHANGE_EVENT);
      break;
    case ReproductionActionEnum.UPDATE_REPRODUCTION:
      var i = reproductions.length;
      var item = action.item;
      while(--i > -1) {
        if(reproductions[i]._id === item._id) {
          reproductions[i] = item;
          break;
        }
      }
      ReproductionStore.emit(ReproductionEventEnum.CHANGE_EVENT);
      ReproductionStore.emit(ReproductionEventEnum.UPDATE_COMPLETE);
      break;
    case ReproductionActionEnum.REMOVE_REPRODUCTION:
      var i = reproductions.length;
      var item = action.item;
      while(--i > -1) {
        if(reproductions[i]._id === item._id) {
          reproductions.splice(i, 1);
          break;
        }
      }
      ReproductionStore.emit(ReproductionEventEnum.CHANGE_EVENT);
      ReproductionStore.emit(ReproductionEventEnum.REMOVE_COMPLETE);
      break;
  }

});

module.exports = ReproductionStore;
