/*global $*/
'use strict';

var RequestQueueItem = function(url, dfd, callbackFn) {
  this.url = url;
  this.dfd = dfd;
  this.callback = callbackFn;
}

RequestQueueItem.prototype = new Object();
RequestQueueItem.prototype.constructor = RequestQueueItem;

RequestQueueItem.prototype.execute = function() {
  var p = this.dfd;
  var fn = this.callback;
  $.ajax({
    type: 'GET',
    url: this.url,
    contentType: 'json'
  })
  .done(function(data) {
    if(data.hasOwnProperty('error')) {
      p.reject(data.error);
    }
    else {
      p.resolve(data);
    }
    fn();
  })
  .fail(function(error) {
    p.reject(error);
    fn();
  });
}

module.exports = {
  host: undefined,
  port: undefined,
  queue: undefined,
  inQueue: false,
  boundNext: undefined,
  next: function () {
    if (this.queue.length > 0) {
      this.inQueue = true;
      this.queue.shift().execute();
    }
    else {
      this.inQueue = false;
    }
  },
  init: function(host, port) {
    this.host = host;
    this.port = port;
    this.queue = [];
    this.boundNext = this.next.bind(this);
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
    this.queue.push(new RequestQueueItem(theUrl, dfd, this.boundNext));
    if (!this.inQueue) {
      this.next();
    }
    return dfd;
  },
  addExchange: function(exchange) {
    var dfd = $.Deferred();
    var theUrl = 'http://' + this.host + ':' + this.port + '/exchange';
    $.ajax({
      type: 'POST',
      url: theUrl,
      data: exchange
    })
    .done(function(data) {
      if(data.hasOwnProperty('ok') && data.ok) {
        exchange._id = data.id;
        exchange._rev = data.rev;
        dfd.resolve(exchange);
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
  updateExchange: function(exchange) {
    var dfd = $.Deferred();
    var theUrl = 'http://' + this.host + ':' + this.port + '/exchange/' + exchange._id;
    $.ajax({
      type: 'PUT',
      url: theUrl,
      data: exchange
    })
    .done(function(data) {
      if(data.hasOwnProperty('ok') && data.ok) {
        exchange._id = data.id;
        exchange._rev = data.rev;
        dfd.resolve(exchange);
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
    var detachedGifts = exchange.gifts;
    delete exchange.gifts;
    $.ajax({
      type: 'DELETE',
      url: theUrl,
      contentType: 'json',
      data: exchange
    })
    .done(function(data) {
      if(data.hasOwnProperty('error')) {
        exchange.gifts = detachedGifts;
        dfd.reject(data.error);
      }
      else {
        exchange.gifts = detachedGifts;
        dfd.resolve();
      }
    })
    .fail(function(error) {
      exchange.gifts = detachedGifts;
      dfd.reject(error);
    });
    return dfd;
  }
};