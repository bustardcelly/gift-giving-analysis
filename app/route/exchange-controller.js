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
  postExchange: function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    var params = req.params;
    console.log('Data: ' + JSON.stringify(params, null, 2));
    var exchange = exchangeFactory.create(params.title, params.description, params.source, 
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
  }
};