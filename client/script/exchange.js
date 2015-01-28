/*global window*/
'use strict';
Object.assign = require('object-assign');
var collFactory = require('./model/collection');
var exchangeList = require('./view/exchange-list');
var exchangeService = require('./service/exchange');
var giftService = require('./service/gift');
var motifService = require('./service/motif');
var motifStore = require('./store/motif-store');

giftService.init(window.serviceHost, window.servicePort);
motifService.init(window.serviceHost, window.servicePort);

var accessExchanges = function() {
  exchangeService
    .init(window.serviceHost, window.servicePort)
    .all()
    .then(function(list) {
      Array.prototype.forEach.call(list, function(item) {
        if(!item.hasOwnProperty('gifts')) {
          item.gifts = collFactory.create();
        }
        exchangeService.getGiftsForExchangeId(item._id)
          .then(function(gifts) {
            Array.prototype.forEach.call(gifts, function(gift) {
              gift._attachmentList = collFactory.create();
              item.gifts.add(gift);
            });
          });
      });
      exchangeList.render(window.document.getElementById('exchange-form-container'), collFactory.create(list));
    });
};

motifService.all()
  .then(function(list) {
    motifStore.init(list);
    accessExchanges();
  });

module.exports = {};