/*global window*/
'use strict';
var collFactory = require('./model/collection');
var reproductionList = require('./view/reproduction-list');
var reproductionService = require('./service/reproduction');
var giftService = require('./service/gift');
var motifService = require('./service/motif');
var motifStore = require('./store/motif-store');

giftService.init(window.serviceHost, window.servicePort);
motifService.init(window.serviceHost, window.servicePort);

var accessReproductions = function() {
  reproductionService
    .init(window.serviceHost, window.servicePort)
    .all()
    .then(function(list) {
      // Array.prototype.forEach.call(list, function(item) {
      //   if(!item.hasOwnProperty('gifts')) {
      //     item.gifts = collFactory.create();
      //   }
      //   exchangeService.getGiftsForExchangeId(item._id)
      //     .then(function(gifts) {
      //       Array.prototype.forEach.call(gifts, function(gift) {
      //         item.gifts.add(gift);
      //       });
      //     });
      // });
      // exchangeList.render(window.document.getElementById('exchange-form-container'), collFactory.create(list));
      reproductionList.render(window.document.getElementById('reproduction-form-container'), collFactory.create(list));
    });
};

motifService.all()
  .then(function(list) {
    motifStore.init(list);
    accessReproductions();
  });

module.exports = {};