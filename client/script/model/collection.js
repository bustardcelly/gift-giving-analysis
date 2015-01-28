'use strict';
var EventEmitter = require('events').EventEmitter;

var EVENTS = {
  CHANGE: 'change'
};

var Collection = function(src) {
  this.source = src || [];
};

Collection.prototype = new EventEmitter();

Collection.prototype.has = function(item) {
  return this.indexOf(item) > -1;
};

Collection.prototype.indexOf = function(item) {
  var index = this.source.length;
  while(--index > -1) {
    if(this.source[index]._id === item._id) {
      return index;
    }
  }
  return -1;
};

Collection.prototype.add = function(item) {
  this.source.push(item);
  this.emit(EVENTS.CHANGE, this.source);
};

Collection.prototype.remove = function(item) {
  var index = this.indexOf(item);
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
  create: function(src) {
    return new Collection(src);
  }  
};