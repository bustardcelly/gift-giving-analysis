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
var reproductionRouteController = require('./route/reproduction-controller');
var exchangeRouteController = require('./route/exchange-controller');
var motifRouteController = require('./route/motif-controller');
var giftRouteController = require('./route/gift-controller');

var server = restify.createServer({
  version: version
});
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser({
  mapParams: true,
  mapFiles: true
}));

// GET Exchange (all|id)
server.get('/exchange', exchangeRouteController.getAllExchanges);
server.get('/exchange/:id', exchangeRouteController.getExchangeById);
// POST Exchange new
server.post('/exchange', exchangeRouteController.addExchange);
// PUT Exchange update
server.put('/exchange/:id', exchangeRouteController.updateExchange);
// DELETE: Exchange previous
server.del('/exchange/:id', exchangeRouteController.deleteExchange);

// GET Gift (all|id)
server.get('/gift', giftRouteController.getAllGifts);
server.get('/gift/:id', giftRouteController.getGiftById);

// GET Gifts by Exchange
server.get('/gift/exchange/:id', giftRouteController.getGiftExchangesById);
// POST Gift new (exchangeid)
server.post('/gift/exchange/:id', giftRouteController.addGift);

// PUT Gift update
server.put('/gift/:id', giftRouteController.updateGift);
// DELETE Gift previous
server.del('/gift/:id', giftRouteController.deleteGift);

// GET Motif (all)
server.get('/motif', motifRouteController.getAllMotifs);

// GET Reproduction (all)
server.get('/reproduction', reproductionRouteController.getAllReproductions);
// POST Reproduction new
server.post('/reproduction', reproductionRouteController.addReproduction);
// PUT Reproduction update
server.put('/reproduction/:id', reproductionRouteController.updateReproduction);
// DELETE Reproduction previous
server.del('/reproduction/:id', reproductionRouteController.deleteReproduction);

// PUT Image on Reproduction Document
server.put('/reproduction/image/:id?rev=:rev', reproductionRouteController.saveAttachment);
// GET Image Attachment on Reproduction
server.get('/reproduction/:id/:filename', reproductionRouteController.getAttachment);
// DELETE Image Attachment on Reproduction
server.del('/reproduction/:id/:filename?rev=:rev', reproductionRouteController.removeAttachment);

// Initialize DB
require('./db').init(dbhost, dbport);

server.listen(port, function() {
  console.log('gift-giving-analysis %s server started at %s.', version, server.url);
  client.init(socketport);
});
