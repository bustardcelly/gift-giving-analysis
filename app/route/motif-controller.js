'use strict';
var db = require('../db').motif;

module.exports = {
  getAllMotifs: function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin','*');
    db.getAllMotifs()
      .then(function(docs) {
        res.send(200, docs);
      }, function(err) {
        res.send(200, {
          error: err
        });
      });
    return next();
  }
};