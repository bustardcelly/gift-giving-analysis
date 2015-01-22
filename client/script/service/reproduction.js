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
    var theUrl = 'http://' + this.host + ':' + this.port + '/reproduction';
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
  updateReproduction: function(reproduction) {
    var dfd = $.Deferred();
    var theUrl = 'http://' + this.host + ':' + this.port + '/reproduction/' + reproduction._id;
    $.ajax({
      type: 'PUT',
      url: theUrl,
      data: reproduction
    })
    .done(function(data) {
      if(data.hasOwnProperty('ok') && data.ok) {
        reproduction._id = data.id;
        reproduction._rev = data.rev;
        dfd.resolve(reproduction);
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
  }
};
