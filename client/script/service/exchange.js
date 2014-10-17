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
      dfd.resolve(data);
    })
    .fail(function(error) {
      dfd.reject(error);
    });
    return dfd;
  }
};