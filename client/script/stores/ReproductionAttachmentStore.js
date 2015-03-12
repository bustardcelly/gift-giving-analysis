'use strict';

var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var Dispatcher = require('../dispatcher');
var ReproductionAttachmentEventEnum = require('../enums/ReproductionAttachmentEvent');
var ReproductionAttachmentActionEnum = require('../enums/ReproductionAttachmentAction');
var ReproductionAttachmentActions = require('../actions/ReproductionAttachmentActions');

var attachmentMap = {};

var ReproductionAttachmentStore = assign({}, EventEmitter.prototype, {

  get: function(reproductionId, filenames) {
    ReproductionAttachmentActions.get(reproductionId, filenames);
  },

  createIfNotExist: function(reproductionId) {
    if(!attachmentMap.hasOwnProperty(reproductionId)) {
      attachmentMap[reproductionId] = [];
    }
    return attachmentMap[reproductionId];
  },

  all: function(reproductionId) {
    if(attachmentMap.hasOwnProperty(reproductionId)) {
      return attachmentMap[reproductionId];
    }
    return undefined;
  },

  pend: function(reproductionItem, fileName, dataSource) {
    this.createIfNotExist(reproductionItem._id).push({
      loading: fileName,
      src: dataSource
    });
    this.emit(ReproductionAttachmentEventEnum.ADD_ATTACHMENT_EVENT);
  },

  add: function(reproductionItem, fileName, dataSource, formData) {
    ReproductionAttachmentActions.add(reproductionItem, fileName, dataSource, formData);
  },

  remove: function(reproductionItem, fileName) {
    ReproductionAttachmentActions.remove(reproductionItem, fileName);
  },

  addGetListener: function(callback) {
    this.on(ReproductionAttachmentEventEnum.GET_ATTACHMENTS_EVENT, callback);
  },

  removeGetListener: function(callback) {
    this.removeListener(ReproductionAttachmentEventEnum.GET_ATTACHMENTS_EVENT, callback);
  },

  addAddListener: function(callback) {
    this.on(ReproductionAttachmentEventEnum.ADD_ATTACHMENT_EVENT, callback);
  },

  removeAddListener: function(callback) {
    this.removeListener(ReproductionAttachmentEventEnum.ADD_ATTACHMENT_EVENT, callback);
  },

  addRemoveListener: function(callback) {
    this.on(ReproductionAttachmentEventEnum.REMOVE_ATTACHMENT_EVENT, callback);
  },

  removeRemoveListener: function(callback) {
    this.removeListener(ReproductionAttachmentEventEnum.REMOVE_ATTACHMENT_EVENT, callback);
  }

});

Dispatcher.register(ReproductionAttachmentStore, function(payload) {

  var i;
  var list;
  var action = payload.action;
  switch(action.type) {
    case ReproductionAttachmentActionEnum.GET_ATTACHMENTS:
      attachmentMap[action.id] = action.list;
      ReproductionAttachmentStore.emit(ReproductionAttachmentEventEnum.GET_ATTACHMENTS_EVENT);
      break;
    case ReproductionAttachmentActionEnum.ADD_ATTACHMENT:
      if(action.error) {
        // TODO: Handle error.
      }
      else {
        list = ReproductionAttachmentStore.createIfNotExist(action.id);
        i = list.length;
        while(--i > -1) {
          if(list[i].hasOwnProperty('loading')) {
            if(list[i].loading === action.attachment.filename) {
              list.splice(i, 1);
              break;
            }
          }
        }
        list.push(action.attachment);
        ReproductionAttachmentStore.emit(ReproductionAttachmentEventEnum.ADD_ATTACHMENT_EVENT);
      }
      break;
    case ReproductionAttachmentActionEnum.REMOVE_ATTACHMENT:
        if(action.error) {
          // TODO: Handle error.
        }
        else {
          list = ReproductionAttachmentStore.createIfNotExist(action.id);
          i = list.length;
          while(--i > -1) {
            if(list[i].filename === action.attachment.filename) {
              list.splice(i, 1);
              break;
            }
          }
          ReproductionAttachmentStore.emit(ReproductionAttachmentEventEnum.REMOVE_ATTACHMENT_EVENT);
        }
      break;
  }

});

module.exports = ReproductionAttachmentStore;
