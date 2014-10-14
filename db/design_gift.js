'use strict';
var db;
var connection;
var cradle = require('cradle');
var argsv = require('minimist')(process.argv.slice(2));

var dbhost = argsv.dbhost || '127.0.0.1';
var dbport = argsv.dbport || 5984;

function saveDesign(db) {
  db.save('_design/gift', {
    views: {
      all: {
        map: 'function(doc) { \
          emit(null, doc); \
        }'
      },
      byExchangeId: {
        map: 'function(doc) { \
          if(doc.exchange_id) { \
            emit(doc.exchange_id, doc); \
          } \
        }'
      }
    }
  });
}

connection = new(cradle.Connection)(dbhost, dbport, {
  cache: true,
  raw: false,
  forceSave: true
});

db = connection.database('gift');
try {
  saveDesign(db);
}
catch(e) {
  console.error(e.message);
}
