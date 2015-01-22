'use strict';
var defer = require('node-promise').defer;

var DB_NAME = 'reproduction';

module.exports = {
  connection: undefined,
  init: function(connection) {
    this.connection = connection;
  },
  getAllReproductions: function() {
    var dfd = defer();
    var db = this.connection.database(DB_NAME);
    db.view('reproduction/all', function(err, docs) {
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
  updateReproduction: function(exchangeId, revision, data) {
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
  }
};
