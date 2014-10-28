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
  var index = this.source.length;
  while(--index > -1) {
    if(this.source[index]._id === item._id) {
      break;
    }
  }
  if(index > -1) {
    this.source.splice(index, 1);
    this.emit(EVENTS.CHANGE, this.source);
  }
};

Collection.prototype.update = function(item) {
  var itemId = item._id;
  var length = this.source.length;
  while(--length > -1) {
    if(this.source[length]._id === itemId) {
      this.source[length] = item;
      this.emit(EVENTS.CHANGE, this.source);
      break;
    }
  }
};

Collection.prototype.refresh = function() {
  this.emit(EVENTS.CHANGE, this.source);
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