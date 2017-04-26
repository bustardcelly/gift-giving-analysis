'use strict';
var http = require('http');
var path = require('path');
var connect = require('connect');
var serveStatic = require('serve-static');
var defer = require('node-promise').defer;
var argsv = require('minimist')(process.argv.slice(2));

var clientdir = path.join(process.cwd(), 'static');
var app = connect().use(serveStatic(clientdir));
var server = http.createServer(app);

var port = argsv.port || 8002;
server.listen(port, function() {
	console.log('Client Server started at http://localhost:' + socketPort + '.');
});
/*
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
*/
