#!/bin/bash
echo "welcome"

CWD=$(pwd)
S3="${CWD}/.s3"
CREDS="${CWD}/.creds"
FILE="${CWD}/.version"
LOG="${CWD}/aws/gift-giving-analysis-backup.log"
DATE=$(date)
S3_KEY="KEY_HERE"
S3_SECRET="SECRET_HERE"
S3_BUCKET="BUCKET_HERE"

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

echo "------" >> "$LOG"
echo "$DATE" >> "$LOG"
echo "------" >> "$LOG"

version=$(cat "$FILE")
creds=$(cat "$CREDS")
aws_creds=$(cat "$S3")
IFS=', ' read -r -a array <<< "$creds"

username=${array[0]}
password=${array[1]}
endpoint="http://${username}:${password}@127.0.0.1:5984/exchange/_changes"

IFS=', ' read -r -a s3_array <<< "$aws_creds"
S3_KEY=${s3_array[0]}
S3_SECRET=${s3_array[1]}
S3_BUCKET=${s3_array[2]}

echo "Username:${username}, Password:${password}"
echo "Will ping ${endpoint}..."

echo "Checking version in ${FILE}.: ${version}" >> "$LOG"

payload=$(curl -sv -X GET -H "Content-Type: application/json" "${endpoint}" | \
        grep -m1 -e '.*\"last_seq":\(.*\).*' | \
        awk -F ":" '{print $2}' | \
        awk -F "}" '{print $1}')

# If empty string, most likely something went wrong in requesting info.
if [ -z "$payload" ]; then
  echo "Something went wrong in accessing changes."
  echo "Something went wrong in accessing changes." >> "$LOG"
  exit 1
fi

# Else the version is different, so let's back it up.
if [ "$version" != "$payload" ]; then
  echo "Previous version: ~ $version ~ doesn't match current: ~ $payload ~." >> "$LOG"
  if [ ! -d "${CWD}/aws/couchdb-dump" ]; then
    git clone https://github.com/danielebailo/couchdb-dump.git "${CWD}/aws/couchdb-dump"
  fi
  DUMP_DIR="${CWD}/aws/dump"
  DUMP_BASH="${CWD}/aws/couchdb-dump/couchdb-backup.sh"
  mkdir -p "$DUMP_DIR"
  bash "$DUMP_BASH" -b -H 127.0.0.1 -d exchange -f "${DUMP_DIR}/exchange.json" -u "${username}" -p "${password}"
  bash "$DUMP_BASH" -b -H 127.0.0.1 -d gift -f "${DUMP_DIR}/gift.json" -u "${username}" -p "${password}"
  bash "$DUMP_BASH" -b -H 127.0.0.1 -d motif -f "${DUMP_DIR}/motif.json" -u  "${username}" -p "${password}"
  bash "$DUMP_BASH" -b -H 127.0.0.1 -d reproduction -f "${DUMP_DIR}/reproduction.json" -u  "${username}" -p "${password}"
  for i in $(ls "$DUMP_DIR"); do
    S3_ACCESS_KEY="${S3_KEY}" S3_SECRET_KEY="${S3_SECRET}" S3_BUCKET_NAME="${S3_BUCKET}" python s3_deploy.py "$i" backups
  done
  node "${CWD}/aws/upload-remote.js"
  echo "$payload" > "$FILE"
  echo "Nightly Backup Successful: $DATE" >> "$LOG"
else
  echo "Already up to date. $DATE" >> "$LOG"
fi
