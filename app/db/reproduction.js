'use strict';
var fs = require('fs');
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
  updateReproduction: function(id, revision, data) {
    var dfd = defer();
    var db = this.connection.database(DB_NAME);
    db.save(id, revision, data, function(err, data) {
      if(err) {
        dfd.reject(err.reason);
      }
      else {
        dfd.resolve(data);
      }
    });
    return dfd.promise;
  },
  saveAttachments: function(id, revision, filesObj) {
    var dfd = defer();
    var db = this.connection.database(DB_NAME);
    var attachments = [];
    var file;
    var fileKey;
    for(fileKey in filesObj) {
      file = filesObj[fileKey];
      attachments.push({
        name: file.name,
        'Content-Type': file.type,
        path: file.path
      });
    }
    var uploadNext = function() {
      var data = attachments.shift();
      var readStream = fs.createReadStream(data.path);
      var writeStream = db.saveAttachment({
        id:id, rev:revision
      }, data, function(error, response) {
        if(error) {
          dfd.reject(error);
          return;
        }
        if(attachments.length > 0) {
          uploadNext();
        }
        else {
          dfd.resolve(response);
        }
      });
      readStream.pipe(writeStream);
    };
    uploadNext();
    return dfd.promise;
  }
};
