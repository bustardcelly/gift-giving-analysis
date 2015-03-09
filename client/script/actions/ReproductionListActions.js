/* global $, require*/
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
        payload.map(function(item) {
          item._attachmentList = collFactory.create();
        });
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
        reproduction._attachmentList = collFactory.create();
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
  },

  update: function(reproduction) {
    var theUrl = 'http://' + this.host + ':' + this.port + '/reproduction/' + reproduction._id;
    var detachedAttachments = reproduction._attachmentList;
    delete reproduction._attachmentList;
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
    })
    .always(function() {
      reproduction._attachmentList = detachedAttachments;
    });
  },

  remove: function(reproduction) {
    var theUrl = 'http://' + this.host + ':' + this.port + '/reproduction/' + reproduction._id;
    var detachedAttachments = reproduction._attachmentList;
    delete reproduction._attachmentList;
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
        reproduction._attachmentList = detachedAttachments;
        Dispatcher.handleAsyncAction({
          type: ReproductionActionEnum.REMOVE_REPRODUCTION,
          item: reproduction
        });
      }
    })
    .fail(function(error) {
      // dfd.reject(error);
    })
    .always(function() {
      reproduction._attachmentList = detachedAttachments;
    });
  }

};

module.exports = ReproductionListActions;