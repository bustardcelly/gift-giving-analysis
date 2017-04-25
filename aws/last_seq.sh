#!/bin/bash

CREDS=../.creds
FILE=../.version
LOG=./gift-giving-analysis-backup.log
DATE=$(date)

while [[ $# -gt 1 ]]
do
  key="$1"
  shift
  case $key in
    -f|--file)
      FILE="$1"
      shift
      ;;
    *)

      ;;
  esac
done

version=`cat $FILE`
creds=`cat $CREDS`
IFS=', ' read -r -a array <<< $creds
username=${array[0]}
password=${array[1]}
endpoint="http://${username}:${password}@127.0.0.1:5984/exchange/_changes"

echo "Checking version in ${FILE}.: ${version}" >> $LOG

payload=`curl -s -X GET -H "Content-Type: application/json" $endpoint | \
        grep -m1 -e '.*\"last_seq":\(.*\).*' | \
        awk -F ":" '{print $2}' | \
        awk -F "}" '{print $1}'`

if [ "$version" != "$payload" ]; then
  echo "Previous version: ~ $version ~ doesn't match current: ~ $payload ~."
  echo `node aws/upload-remote.js`
  echo $payload > $FILE
  echo "Nightly Backup Successful: $DATE" >> $LOG
else
  echo "Already up to date. $DATE" >> $LOG
fi
