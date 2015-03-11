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

  add: function(reproductionItem, fileName, dataSource, formData) {
    ReproductionAttachmentActions.add(reproductionItem, fileName, dataSource, formData);
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
  },

  removeRemoveListener: function(callback) {
  }

});

Dispatcher.register(ReproductionAttachmentStore, function(payload) {

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
        ReproductionAttachmentStore.createIfNotExist(action.id).push(action.attachment);
        ReproductionAttachmentStore.emit(ReproductionAttachmentEventEnum.ADD_ATTACHMENT_EVENT);
      }
      break;
  }

});

module.exports = ReproductionAttachmentStore;
