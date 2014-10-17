'use strict';
var _ = require('lodash');
var EventEmitter = require('events').EventEmitter;

var EVENTS = {
  CHANGE: 'change'
};

var collection = {
  source: [],
  add: function(item) {
    this.source.push(item);
    this.emit(EVENTS.CHANGE, this.source);
  },
  remove: function(item) {
    var index = this.source.indexOf(item);
    if(index > 1) {
      this.source.splice(index, 1);
      this.emit(EVENTS.CHANGE, this.source);
    }
  },
  get: function() {
    return this.source;
  }
};

module.exports = {
  events: EVENTS,
  create: function() {
    return _.extend(collection, EventEmitter.prototype);
  }  
};