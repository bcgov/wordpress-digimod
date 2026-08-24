
#!/bin/bash

#Make sure bash exits on any error so that the github action is marked as error
set -e

ENVIRONMENT=$1
export PROJECT_NAME=$2
export SITE_NAME=$3
OPENSHIFT_SERVER=$4
DEV_TOKEN=$5
TEST_TOKEN=$6
PROD_TOKEN=$7
S3_TOKEN=$8
OC_NAMEPLATE=$9


S3_AKI="webbkaki"
S3_ENDPOINT_URL="https://digital-gov.objectstore.gov.bc.ca"
S3_BUCKET_NAME="webbackup"


echo "Accessing environment: $ENVIRONMENT"
case "$ENVIRONMENT" in
    "dev")
    token=$DEV_TOKEN
    ;;
    "test")
    token=$TEST_TOKEN
    ;;
    "prod")
    token=$PROD_TOKEN
    ;;
    *)
    echo "Unknown environment: $ENVIRONMENT"
    exit 1
    ;;
esac


if [ "$OC_NAMEPLATE" = "c0cce6" ]; then
    FILENAME_SEARCH="${PROJECT_NAME}_${ENVIRONMENT}_*_backup.tar*"
else
	FILENAME_SEARCH="${PROJECT_NAME}-${SITE_NAME}_${ENVIRONMENT}_*_backup.tar*"
fi



echo "Getting list of backups for ${PROJECT_NAME}"
echo "Searching for: ${FILENAME_SEARCH}"


CMD_RESULTS=$(rclone lsf :s3:$S3_BUCKET_NAME/oc-sites-bk --include "${FILENAME_SEARCH}" --files-only --s3-provider Other --s3-access-key-id "$S3_AKI" --s3-secret-access-key "$S3_TOKEN" --s3-endpoint "$S3_ENDPOINT_URL"  --contimeout "15s" --retries 3 | sort | tail -n 20 2>&1)
CMD_EXIT_CODE=$?

echo "$CMD_RESULTS"

BACKUP_LIST=""
if [[ $CMD_EXIT_CODE -eq 0 ]]; then
	echo "Bucket check complete."

	if [ -z "$CMD_RESULTS" ]; then
		echo "No backups found!"

	else
		BACKUP_LIST=$(sort -r <<< $CMD_RESULTS | nl)
	fi

else
	echo "::error::Error grabbing list: ${CMD_RESULTS}"

	exit 96
fi 


#Generate GH Actions summary
echo "### Backups List:" >> $GITHUB_STEP_SUMMARY
echo "" >> $GITHUB_STEP_SUMMARY # this is a blank line

if [ -z "$CMD_RESULTS" ]; then
	echo "No backups found for ${PROJECT_NAME}-${SITE_NAME}_${ENVIRONMENT}_*_backup.tar*" >> $GITHUB_STEP_SUMMARY

else
	echo "Starting at backup #1 and increasing down the list." >> $GITHUB_STEP_SUMMARY
	echo "${BACKUP_LIST}" >> $GITHUB_STEP_SUMMARY
fi