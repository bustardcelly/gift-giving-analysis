'use strict';

var connection;
var cradle = require('cradle');
var defer = require('node-promise').defer;

var DB_GIFT = 'gift';
var DB_EXCHANGE = 'exchange';

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
  getAllExchanges: function() {
    var dfd = defer();
    var db = connection.database(DB_EXCHANGE);
    db.view('exchange/all', function(err, docs) {
      if(err) {
        dfd.reject(err);
      }
      else {
        dfd.resolve(docs.map(function(item) {
          return item;
        }));
      }
    });
    return dfd.promise;
  },
  getExchangeById: function(exchangeId) {
    var dfd = defer();
    var db = connection.database(DB_EXCHANGE);
    db.get(exchangeId, function(err, doc) {
      if(err) {
        dfd.reject(err);
      }
      else {
        dfd.resolve(doc);
      }
    });
    return dfd.promise;
  },
  newExchange: function(exchange) {
    var dfd = defer();
    var db = connection.database(DB_EXCHANGE);
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
  },
  getAllGifts: function() {
    var dfd = defer();
    var db = connection.database(DB_GIFT);
    db.view('gift/all', function(err, docs) {
      if(err) {
        dfd.reject(err);
      }
      else {
        dfd.resolve(docs.map(function(item) {
          return item;
        }));
      }
    });
    return dfd.promise;
  },
  getGiftById: function(giftId) {
    var dfd = defer();
    var db = connection.database(DB_GIFT);
    db.get(giftId, function(err, doc) {
      if(err) {
        dfd.reject(err);
      }
      else {
        dfd.resolve(doc);
      }
    });
    return dfd.promise;
  },
  giftsByExchangeId: function(exchangeId) {
    var dfd = defer();
    var db = connection.database(DB_GIFT);
    db.view('gift/byExchangeId', {
      key: exchangeId
    }, function(err, docs) {
      if(err) {
        dfd.reject(err);
      }
      else {
        dfd.resolve(docs.map(function(item) {
          return item;
        }));
      }
    });
    return dfd.promise;
  }
};

module.exports = facade;