import os
import sys
import boto3

args = sys.argv[1:]

# S3 information
access_key = os.getenv('S3_ACCESS_KEY')
secret_key = os.getenv('S3_SECRET_KEY')
bucket_name = os.getenv('S3_BUCKET_NAME')

# Path to zip to upload
file_to_upload = args[0]
# Subdirectory in bucket to place zipped file
bucket_dir = args[1]

# boto3
session = boto3.Session(aws_access_key_id=access_key,
                        aws_secret_access_key=secret_key)
s3 = session.resource('s3')

f = open(file_to_upload,'rb')
s3.Bucket(bucket_name).put_object(Key=bucket_dir + '/' + os.path.basename(file_to_upload), Body=f)

