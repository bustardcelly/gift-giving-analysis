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
    var listItem;
    while(--i > -1) {
      listItem = list[i];
      if(listItem._id === id) {
        return listItem;
      }
    }
    return undefined;
  }
};