/*global $*/
'use strict';

module.exports = {
  host: undefined,
  port: undefined,
  init: function(host, port) {
    this.host = host;
    this.port = port;
    return this;
  },
  all: function() {
    var dfd = $.Deferred();
    var theUrl = 'http://' + this.host + ':' + this.port + '/exchange';
    $.ajax({
      type: 'GET',
      url: theUrl,
      contentType: 'json'
    })
    .done(function(data) {
      if(data.hasOwnProperty('error')) {
        dfd.reject(data.error);
      }
      else {
        dfd.resolve(data);
      }
    })
    .fail(function(error) {
      dfd.reject(error);
    });
    return dfd;
  },
  getGiftsForExchangeId: function(exchangeId) {
    var dfd = $.Deferred();
    var theUrl = 'http://' + this.host + ':' + this.port + '/gift/exchange/' + exchangeId;
    $.ajax({
      type: 'GET',
      url: theUrl,
      contentType: 'json'
    })
    .done(function(data) {
      if(data.hasOwnProperty('error')) {
        dfd.reject(data.error);
      }
      else {
        dfd.resolve(data);
      }
    })
    .fail(function(error) {
      dfd.reject(error);
    });
    return dfd;
  },
  updateExchange: function(exchange) {
    var dfd = $.Deferred();
    var theUrl = 'http://' + this.host + ':' + this.port + '/exchange/' + exchange._id;
    $.ajax({
      type: 'PUT',
      url: theUrl,
      contentType: 'json',
      data: exchange
    })
    .done(function(data) {
      if(data.hasOwnProperty('ok') && data.ok) {
        exchange._id = data.id;
        exchange._rev = data.rev;
        dfd.resolve(data);
      }
      else if(data.hasOwnProperty('error')) {
        dfd.reject(data.error);
      }
      else {
        dfd.reject(JSON.stringify(data, null, 2));
      }
    })
    .fail(function(error) {
      dfd.reject(error);
    });
    return dfd;
  },
  deleteExchange: function(exchange) {
    var dfd = $.Deferred();
    var theUrl = 'http://' + this.host + ':' + this.port + '/exchange/' + exchange._id;
    $.ajax({
      type: 'DELETE',
      url: theUrl,
      contentType: 'json',
      data: exchange
    })
    .done(function() {
      if(data.hasOwnProperty('error')) {
        dfd.reject(data.error);
      }
      else {
        dfd.resolve();
      }
    })
    .fail(function(error) {
      dfd.reject(error);
    });
    return dfd;
  }
};