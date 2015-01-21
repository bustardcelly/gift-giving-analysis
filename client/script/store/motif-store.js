'use strict';
var collFactory = require('../model/collection');

var collection = collFactory.create();

module.exports = {
  init: function(items) {
    collection.source = items;
  },
  all: function() {
    return collection.get();
  }
};