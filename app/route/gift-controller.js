'use strict';
var db = require('../db').gift;
var giftFactory = require('../model/gift');

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
  },
  addGift: function(req, res, next) {
    var gift;
    var exchangeId;
    var params = req.params;
    res.setHeader('Access-Control-Allow-Origin','*');
    exchangeId = params.id;
    gift = giftFactory.inflate(exchangeId, req.params);
    db.newGift(gift)
      .then(function(doc) {
        res.send(200, doc);
      }, function(err) {
        res.send(200, {
          error: err
        });
      });
    return next();
  },
  updateGift: function(req, res, next) {
    var giftId = req.params.id;
    var params = req.params;
    var gift;
    res.setHeader('Access-Control-Allow-Origin','*');
    gift = giftFactory.inflate(params.exchange_id, params);
    db.updateGift(giftId, params._rev, gift)
      .then(function(doc) {
        res.send(200, doc);
      }, function(err) {
        res.send(200, {
          error: err
        });
      });
    return next();
  },
  deleteGift: function(req, res, next) {
    var giftId = req.params.id;
    var params = req.params;
    res.setHeader('Access-Control-Allow-Origin','*');
    db.deleteGift(giftId, params._rev)
      .then(function() {
        res.send(200, true);
      }, function(err) {
        res.send(200, {
          error: err
        });
      });
    return next();
  }
};