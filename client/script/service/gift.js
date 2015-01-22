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
    var theUrl = 'http://' + this.host + ':' + this.port + '/gift';
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
  addGift: function(exchangeId, gift) {
    var dfd = $.Deferred();
    var theUrl = 'http://' + this.host + ':' + this.port + '/gift/exchange/' + exchangeId;
    console.log('Add: ' + JSON.stringify(gift, null, 2));
    $.ajax({
      type: 'POST',
      url: theUrl,
      data: gift
    })
    .done(function(data) {
      if(data.hasOwnProperty('ok') && data.ok) {
        gift._id = data.id;
        gift._rev = data.rev;
        dfd.resolve(gift);
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
  updateGift: function(gift) {
    var dfd = $.Deferred();
    var theUrl = 'http://' + this.host + ':' + this.port + '/gift/' + gift._id;
    console.log('Update: ' + JSON.stringify(gift, null, 2));
    $.ajax({
      type: 'PUT',
      url: theUrl,
      data: gift
    })
    .done(function(data) {
      if(data.hasOwnProperty('ok') && data.ok) {
        gift._id = data.id;
        gift._rev = data.rev;
        dfd.resolve(gift);
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
  deleteGift: function(gift) {
    var dfd = $.Deferred();
    var theUrl = 'http://' + this.host + ':' + this.port + '/gift/' + gift._id;
    $.ajax({
      type: 'DELETE',
      url: theUrl,
      contentType: 'json',
      data: gift
    })
    .done(function(data) {
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