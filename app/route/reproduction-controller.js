'use strict';
var db = require('../db').reproduction;

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
  updateReproduction: function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    var params = req.params;
    var reproductionId = params.id;
    db.updateReproduction(reproductionId, params._rev, params)
      .then(function(item) {
        res.send(200, item);
      }, function(err) {
        res.send(200, {
          error: 'Could not update exchange ' + reproductionId + ': ' + err
        });
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
  }
};