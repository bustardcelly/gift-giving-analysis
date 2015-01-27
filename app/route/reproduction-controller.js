'use strict';
var db = require('../db').reproduction;
var reproductionFactory = require('../model/reproduction');

module.exports = {
  getAllReproductions: function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin','*');
    db.getAllReproductions()
      .then(function(docs) {
        res.send(200, docs);
      }, function(err) {
        res.send(200, {
          error: err
        });
      });
    return next();
  },
  addReproduction: function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    var params = req.params;
    var reproduction = reproductionFactory.create(params);
    db.newReproduction(reproduction)
      .then(function(item) {
        res.send(200, item);
      }, function(err) {
        res.send(200, {
          error: 'Could not save new reproduction: ' + err
        });
      });
    return next();
  },
  updateReproduction: function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    var params = req.params;
    var reproductionId = params.id;
    db.updateReproduction(reproductionId, params._rev, params)
      .then(function(item) {
        res.send(200, item);
      }, function(err) {
        console.error('Could not update exchange ' + reproductionId + ': ' + JSON.stringify(err, null, 2));
        res.send(200, {
          error: 'Could not update exchange ' + reproductionId + ': ' + JSON.stringify(err, null, 2)
        });
      });
    return next();
  },
  getAttachment: function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    var id = req.params.id;
    var filename = req.params.filename;
    db.getAttachment(id, filename)
      .then(function(data) {
        res.send(200, data);
      }, function(err) {

      });
    return next();
  },
  saveAttachment: function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    var params = req.params;
    var reproductionId = params.id;
    var reproductionRev = params.rev;
    var files = req.files;
    db.saveAttachments(reproductionId, reproductionRev, files)
      .then(function(data) {
        res.send(200, data);
      }, function(err) {
        res.send(200, {
          error: 'Could not save attachment(s): ' +  JSON.stringify(err, null, 2)
        });
      });
    return next();
  },
  removeAttachment: function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    var params = req.params;
    var reproductionId = params.id;
    var reproductionRev = params.rev;
    var filename = params.filename;
    db.removeAttachment({id:reproductionId, rev:reproductionRev}, filename)
      .then(function(data) {
        res.send(200, data);
      }, function(err) {
        res.send(200, {
          error: 'Could not remove attachment: ' + JSON.stringify(err, null, 2)
        });
      });
    return next();
  }
};