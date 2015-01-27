'use strict';
var EventEmitter = require('events').EventEmitter;

var EVENTS = {
  CHANGE: 'change'
};

var STATES = {
  LOADING: 'loading',
  LOADED: 'loaded',
  ERROR: 'error'
};

var ImageAttachment = function(source) {
  this.url = source.url;
  this.source = source.source;
  this.filename = source.filename;
  this.state = source.state || STATES.LOADING;
  this._id = this.filename;
};

ImageAttachment.prototype = new EventEmitter();

ImageAttachment.prototype.setState = function(value) {
  if(this.state !== value) {
    this.state = value
    this.emit(EVENTS.CHANGE, this);
  }
}

module.exports = {
  events: EVENTS,
  states: STATES,
  create: function(src) {
    return new ImageAttachment(src);
  }  
};