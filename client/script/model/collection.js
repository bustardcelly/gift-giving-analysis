'use strict';
var EventEmitter = require('events').EventEmitter;

var EVENTS = {
  CHANGE: 'change'
};

var Collection = function() {
  this.source = [];
};

Collection.prototype = new EventEmitter();

Collection.prototype.add = function(item) {
  this.source.push(item);
  this.emit(EVENTS.CHANGE, this.source);
};

Collection.prototype.remove = function(item) {
  var index = this.source.indexOf(item);
  if(index > 1) {
    this.source.splice(index, 1);
    this.emit(EVENTS.CHANGE, this.source);
  }
};

Collection.prototype.get = function() {
  return this.source;
};


module.exports = {
  events: EVENTS,
  create: function() {
    return new Collection();
  }  
};