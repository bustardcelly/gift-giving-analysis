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
  addReproduction: function(reproduction) {
    var dfd = $.Deferred();
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
  },
  updateReproduction: function(reproduction) {
    var dfd = $.Deferred();
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
    })
    .always(function() {
      reproduction._attachmentList = detachedAttachments;
    });
    return dfd;
  },
  deleteReproduction: function(reproduction) {
    var dfd = $.Deferred();
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
        dfd.reject(data.error);
      }
      else {
        reproduction._attachmentList = detachedAttachments;
        dfd.resolve();
      }
    })
    .fail(function(error) {
      dfd.reject(error);
    })
    .always(function() {
      reproduction._attachmentList = detachedAttachments;
    });
    return dfd;
  },
  addAttachments: function(reproduction, formData) {
    var dfd = $.Deferred();
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
  },
  removeAttachment: function(reproduction, filename) {
    var dfd = $.Deferred();
    var theUrl = 'http://' + this.host + ':' + this.port + '/reproduction/' + reproduction._id + '/' + filename + '?rev=' + reproduction._rev;
    $.ajax({
      type: 'DELETE',
      url: theUrl
    })
    .done(function(data) {
      if(data.hasOwnProperty('ok') && data.ok) {
        reproduction._id = data.id;
        reproduction._rev = data.rev;
        try {
          delete reproduction._attachments[filename];
        }
        catch(e) {
          console.log('Could not remove image from _attachments model: ' + e.message);
        }
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
  },
  getImageAttachmentURL: function(reproduction, filename) {
    var dfd = $.Deferred();
    var theUrl = 'http://' + this.host + ':' + this.port + '/reproduction/' + reproduction._id + '/' + filename;
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
