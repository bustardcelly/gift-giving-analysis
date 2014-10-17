/*global window*/
'use strict';
var _ = require('lodash');

var collFactory = require('./model/collection');
var exchangeList = require('./view/exchange-list');
var exchangeService = require('./service/exchange');

exchangeService
  .init(window.serviceHost, window.servicePort)
  .all()
  .then(function(list) {
    _.forEach(list, function(item) {
      if(!item.hasOwnProperty('gifts')) {
        item.gifts = collFactory.create();
      }
    });
    exchangeList.render(window.document.getElementById('exchange-form-container'), list);
    list[0].gifts.add({name:'hello, world'});
  });

module.exports = {};