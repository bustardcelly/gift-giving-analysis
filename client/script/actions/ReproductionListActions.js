/* global $*/
"use strict";
var Dispatcher = require('../dispatcher');
var ReproductionActionEnum = require('../enums/ReproductionAction');
var collFactory = require('../model/collection');

var ReproductionListActions = {

  host: undefined,
  port: undefined,

  init: function(host, port) {
    this.host = host;
    this.port = port;
    return this;
  },

  all: function() {
    var theUrl = 'http://' + this.host + ':' + this.port + '/reproduction';
    $.ajax({
      type: 'GET',
      url: theUrl,
      contentType: 'json'
    })
    .done(function(data) {
      var payload;
      if(data.hasOwnProperty('error')) {
        // dfd.reject(data.error);
      }
      else {
        payload = typeof data === 'string' ? JSON.parse(data) : data;
        Dispatcher.handleAsyncAction({
          type: ReproductionActionEnum.GET_REPRODUCTIONS,
          list: payload
        });
      }
    })
    .fail(function(error) {
      // dfd.reject(error);
    });
    return this;
  },

  add: function(reproduction) {
    var theUrl = 'http://' + this.host + ':' + this.port + '/reproduction';
    $.ajax({
      type: 'POST',
      url: theUrl,
      data: reproduction
    })
    .done(function(data) {
      if(data.hasOwnProperty('ok') && data.ok) {
        reproduction._id = data.id;
        reproduction._rev = data.rev;
        Dispatcher.handleAsyncAction({
          type: ReproductionActionEnum.ADD_REPRODUCTION,
          item: reproduction
        });
      }
      else if(data.hasOwnProperty('error')) {
        // dfd.reject(data.error);
      }
      else {
        // dfd.reject(JSON.stringify(data, null, 2));
      }
    })
    .fail(function(error) {
      // dfd.reject(error);
    });
    return this;
  },

  update: function(reproduction) {
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
        Dispatcher.handleAsyncAction({
          type: ReproductionActionEnum.UPDATE_REPRODUCTION,
          item: reproduction
        });
      }
      else if(data.hasOwnProperty('error')) {
        // dfd.reject(data.error);
      }
      else {
        // dfd.reject(JSON.stringify(data, null, 2));
      }
    })
    .fail(function(error) {
      // dfd.reject(error);
    });
    return this;
  },

  remove: function(reproduction) {
    var theUrl = 'http://' + this.host + ':' + this.port + '/reproduction/' + reproduction._id;
    $.ajax({
      type: 'DELETE',
      url: theUrl,
      contentType: 'json',
      data: reproduction
    })
    .done(function(data) {
      if(data.hasOwnProperty('error')) {
        // dfd.reject(data.error);
      }
      else {
        Dispatcher.handleAsyncAction({
          type: ReproductionActionEnum.REMOVE_REPRODUCTION,
          item: reproduction
        });
      }
    })
    .fail(function(error) {
      // dfd.reject(error);
    });
    return this;
}

};

module.exports = ReproductionListActions;