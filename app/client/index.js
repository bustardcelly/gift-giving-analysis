'use strict';
var http = require('http');
var path = require('path');
var io = require('socket.io');
var connect = require('connect');
var serveStatic = require('serve-static');
var defer = require('node-promise').defer;

var clientdir = path.join(process.cwd(), 'static');
var app = connect().use(serveStatic(clientdir));
var server = http.createServer(app);
var socket = io.listen(server, {log:false});


module.exports = {
  port: undefined,
  init: function(socketPort) {
    var dfd;
    this.port = socketPort;
    
    dfd = defer();

    // Start server and establish socket connection listener.
    server.listen(this.port, function() {
      console.log('Server started at http://localhost:' + socketPort + '.');
      dfd.resolve(true);
    });

    return dfd.promise;
  }
};