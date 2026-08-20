
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

echo "Backing up from environment: $ENVIRONMENT"
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

echo "::group::Login to OC"

#Sometimes oc login will fail to connect, so lets re-try on failure.
set +e
oc login $OPENSHIFT_SERVER --token=$PROD_TOKEN
ret=$?
set -e
if [ $ret -eq 0 ]; then
    # The command was successful
    echo "Login successful"

else
    echo "Re-trying oc-login in 10s..."

    sleep 10

    # The command was not successful, lets try again
    oc login $OPENSHIFT_SERVER --token=$PROD_TOKEN

fi

echo "::endgroup::"




NAMESPACE="$OC_NAMEPLATE-$ENVIRONMENT"
OC_ENV=$ENVIRONMENT

if [ "$SITE_NAME" = "$PROJECT_NAME" ]; then
	OC_SITE_NAME="$PROJECT_NAME"
else
	OC_SITE_NAME="$PROJECT_NAME-$SITE_NAME"
fi


echo "OC Nameplate: $OC_NAMEPLATE"
echo "OC Site Name: $OC_SITE_NAME"

WORDPRESS_POD_NAME=$(oc get pods -n $NAMESPACE -l app=wordpress,role=wordpress-core,site=${OC_SITE_NAME} -o jsonpath='{.items[0].metadata.name}')
WORDPRESS_CONTAINER_NAME=$(oc get pods -n $NAMESPACE $WORDPRESS_POD_NAME -o jsonpath='{.spec.containers[0].name}')

DB_POD_NAME=$(oc get pods -n $NAMESPACE -l app=wordpress,role=mariadb,site=${OC_SITE_NAME} -o jsonpath='{.items[0].metadata.name}')
DB_CONTAINER_NAME=$(oc get pods -n $NAMESPACE $DB_POD_NAME -o jsonpath='{.spec.containers[0].name}')


#create backup of database 
echo "::group::Create DB backup"
echo "DB Pod Name: $DB_POD_NAME"
echo "DB Container Name: $DB_CONTAINER_NAME"  

#DEV. Fake an invalid pod
#DB_POD_NAME="UNREAL_POD"


set +e
CMD1_RESULTS=$( (oc exec -n $NAMESPACE -c $DB_CONTAINER_NAME $DB_POD_NAME -- sh -c 'mariadb-dump  -u root -p$(cat $MYSQL_ROOT_PASSWORD_FILE) $MYSQL_DATABASE | gzip' > db.sql.gz) 2>&1)
CMD1_EXIT_CODE=$?
set -e
if [ $CMD1_EXIT_CODE -eq 0 ]; then
	echo "Success creating database backup"
	echo "Code: $CMD1_EXIT_CODE"
	echo "$CMD1_RESULTS"

	du -sh db.sql.gz

	LOCAL_MD5=($(md5sum ./db.sql.gz))
	echo "-- MD5 of db backup file: $LOCAL_MD5"

else
	echo "Error creating database backup:"
	echo "Code: $CMD1_EXIT_CODE"
	echo "$CMD1_RESULTS"
	exit 99
fi

echo "::endgroup::"


#create backup of files
echo "::group::Create files backup"
echo "WP Pod Name: $WORDPRESS_POD_NAME"
echo "WP Container Name: $WORDPRESS_CONTAINER_NAME"  
set +e
CMD2_RESULTS=$( (oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- tar --warning=no-file-changed -czf  - -C /var/www/html . > files.tar.gz) 2>&1)
CMD2_EXIT_CODE=$?
set -e
if [[ $CMD2_EXIT_CODE -eq 0 || $CMD2_EXIT_CODE -eq 1 ]]; then   #file-changed warning will still causes an exit code of 1, so dont error.
	echo "Success creating files backup"
	echo "Code: $CMD2_EXIT_CODE"
	echo "$CMD2_RESULTS"

	du -sh files.tar.gz
	LOCAL_MD5=($(md5sum ./files.tar.gz))
	echo "-- MD5 of  files backup file: $LOCAL_MD5"

else
	echo "Error creating files backup:"
	echo "Code: $CMD2_EXIT_CODE"
	echo "$CMD2_RESULTS"
	exit 99
fi
echo "::endgroup::"


#combine the db and files into 1 archive
timestamp=$(date +%Y%m%d_%H%M%S)
BACKUP_FILENAME=${OC_SITE_NAME}_${OC_ENV}_${timestamp}_backup.tar
echo "::group::Create final backup archive - ${BACKUP_FILENAME}"
CMD3_RESULTS=$(tar -cvf ${BACKUP_FILENAME} files.tar.gz db.sql.gz 2>&1)
CMD3_EXIT_CODE=$?
#echo "${CMD3_RESULTS}"
echo "::endgroup::"


rm files.tar.gz          

echo "Uploading backup archive to BCGov S3"
CMD4_RESULTS=$(rclone copy ${BACKUP_FILENAME} :s3:$S3_BUCKET_NAME/oc-sites-bk/ --s3-provider Other --s3-access-key-id "$S3_AKI" --s3-secret-access-key "$S3_TOKEN" --s3-endpoint "$S3_ENDPOINT_URL" -P --stats-log-level NOTICE --stats 60s --contimeout "15s" --retries 3 2>&1)
CMD4_EXIT_CODE=$?
echo "${CMD4_RESULTS}"



#rename the db backup
BACKUP_DB_FILENAME=${OC_SITE_NAME}_${OC_ENV}_${timestamp}_db-backup.tar
mv db.sql.gz ${BACKUP_DB_FILENAME}
   

echo "Uploading backup database archive to BCGov S3"
CMD5_RESULTS=$(rclone copy ${BACKUP_DB_FILENAME} :s3:$S3_BUCKET_NAME/oc-sites-bk/ --s3-provider Other --s3-access-key-id "$S3_AKI" --s3-secret-access-key "$S3_TOKEN" --s3-endpoint "$S3_ENDPOINT_URL" -P --stats-log-level NOTICE --stats 60s --contimeout "15s" --retries 3 2>&1)
CMD5_EXIT_CODE=$?
echo "${CMD5_RESULTS}"



#Generate GH Actions summary
echo "### Created Backup" >> $GITHUB_STEP_SUMMARY
echo "Backup File: $S3_BUCKET_NAME/oc-sites-bk/${BACKUP_FILENAME}" >> $GITHUB_STEP_SUMMARY
echo "Backup File: $S3_BUCKET_NAME/oc-sites-bk/${BACKUP_DB_FILENAME}" >> $GITHUB_STEP_SUMMARY
echo "" >> $GITHUB_STEP_SUMMARY # this is a blank line

echo "### Command Results: " >> $GITHUB_STEP_SUMMARY
echo "" >> $GITHUB_STEP_SUMMARY # this is a blank line
echo "${CMD4_RESULTS}" >> $GITHUB_STEP_SUMMARY
echo "${CMD5_RESULTS}" >> $GITHUB_STEP_SUMMARY