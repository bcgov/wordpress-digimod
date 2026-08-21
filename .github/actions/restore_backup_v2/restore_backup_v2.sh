#!/bin/bash

#Make sure bash exits on any error so that the github action is marked as error
set -e

ENVIRONMENT=$1
PROJECT_NAME=$2
SITE_NAME=$3
OPENSHIFT_SERVER=$4
DEV_TOKEN=$5
TEST_TOKEN=$6
PROD_TOKEN=$7
BACKUP_NUMBER=$8
S3_TOKEN=$9
OC_NAMEPLATE=${10}
RESTORE_FILES=${11}
RESTORE_DB=${12}


S3_AKI="webbkaki"
S3_ENDPOINT_URL="https://digital-gov.objectstore.gov.bc.ca"
S3_BUCKET_NAME="webbackup"


#only allow restore on prod to the -backup instances
if [ $ENVIRONMENT = "prod" ]; then
    if [ $SITE_NAME != "backup" ]; then 
        echo "Only allowed to restore to the backup instances on prod!"
        exit 99
    fi
fi


if [ $RESTORE_FILES != "true" ] && [ $RESTORE_DB != "true" ]; then
    echo "At least one of restore files or restore db must be true"
    exit 99
fi


if [ "$OC_NAMEPLATE" = "c0cce6" ]; then
	FILENAME_SEARCH="${PROJECT_NAME}_prod_*_backup.tar*"
else
    FILENAME_SEARCH="$PROJECT_NAME-prod_prod_*_backup.tar*"
fi

echo "OC Nameplate: $OC_NAMEPLATE"
echo "Project Name: $PROJECT_NAME"


#copy down the backup file from s3
echo "Grabbing the backup filename for backup #$BACKUP_NUMBER - pattern ${FILENAME_SEARCH}"
CMD_RESULTS=$(rclone lsf :s3:$S3_BUCKET_NAME/oc-sites-bk --include "$FILENAME_SEARCH" --files-only --s3-provider Other --s3-access-key-id "$S3_AKI" --s3-secret-access-key "$S3_TOKEN" --s3-endpoint "$S3_ENDPOINT_URL"  --contimeout "15s" --retries 3 | sort | tail -n ${BACKUP_NUMBER} | sed -n "1p")

if [ -z "$CMD_RESULTS" ]; then
    echo "::error::Unknown backup file name: ${CMD_RESULTS}"

    exit 96
fi 


S3_FILENAME=$CMD_RESULTS

if [[ "$S3_FILENAME" == *".problem"* ]]; then
    echo "# Restoring from a possible problematic backup. ${S3_FILENAME}" >> $GITHUB_STEP_SUMMARY
fi


echo "Grabbing backup file: $S3_FILENAME"
set +e
CMD1_RESULTS=$(rclone copy :s3:$S3_BUCKET_NAME/oc-sites-bk/$S3_FILENAME . --s3-provider Other --s3-access-key-id "$S3_AKI" --s3-secret-access-key "$S3_TOKEN" --s3-endpoint "$S3_ENDPOINT_URL" -P --stats-log-level NOTICE --stats 60s 2>&1)
CMD1_EXIT_CODE=$?
set -e
echo "${CMD1_EXIT_CODE}"
echo "${CMD1_RESULTS}"




