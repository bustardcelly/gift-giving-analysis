/*global window, $*/
'use strict';
Object.assign = require('object-assign');
var collFactory = require('./model/collection');
var reproductionList = require('./view/reproduction-list');
var reproductionService = require('./service/reproduction');

var exchangeService = require('./service/exchange');
var giftService = require('./service/gift');
var motifService = require('./service/motif');

var exchangeStore = require('./store/exchange-store');
var giftStore = require('./store/gift-store');
var motifStore = require('./store/motif-store');

exchangeService.init(window.serviceHost, window.servicePort);
giftService.init(window.serviceHost, window.servicePort);
motifService.init(window.serviceHost, window.servicePort);
reproductionService.init(window.serviceHost, window.servicePort);

var accessReproductions = function() {
  reproductionService
    .init(window.serviceHost, window.servicePort)
    .all()
    .then(function(list) {
      reproductionList.render(window.document.getElementById('reproduction-form-container'), collFactory.create(list));
    });
};

var getMotifs = function() {
  var dfd = $.Deferred();
  motifService.all()
    .then(motifStore.init.bind(motifStore))
    .then(dfd.resolve)
  return dfd;
};

var getExchanges = function() {
  var dfd = $.Deferred();
  exchangeService.all()
    .then(exchangeStore.init.bind(exchangeStore))
    .then(dfd.resolve)
  return dfd;
};

var getGifts = function() {
  var dfd = $.Deferred();
  giftService.all()
    .then(giftStore.init.bind(giftStore))
    .then(dfd.resolve)
  return dfd;
};

getMotifs()
  .then(getExchanges)
  .then(getGifts)
  .then(accessReproductions);

module.exports = {};