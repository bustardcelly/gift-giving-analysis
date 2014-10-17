/*global window*/
'use strict';
var exchangeList = require('./view/exchange-list');

var exchangeService = require('./service/exchange');

exchangeService
  .init(window.serviceHost, window.servicePort)
  .all()
  .then(function(list) {
    exchangeList.render(window.document.getElementById('exchange-form-container'), list);
  });

module.exports = {};