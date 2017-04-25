var fs = require('fs');
var path = require('path');
var ini = require('ini');
var knox = require('knox');
var baseDir = [process.cwd(), 'aws'].join(path.sep);

var credentialsFile = [baseDir, 'credentials'].join(path.sep);

var dbPathBase = '/var/lib/docker/vfs/dir/a7cec35f97d31a7fb17072b13fe44bdc434aa9aa96f575d1d541ae21c0e03f90';
var giftDB = [dbPathBase, 'gift.couch'].join('/');
var exchangeDB = [dbPathBase, 'exchange.couch'].join('/');
var motifDB = [dbPathBase, 'motif.couch'].join('/');
var reproductionDB = [dbPathBase, 'reproduction.couch'].join('/');

var dbs = [giftDB, exchangeDB, motifDB, reproductionDB];

var getCredentials = function(file) {
  var credFile = fs.readFileSync(file, 'utf8');
  var credentials = ini.decode(credFile);
  return credentials['default'];
};
var credentials = getCredentials(credentialsFile);
var client = knox.createClient({
  key: credentials.aws_access_key_id,
  secret: credentials.aws_secret_access_key,
  bucket: 'gift-giving-analysis'
});

var uploadDB = function(client, db, callback) {
  var upFilename = db.substr(db.lastIndexOf('/'), db.length);
  client.putFile(db, upFilename, callback);
};
var uploadNext = function(err, response) {

  if(err) {
    console.error('Error in uploading DB: ' + err);
  }
  else if(response !== undefined && response.statusCode === 200) {
    console.log('Upload complete.');
  }
  else if(response !== undefined) {
    console.error('Error in uploading DB, possibly from connection to Amazon S3.');
  }

  if(dbs.length > 0) {
    uploadDB(client, dbs.shift(), uploadNext);
  }
};

uploadNext();
