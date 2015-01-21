'use strict';
var defer = require('node-promise').defer;

var DB_NAME = 'gift';
var glom = function(fromObject, toObject) {
  var prop;
  for(prop in fromObject) {
    if(!toObject.hasOwnProperty(prop)) {
      toObject[prop] = fromObject[prop];
    }
  }
};

module.exports = {
  connection: undefined,
  init: function(connection) {
    this.connection = connection;
  },
  getAllGifts: function() {
    var dfd = defer();
    var db = this.connection.database(DB_NAME);
    db.view('gift/all', function(err, docs) {
      if(err) {
        dfd.reject(err.reason);
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
    var db = this.connection.database(DB_NAME);
    db.get(giftId, function(err, doc) {
      if(err) {
        dfd.reject(err.reason);
      }
      else {
        dfd.resolve(doc);
      }
    });
    return dfd.promise;
  },
  giftsByExchangeId: function(exchangeId) {
    var dfd = defer();
    var db = this.connection.database(DB_NAME);
    db.view('gift/byExchangeId', {
      key: exchangeId
    }, function(err, docs) {
      if(err) {
        dfd.reject(err.reason);
      }
      else {
        dfd.resolve(docs.map(function(item) {
          return item;
        }));
      }
    });
    return dfd.promise;
  },
  newGift: function(gift) {
    var dfd = defer();
    var db = this.connection.database(DB_NAME);
    db.save(gift, function(err, data) {
      if(err) {
        dfd.reject(err.reason);
      }
      else {
        glom(gift, data);
        dfd.resolve(data);
      }
    });
    return dfd.promise;
  },
  updateGift: function(giftId, revision, data) {
    var dfd = defer();
    var db = this.connection.database(DB_NAME);
    db.save(giftId, revision, data, function(err, data) {
      if(err) {
        dfd.reject(err.reason);
      }
      else {
        dfd.resolve(data);
      }
    });
    return dfd.promise;
  },
  deleteGift: function(giftId, revision) {
    var dfd = defer();
    var db = this.connection.database(DB_NAME);
    db.remove(giftId, revision, function(err) {
      if(err) {
        dfd.reject(err.reason);
      }
      else {
        dfd.resolve(true);
      }
    });
    return dfd.promise;
  }
};
