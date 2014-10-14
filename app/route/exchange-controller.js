'use strict';
var db = require('../db');
var exchangeFactory = require('../model/exchange');

module.exports = {
  getExchanges: function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
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
  },
  getExchangeById: function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    return next();
  }
};