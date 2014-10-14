'use strict';

var connection;
var cradle = require('cradle');
var defer = require('node-promise').defer;

var glom = function(fromObject, toObject) {
  var prop;
  for(prop in fromObject) {
    if(!toObject.hasOwnProperty(prop)) {
      toObject[prop] = fromObject[prop];
    }
  }
};

var facade = {
  init: function(host, port) {
    connection = new(cradle.Connection)(host, port, {
      cache: true,
      raw: false,
      forceSave: true
    });
    return this;
  },
  newExchange: function(exchange) {
    var dfd = defer();
    var db = connection.database('exchange');
    db.save(exchange, function(err, data) {
      if(err) {
        dfd.reject(err);
      }
      else {
        glom(exchange, data);
        dfd.resolve(data);
      }
    });
    return dfd.promise;
  }
};

module.exports = facade;