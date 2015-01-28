'use strict';
var defer = require('node-promise').defer;
var objectAssign = require('object-assign');

var DB_NAME = 'exchange';

module.exports = {
  connection: undefined,
  dbhost: undefined,
  dbport: undefined,
  init: function(connection, dbhost, dbport) {
    this.connection = connection;
    this.dbhost = dbhost;
    this.dbport = dbport;
  },
  getAllExchanges: function() {
    var dfd = defer();
    var db = this.connection.database(DB_NAME);
    db.view('exchange/all', function(err, docs) {
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
  getExchangeById: function(exchangeId) {
    var dfd = defer();
    var db = this.connection.database(DB_NAME);
    db.get(exchangeId, function(err, doc) {
      if(err) {
        dfd.reject(err.reason);
      }
      else {
        dfd.resolve(doc);
      }
    });
    return dfd.promise;
  },
  newExchange: function(exchange) {
    var dfd = defer();
    var db = this.connection.database(DB_NAME);
    db.save(exchange, function(err, data) {
      if(err) {
        dfd.reject(err.reason);
      }
      else {
        objectAssign(data, exchange);
        dfd.resolve(data);
      }
    });
    return dfd.promise;
  },
  updateExchange: function(exchangeId, revision, data) {
    var dfd = defer();
    var db = this.connection.database(DB_NAME);
    db.save(exchangeId, revision, data, function(err, data) {
      if(err) {
        dfd.reject(err.reason);
      }
      else {
        dfd.resolve(data);
      }
    });
    return dfd.promise;
  },
  deleteExchange: function(exchangeId, revision) {
    var dfd = defer();
    var db = this.connection.database(DB_NAME);
    db.remove(exchangeId, revision, function(err) {
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