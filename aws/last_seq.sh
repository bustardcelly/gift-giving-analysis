#!/bin/bash

FILE=/home/ubuntu/gift-giving-analysis/.version
LOG=/home/ubuntu/gift-giving-analysis/aws/gift-giving-analysis-backup.log
DATE=`date`

while [[ $# > 1 ]]
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
echo "Checking version in ${FILE}.: ${version}"

payload=`curl -s -X GET -H "Content-Type: application/json" http://127.0.0.1:5984/exchange/_changes | \
        grep -m1 -e '.*\"last_seq":\(.*\).*' | \
        awk -F ":" '{print $2}' | \
        awk -F "}" '{print $1}'`

if [ "$version" != "$payload" ]; then
  echo `node aws/upload-remote.js`
  echo $payload > $FILE
else
  echo "Already up to date."
fi

echo "Nightly Backup Successful: $DATE" >> $LOG
