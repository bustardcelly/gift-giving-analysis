/*global $*/
'use strict';

var compareOnValue = function compare(a, b) {
  if (a.value < b.value) {
    return -1;
  }
  else if (a.value > b.value) {
    return 1;
  }
  return 0;
};

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
    var theUrl = 'http://' + this.host + ':' + this.port + '/motif';
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
        data.sort(compareOnValue);
        dfd.resolve(data);
      }
    })
    .fail(function(error) {
      dfd.reject(error);
    });
    return dfd;
  }
};