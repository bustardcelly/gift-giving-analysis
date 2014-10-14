'use strict';
var db = require('../db');

module.exports = {
  getAllGifts: function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin','*');
    db.getAllGifts()
      .then(function(docs) {
        res.send(200, docs);
      }, function(err) {
        res.send(200, {
          error: err
        });
      });
    return next();
  },
  getGiftById: function(req, res, next) {
    var giftId;
    res.setHeader('Access-Control-Allow-Origin','*');
    giftId = req.params.id;
    db.getGiftById(giftId)
      .then(function(doc) {
        res.send(200, doc);
      }, function(err) {
        res.send(200, {
          error: err
        });
      });
    return next();
  },
  getGiftExchangesById: function(req, res, next) {
    var exchangeId;
    res.setHeader('Access-Control-Allow-Origin','*');

    exchangeId = req.params.id;
    db.giftsByExchangeId(exchangeId)
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