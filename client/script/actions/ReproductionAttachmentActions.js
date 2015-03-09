/*global $*/
"use strict";
var Q = require('q');
var Dispatcher = require('../dispatcher');
var ReproductionAttachmentActionEnum = require('../enums/ReproductionAttachmentAction');

var createGetRequest = function(filename) {
  return function() {
    var theUrl = 'http://' + this.host + ':' + this.port + '/reproduction/' + reproduction._id + '/' + filename;
    return $.ajax({type: 'GET', url: theUrl, contentType: 'json'});
  };
};

var ReproductionAttachmentActions = {

  host: undefined,
  port: undefined,

  init: function(host, port) {
    this.host = host;
    this.port = port;
    return this;
  },

  get: function(reproductionId, filenames) {
    var list = [];
    var requests = filenames.map(function(filename) {
      return createGetRequest(filename);
    });
    Q.allSettled(requests)
      .then(function(results) {
        results.forEach(function(result) {
          if(result.state === 'fulfilled') {
            list.push(result.value);
          }
        });
        Dispatcher.handleAsyncAction({
          type: ReproductionAttachmentActionEnum.GET_ATTACHMENTS,
          list: list,
          id: reproductionId
        });
      });
  },

  add: function(reproduction, fomrData) {
   var theUrl = 'http://' + this.host + ':' + this.port + '/reproduction/image/' + reproduction._id + '?rev=' + reproduction._rev;
   $.ajax({
     type: 'PUT',
     url: theUrl,
     processData: false,
     contentType: false,
     data: formData
   })
   .done(function(data) {
     if(data.hasOwnProperty('ok') && data.ok) {
       reproduction._id = data.id;
       reproduction._rev = data.rev;
       Dispatcher.handleAsyncAction({
          type: ReproductionAttachmentActionEnum.ADD_ATTACHMENT
       });
     }
     else if(data.hasOwnProperty('error')) {
       Dispatcher.handleAsyncAction({
          type: ReproductionAttachmentActionEnum.ADD_ATTACHMENT,
          error: error
        });
     }
     else {
       Dispatcher.handleAsyncAction({
          type: ReproductionAttachmentActionEnum.ADD_ATTACHMENT,
          error: JSON.stringify(data, null, 2)
        });
     }
   })
   .fail(function(error) {
     Dispatcher.handleAsyncAction({
          type: ReproductionAttachmentActionEnum.ADD_ATTACHMENT,
          error: error
        });
   });

  }

};

module.exports = ReproductionAttachmentActions;
