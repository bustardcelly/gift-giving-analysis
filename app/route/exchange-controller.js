'use strict';
var db = require('../db');
var exchangeFactory = require('../model/exchange');

module.exports = {
  getAllExchanges: function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    db.getAllExchanges()
      .then(function(docs) {
        res.send(200, docs);
      }, function(err) {
        res.send(200, {
          error: 'Could not access all exchanges: ' + err
        });
      });
    return next();
  },
  getExchangeById: function(req, res, next) {
    var exchangeId;
    res.setHeader('Access-Control-Allow-Origin', '*');
    exchangeId = req.params.id;
    db.getExchangeById(exchangeId)
      .then(function(doc) {
        res.send(200, doc);
      }, function(err) {
        res.send(200, {
          error: err
        });
      });
    return next();
  },
  addExchange: function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    var params = req.params;
    console.log('Data: ' + JSON.stringify(params, null, 2));
    var exchange = exchangeFactory.create(params.title, params.description,
                      params.source, params.location,
                      params.year, params.month, params.day);
    db.newExchange(exchange)
      .then(function(item) {
        res.send(200, item);
      }, function(err) {
        res.send(200, {
          error: 'Could not save new exchange: ' + err
        });
      });
    return next();
  },
  updateExchange: function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    var params = req.params;
    var exchangeId = params.id;
    db.updateExchange(exchangeId, params._rev, params)
      .then(function(item) {
        res.send(200, item);
      }, function(err) {
        res.send(200, {
          error: 'Could not update exchange ' + exchangeId + ': ' + err
        });
      });
    return next();
  },
  deleteExchange: function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    var params = req.params;
    var exchangeId = params.id;
    db.deleteExchange(exchangeId, params._rev)
      .then(function() {
        res.send(200, true);
      }, function(err) {
        res.send(200, {
          error: 'Could not delete exchange ' + exchangeId + ': ' + err
        });
      });
    return next();
  }
};