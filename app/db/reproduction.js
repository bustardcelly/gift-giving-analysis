'use strict';
var fs = require('fs');
var defer = require('node-promise').defer;
var objectAssign = require('object-assign');

var DB_NAME = 'reproduction';

module.exports = {
  connection: undefined,
  dbhost: undefined,
  dbport: undefined,
  init: function(connection, dbhost, dbport) {
    this.connection = connection;
    this.dbhost = dbhost;
    this.dbport = dbport;
  },
  newReproduction: function(reproduction) {
    var dfd = defer();
    var db = this.connection.database(DB_NAME);
    db.save(reproduction, function(err, data) {
      if(err) {
        dfd.reject(err.reason);
      }
      else {
        objectAssign(data, reproduction);
        dfd.resolve(data);
      }
    });
    return dfd.promise;
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
    // remove _attachments for put/post and do merge.
    delete data._attachments;
    db.merge(id, data, function(err, data) {
      if(err) {
        dfd.reject(err.reason);
      }
      else {
        dfd.resolve(data);
      }
    });
    return dfd.promise;
  },
  getAttachment: function(id, filename) {
    var dfd = defer();
    dfd.resolve({
      filename: filename,
      url: 'http://' + this.dbhost + ':' + this.dbport + '/reproduction/' + id + '/' + filename
    });
    return dfd;
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
  },
  removeAttachment: function(id, filename) {
    var dfd = defer();
    var db = this.connection.database(DB_NAME);
    db.removeAttachment(id, filename, function(err, data) {
      if(err) {
        console.dir(err);
        dfd.reject(err.reason);
      }
      else {
        dfd.resolve(data);
      }
    });
    return dfd.promise;
  }
};
