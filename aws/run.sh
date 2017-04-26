#!/bin/bash

backup-couchdb-to-s3 --dbUrl http://localhost:5984 --dbName exchange --s3BucketName gift-giving-analysis --awsCredentialsPath ./credentials
backup-couchdb-to-s3 --dbUrl http://localhost:5984 --dbName gift --s3BucketName gift-giving-analysis --awsCredentialsPath ./credentials
backup-couchdb-to-s3 --dbUrl http://localhost:5984 --dbName motif --s3BucketName gift-giving-analysis --awsCredentialsPath ./credentials
backup-couchdb-to-s3 --dbUrl http://localhost:5984 --dbName reproduction --s3BucketName gift-giving-analysis --awsCredentialsPath ./credentials
