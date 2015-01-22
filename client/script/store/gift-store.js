'use strict';
var collFactory = require('../model/collection');

var collection = collFactory.create();

module.exports = {
  init: function(items) {
    collection.source = items;
  },
  all: function() {
    return collection.get();
  },
  withId: function(id) {
    var list = this.all();
    var i = list.length;
    while(--i > -1) {
      if(list[i]._id === id) {
        return list[i];
      }
    }
    return undefined;
  }
};