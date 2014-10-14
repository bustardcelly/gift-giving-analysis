'use strict';
var path = require('path');
var restify = require('restify');
var argsv = require('minimist')(process.argv.slice(2));

// Server configuration.
var port = argsv.port || 8001;
var socketport = argsv.socketport || 8002;

// Default CouchDB host/port.
var dbhost = argsv.dbhost || '127.0.0.1';
var dbport = argsv.dbport || 5984;
var version = require(path.join(process.cwd(), 'package.json')).version;

var client = require('./client');
var exchangeRouteController = require('./route/exchange-controller');
var giftRouteController = require('./route/gift-controller');

var server = restify.createServer({
  version: version
});
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

// server.get('/exchange', exchangeRouteController.getExchanges);
server.post('/exchange', exchangeRouteController.postExchange);
// server.get('/exchange/:id', exchangeRouteController.getExchangeById);

// server.get('/gift', giftRouteController.getGifts);
// server.post('/gift', giftRouteController.postGift);
// server.get('/gift/:id', giftRouteController.getGiftById);

// Initialize DB
require('./db').init(dbhost, dbport);

server.listen(port, function() {
  console.log('gift-giving-analysis %s server started at %s.', version, server.url);
  client.init(socketport);
});
