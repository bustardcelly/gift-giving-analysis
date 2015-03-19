/* global $*/
'use strict';
var Q = require('q');
var Dispatcher = require('../dispatcher');
var ExchangeActionEnum = require('../enums/ExchangeAction');

var ExchangeActions = {

  host: undefined,
  port: undefined,

  init: function(host, port) {
    this.host = host;
    this.port = port;
    return this;
  },

  all: function() {
    var deferred = Q.defer();
    var theUrl = 'http://' + this.host + ':' + this.port + '/exchange';
    $.ajax({
      type: 'GET',
      url: theUrl,
      contentType: 'json'
    })
    .done(function(data) {
      var payload;
      if(data.hasOwnProperty('error')) {
        deferred.reject(JSON.stringify(data.error));
      }
      else {
        payload = typeof data === 'string' ? JSON.parse(data) : data;
        Dispatcher.handleAsyncAction({
          type: ExchangeActionEnum.GET_EXCHANGES,
          list: payload
        });
        deferred.resolve(payload);
      }
    })
    .fail(function(error) {
      deferred.reject(JSON.stringify(error));
    });
    return deferred.promise;
  }

};

module.exports = ExchangeActions;