if [[ "$CMD1_EXIT_CODE" -eq 0 && -f "$S3_FILENAME" ]]; then 
    echo "Using environment: $ENVIRONMENT"

    case "$ENVIRONMENT" in
        "dev")
        token=$DEV_TOKEN
        ;;
        "test")
        token=$TEST_TOKEN
        ;;
        "prod")
        token=$PROD_TOKEN
        # echo "For safety reasons, we won't run this action on prod!"
        # exit 1
        ;;
        *)
        echo "Unknown environment: $ENVIRONMENT"
        exit 1
        ;;
    esac

    OC_ENV=$ENVIRONMENT
    if [ "$SITE_NAME" = "$PROJECT_NAME" ]; then
        OC_SITE_NAME="$PROJECT_NAME"
    else
        OC_SITE_NAME="$PROJECT_NAME-$SITE_NAME"
    fi


    echo "Deploying to the site $OC_SITE_NAME in $OC_ENV"

    # Log in to OpenShift
    echo "::group::Login to target OC"
    #Sometimes oc login will fail to connect, so lets re-try on failure.
    set +e
    oc login $OPENSHIFT_SERVER --token=$token
    ret=$?
    set -e
    if [ $ret -eq 0 ]; then
        # The command was successful
        echo "Login successful"

    else
        echo "Re-trying oc-login in 10s..."

        sleep 10

        # The command was not successful, lets try again
        oc login $OPENSHIFT_SERVER --token=$token

    fi

    echo "::endgroup::"


    NAMESPACE="$OC_NAMEPLATE-$ENVIRONMENT"
    WORDPRESS_POD_NAME=$(oc get pods -n $NAMESPACE -l app=wordpress,role=wordpress-core,site=${OC_SITE_NAME} -o jsonpath='{.items[0].metadata.name}')
    WORDPRESS_CONTAINER_NAME=$(oc get pods -n $NAMESPACE $WORDPRESS_POD_NAME -o jsonpath='{.spec.containers[0].name}')

    DB_POD_NAME=$(oc get pods -n $NAMESPACE -l app=wordpress,role=mariadb,site=${OC_SITE_NAME} -o jsonpath='{.items[0].metadata.name}')
    DB_CONTAINER_NAME=$(oc get pods -n $NAMESPACE $DB_POD_NAME -o jsonpath='{.spec.containers[0].name}')

    if [ -z "$WORDPRESS_CONTAINER_NAME" ]; then
        echo "::error::Unknown site name: ${SITE_NAME}"

        exit 98
    fi 

    

    #erase any cleanbc plugin assets before restore
    # echo "Cleaning the bcgov-plugin-cleanbc/dist/assets folder"
    # set +e
	# CLEANBCPLUGIN_VERSION=$(oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- php /tmp/wp-cli.phar plugin get bcgov-plugin-cleanbc --field=version 2>&1)
	# CLEANBCPLUGIN_VERSION_EXIT_CODE=$?
	# set -e
	# if [ CLEANBCPLUGIN_VERSION_EXIT_CODE -eq 0 ]; then		
    #     oc exec  -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- bash -c "rm /var/www/html/wp-content/plugins/bcgov-plugin-cleanbc/dist/assets/*"
    
	# else
	# 	echo "bcgov-plugin-cleanbc Not installed"

	# 	echo "::warning::bcgov-plugin-cleanbc Not installed"
	# fi
    

    #perform the restore
    echo "Running restore"
    echo " Namespace: ${NAMESPACE}"
    echo " Container Name: ${WORDPRESS_CONTAINER_NAME}"
    echo " Pod Name: ${WORDPRESS_POD_NAME}"

    echo " Restore Files: ${RESTORE_FILES}"
    echo " Restore DB: ${RESTORE_DB}"
    

    # Download wp-cli in the GitHub Actions workspace
    echo "Getting and copying WP CLI phar"
    curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
    chmod +x wp-cli.phar

    # Copy wp-cli to the WordPress instance and install wordpress
    oc cp --no-preserve wp-cli.phar $NAMESPACE/$WORDPRESS_POD_NAME:/tmp/wp-cli.phar -c $WORDPRESS_CONTAINER_NAME
    oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- chmod +x /tmp/wp-cli.phar


    echo "Expanding backup archive on runner"
    tar -xvf $S3_FILENAME
    #should end up with db.sql.gz and files.tar.gz



    if [ "$RESTORE_DB" = "true" ]; then
        echo "::group::Restore DB backup"

        echo "DB sql size uncompressed:"
        CMD_RESULTS=$(gzip -l db.sql.gz | tail -n 1)
        echo $CMD_RESULTS;


        echo "Space usage on db pod:"
        CMD_RESULTS=$(oc exec -n $NAMESPACE -c $DB_CONTAINER_NAME $DB_POD_NAME -- sh -c 'df -h /var/lib/mysql')
        echo "$CMD_RESULTS"
        
        
        #need to copy the file then do restore.
        #oc cp db.sql.gz -n $NAMESPACE -c $DB_CONTAINER_NAME $DB_POD_NAME:/tmp/db.sql.gz
        

        gunzip db.sql.gz
        
        echo "Performing actual db restore...please wait"

        CMD1_RESULTS=$(oc exec -i -n $NAMESPACE -c $DB_CONTAINER_NAME $DB_POD_NAME -- sh -c 'mariadb  -u root -p$(cat $MYSQL_ROOT_PASSWORD_FILE) -e "SELECT @@innodb_buffer_pool_size;" -N -s'  )
        echo "Current innodb_buffer_pool_size: $CMD1_RESULTS"

        ORIGINAL_INNODB_BUFFER_POOL_SIZE=$CMD1_RESULTS
        NEW_INNODB_BUFFER_POOL_SIZE=$(($ORIGINAL_INNODB_BUFFER_POOL_SIZE + 462144000))

        set +e
        #CMD1_RESULTS=$( (oc exec -n $NAMESPACE -c $DB_CONTAINER_NAME $DB_POD_NAME -- sh -c 'gunzip < /tmp/db.sql.gz | mariadb  -u root -p$(cat $MYSQL_ROOT_PASSWORD_FILE) $MYSQL_DATABASE' ) 2>&1)
        
        CMD1_RESULTS=$( (oc exec -i -n $NAMESPACE -c $DB_CONTAINER_NAME $DB_POD_NAME -- sh -c "mariadb  -u root -p$(cat $MYSQL_ROOT_PASSWORD_FILE) $MYSQL_DATABASE --init-command='SET GLOBAL innodb_flush_log_at_trx_commit=2; SET GLOBAL foreign_key_checks=0; SET GLOBAL unique_checks=0; SET GLOBAL autocommit=0; SET GLOBAL innodb_buffer_pool_size=$NEW_INNODB_BUFFER_POOL_SIZE;'" < db.sql ) 2>&1) #SET GLOBAL innodb_doublewrite=0; 
        CMD1_EXIT_CODE=$?
        set -e

        echo "Restoring database settings to default"
        oc exec -i -n $NAMESPACE -c $DB_CONTAINER_NAME $DB_POD_NAME -- sh -c 'mariadb  -u root -p$(cat $MYSQL_ROOT_PASSWORD_FILE) -e "SET GLOBAL innodb_flush_log_at_trx_commit=1; SET GLOBAL foreign_key_checks = 1; SET GLOBAL unique_checks = 1; COMMIT; SET GLOBAL innodb_buffer_pool_size=$ORIGINAL_INNODB_BUFFER_POOL_SIZE;"'

        echo "Retrieving post-restore innodb_buffer_pool_size"
        CMD1_RESULTS=$(oc exec -i -n $NAMESPACE -c $DB_CONTAINER_NAME $DB_POD_NAME -- sh -c 'mariadb  -u root -p$(cat $MYSQL_ROOT_PASSWORD_FILE) -e "SELECT @@innodb_buffer_pool_size;" -N -s'  )
        echo "Post-restore innodb_buffer_pool_size: $CMD1_RESULTS"

        #echo "Removing the /tmp/db.sql.gz file from the pod"
        #oc exec -n $NAMESPACE -c $DB_CONTAINER_NAME $DB_POD_NAME -- rm /tmp/db.sql.gz

        if [ $CMD1_EXIT_CODE -eq 0 ]; then
            echo "Success restoring database backup"
            echo "Code: $CMD1_EXIT_CODE"
            echo "$CMD1_RESULTS"

        else
            echo "Error restoring database backup:"
            echo "Code: $CMD1_EXIT_CODE"
            echo "$CMD1_RESULTS"

            if [[ "$S3_FILENAME" != *".problem"* ]]; then
                #update the filename of the backup to mark it as such
                echo "Renaming the backup file to mark it as problematic"
                rclone moveto :s3:$S3_BUCKET_NAME/oc-sites-bk/$S3_FILENAME :s3:$S3_BUCKET_NAME/oc-sites-bk/$S3_FILENAME.problem  --s3-provider Other --s3-access-key-id "$S3_AKI" --s3-secret-access-key "$S3_TOKEN" --s3-endpoint "$S3_ENDPOINT_URL" -P --stats-log-level NOTICE --stats 60s
            fi

            exit 99
        fi
        echo "::endgroup::"
    fi


    if [ "$RESTORE_FILES" = "true" ]; then
        echo "::group::Restore Files"

        echo "Files archive size uncompressed:"
        CMD_RESULTS=$(gzip -l files.tar.gz | tail -n 1)
        echo $CMD_RESULTS;

        echo "Space usage on wp pod:"
        CMD_RESULTS=$(oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- sh -c 'df -h /var/www/html/wp-content')
        echo "$CMD_RESULTS"

        #move the destination wp-content to wp-content-bk
        echo "Moving wp-content to wp-content-bk"
        oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- mkdir -p /var/www/html/wp-content-bk

        #only move the files if the folder has files
        set +e
        CMD1_RESULTS=$( (oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- sh -c 'ls /var/www/html/wp-content/*'))
        CMD1_EXIT_CODE=$?
        set -e

        if [ $CMD1_EXIT_CODE -eq 0 ]; then
            echo "Moved files"
            oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- sh -c 'mv /var/www/html/wp-content/* /var/www/html/wp-content-bk'
        fi
        

        #restore files. only wp-content
        echo "Restoring wp-content files from backup"
        mkdir extracted-files
        tar -xzf files.tar.gz -C extracted-files
        oc cp extracted-files/wp-content  -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME:/var/www/html

        echo "::endgroup::"
    fi



    echo "::group::Update WP Settings and Database"
    #update the url in the database content
    #get the siteurl of the backed up site
    CMD1_RESULTS=$( oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- php /tmp/wp-cli.phar option get siteurl )
    if [ -z "$CMD1_RESULTS" ]; then
        echo "::error::Unknown siteurl: ${CMD1_RESULTS}"

        exit 97
    fi 

    NEW_SITE_URL="https://$PROJECT_NAME-$SITE_NAME.apps.gold.devops.gov.bc.ca"

    echo "Changing database url from $CMD1_RESULTS to $NEW_SITE_URL"

    oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- php /tmp/wp-cli.phar search-replace "$CMD1_RESULTS" "$NEW_SITE_URL" --all-tables
    
    #Disable site indexing
    oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- php /tmp/wp-cli.phar option set blog_public 0

    #Update the site urls
    oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- php /tmp/wp-cli.phar option update siteurl "$NEW_SITE_URL"
    oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- php /tmp/wp-cli.phar option update home "$NEW_SITE_URL"
    
    echo "::endgroup::"


    #erase the old wp-content files
    echo "Removing wp-content-bk folder"
    oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- rm -rf /var/www/html/wp-content-bk


    echo "Restore backup finished"


    #Generate GH Actions summary
	echo "### Restored Backup" >> $GITHUB_STEP_SUMMARY
	echo "Environment: ${OC_ENV}" >> $GITHUB_STEP_SUMMARY
    echo "Project: ${PROJECT_NAME}" >> $GITHUB_STEP_SUMMARY
	echo "Site: ${OC_SITE_NAME}" >> $GITHUB_STEP_SUMMARY
    echo "Backup number: ${BACKUP_NUMBER}" >> $GITHUB_STEP_SUMMARY
	echo "" >> $GITHUB_STEP_SUMMARY # this is a blank line


else  
    echo "::error::Backup file not found!"

	#Generate GH Actions summary
	echo "### Restore Backup Error" >> $GITHUB_STEP_SUMMARY
	echo "Environment: ${OC_ENV}" >> $GITHUB_STEP_SUMMARY
    echo "Project: ${PROJECT_NAME}" >> $GITHUB_STEP_SUMMARY
	echo "Site: ${OC_SITE_NAME}" >> $GITHUB_STEP_SUMMARY
    echo "Backup number: ${BACKUP_NUMBER}" >> $GITHUB_STEP_SUMMARY
	echo "" >> $GITHUB_STEP_SUMMARY # this is a blank line
	
	exit 1
fi