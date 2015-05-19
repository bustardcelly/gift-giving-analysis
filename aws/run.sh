#!/bin/bash

backup-couchdb-to-s3 --dbUrl http://localhost:5984 --dbName gift --s3BucketName gift-giving-analysis --awsCredentialsPath ./aws/credentials
backup-couchdb-to-s3 --dbUrl http://localhost:5984 --dbName motif --s3BucketName gift-giving-analysis --awsCredentialsPath ./aws/credentials
backup-couchdb-to-s3 --dbUrl http://localhost:5984 --dbName reproduction --s3BucketName gift-giving-analysis --awsCredentialsPath ./aws/credentials
