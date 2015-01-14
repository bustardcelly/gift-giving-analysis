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
  getNameFromId: function(id) {
    var index = this.source.length;
    var item;
    while(--index > -1) {
      item = this.source[index];
      if(item._id === id) {
        return item.name;
      }
    }
    return undefined;
  }
};