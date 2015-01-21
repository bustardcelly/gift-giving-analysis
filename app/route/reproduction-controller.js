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
  }
};