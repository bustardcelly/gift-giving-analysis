/*global window, $*/
'use strict';
Object.assign = require('object-assign');
var exchangeService = require('./service/exchange');
var giftService = require('./service/gift');

var exchangeStore = require('./store/exchange-store');
var giftStore = require('./store/gift-store');

var MotifStore = require('./stores/MotifStore');

var ReproductionList = require('./components/reproduction/ReproductionList');
var ReproductionListActions = require('./actions/ReproductionListActions');
var ReproductionAttachmentActions = require('./actions/ReproductionAttachmentActions');

exchangeService.init(window.serviceHost, window.servicePort);
giftService.init(window.serviceHost, window.servicePort);

var accessReproductions = function() {
  ReproductionListActions.init(window.serviceHost, window.servicePort);
  ReproductionAttachmentActions.init(window.serviceHost, window.servicePort);
  ReproductionList.render(window.document.getElementById('reproduction-form-container'));
};

var getExchanges = function() {
  var dfd = $.Deferred();
  exchangeService.all()
    .then(exchangeStore.init.bind(exchangeStore))
    .then(dfd.resolve);
  return dfd;
};

var getGifts = function() {
  var dfd = $.Deferred();
  giftService.all()
    .then(giftStore.init.bind(giftStore))
    .then(dfd.resolve);
  return dfd;
};

MotifStore.init(window.serviceHost, window.servicePort).all();

 getExchanges()
  .then(getGifts)
  .then(accessReproductions);

module.exports = {};