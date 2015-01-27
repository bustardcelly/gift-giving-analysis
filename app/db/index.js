'use strict';

var connection;
var cradle = require('cradle');

var exchange = require('./exchange');
var gift = require('./gift');
var motif = require('./motif');
var reproduction = require('./reproduction');

module.exports = {
  exchange: exchange,
  gift: gift,
  motif: motif,
  reproduction: reproduction,
  init: function(host, port) {
    console.log('Connecting to ' + host + ':' + port);
    connection = new(cradle.Connection)(host, port, {
      cache: true,
      raw: false,
      forceSave: true
    });
    this.exchange.init(connection);
    this.gift.init(connection);
    this.motif.init(connection);
    this.reproduction.init(connection, host, port);
    return this;
  }
};
