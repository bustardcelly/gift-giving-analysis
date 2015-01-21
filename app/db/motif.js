'use strict';
var defer = require('node-promise').defer;

var DB_NAME = 'motif';

module.exports = {
  connection: undefined,
  init: function(connection) {
    this.connection = connection;
  },
  getAllMotifs: function() {
    var dfd = defer();
    var db = this.connection.database(DB_NAME);
    db.view('motif/byName', function(err, docs) {
      if(err) {
        dfd.reject(err.reason);
      }
      else {
        dfd.resolve(docs);
      }
    });
    return dfd.promise;
  }
};
