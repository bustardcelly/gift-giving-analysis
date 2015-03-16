/*global window*/
'use strict';
Object.assign = require('object-assign');

var host = window.serviceHost;
var port = window.servicePort;

var MotifStore = require('./stores/MotifStore');
var GiftActions = require('./actions/GiftActions');
var ExchangeActions = require('./actions/ExchangeActions');

var ReproductionList = require('./components/reproduction/ReproductionList');
var ReproductionListActions = require('./actions/ReproductionListActions');
var ReproductionAttachmentActions = require('./actions/ReproductionAttachmentActions');

MotifStore.init(host, port).all();

GiftActions.init(host, port);
ExchangeActions.init(host, port);
ReproductionListActions.init(host, port);
ReproductionAttachmentActions.init(serviceHost, port);

ReproductionList.render(window.document.getElementById('reproduction-form-container'));

module.exports = {};
