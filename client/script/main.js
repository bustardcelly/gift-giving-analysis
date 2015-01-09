/*global window*/
'use strict';
var collFactory = require('./model/collection');
var exchangeList = require('./view/exchange-list');
var exchangeService = require('./service/exchange');
var giftService = require('./service/gift');
var motifService = require('./service/motif');

giftService.init(window.serviceHost, window.servicePort);
motifService.init(window.serviceHost, window.servicePort);

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
            item.gifts.add(gift);
          });
        });
    });
    exchangeList.render(window.document.getElementById('exchange-form-container'), collFactory.create(list));
  });

module.exports = {};