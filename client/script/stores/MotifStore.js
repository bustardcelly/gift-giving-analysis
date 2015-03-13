'use strict';

var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var MotifActions = require('../actions/MotifActions');

var allDeferred;

var MotifStore = assign({}, EventEmitter.prototype, {

  init: function(host, port) {
    allDeferred = MotifActions.init(host, port).all();
    return this;
  },

  all: function() {
    return allDeferred;
  }

});

module.exports = MotifStore;

