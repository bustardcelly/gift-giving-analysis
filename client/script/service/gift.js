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
    var detachedAttachments = gift._attachmentList;
    delete gift._attachmentList;
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
    })
    .always(function() {
      gift._attachmentList = detachedAttachments;
    });
    return dfd;
  },
  deleteGift: function(gift) {
    var dfd = $.Deferred();
    var theUrl = 'http://' + this.host + ':' + this.port + '/gift/' + gift._id;
    var detachedAttachments = gift._attachmentList;
    delete gift._attachmentList;
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
        gift._attachmentList = detachedAttachments;
        dfd.resolve();
      }
    })
    .fail(function(error) {
      dfd.reject(error);
    })
    .always(function() {
      gift._attachmentList = detachedAttachments;
    });
    return dfd;
  },
  addAttachments: function(gift, formData) {
    var dfd = $.Deferred();
    var theUrl = 'http://' + this.host + ':' + this.port + '/gift/image/' + gift._id + '?rev=' + gift._rev;
    $.ajax({
      type: 'PUT',
      url: theUrl,
      processData: false,
      contentType: false,
      data: formData
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
  removeAttachment: function(gift, filename) {
    var dfd = $.Deferred();
    var theUrl = 'http://' + this.host + ':' + this.port + '/gift/' + gift._id + '/' + filename + '?rev=' + gift._rev;
    $.ajax({
      type: 'DELETE',
      url: theUrl
    })
    .done(function(data) {
      if(data.hasOwnProperty('ok') && data.ok) {
        gift._id = data.id;
        gift._rev = data.rev;
        delete gift._attachments[filename];
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
  getImageAttachmentURL: function(gift, filename) {
    var dfd = $.Deferred();
    var theUrl = 'http://' + this.host + ':' + this.port + '/gift/' + gift._id + '/' + filename;
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
  }
};