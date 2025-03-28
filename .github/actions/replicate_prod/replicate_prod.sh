#!/bin/bash

#Make sure bash exits on any error so that the github action is marked as error
set -e

ENVIRONMENT=$1
SITE_NAME=$2
OPENSHIFT_SERVER=$3
DEV_TOKEN=$4
TEST_TOKEN=$5
PROD_TOKEN=$6

# Log in to OpenShift
echo "::group::Login to Production OC"
oc login $OPENSHIFT_SERVER --token=$PROD_TOKEN              #--insecure-skip-tls-verify=true
echo "::endgroup::"

# Export site from production
NAMESPACE="c0cce6-prod"
OC_ENV=prod
OC_SITE_NAME=digital
WORDPRESS_POD_NAME=$(oc get pods -n $NAMESPACE -l app=wordpress,role=wordpress-core,site=${OC_SITE_NAME} -o jsonpath='{.items[0].metadata.name}')
WORDPRESS_CONTAINER_NAME=$(oc get pods -n $NAMESPACE $WORDPRESS_POD_NAME -o jsonpath='{.spec.containers[0].name}')
if [ -n "$WORDPRESS_CONTAINER_NAME" ]; then
    echo "::group::Export Production Site"

    # Download wp-cli in the GitHub Actions workspace
    echo "Getting and copying WP CLI phar"
    curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar --fail
    chmod +x wp-cli.phar

    # Copy wp-cli to the WordPress instance 
    oc cp --no-preserve wp-cli.phar $NAMESPACE/$WORDPRESS_POD_NAME:/tmp/wp-cli.phar -c $WORDPRESS_CONTAINER_NAME
    oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- chmod +x /tmp/wp-cli.phar
    # perform the backup

    echo "Running backup on prod..."
    oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- php /tmp/wp-cli.phar ai1wm backup

    echo "- Grabbing backup file"
    LATEST_FILE=$(oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- bash -c 'ls -t /var/www/html/wp-content/ai1wm-backups | head -n 1 ')
    REMOTE_MD5=($(oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- md5sum /var/www/html/wp-content/ai1wm-backups/$LATEST_FILE))
    echo "-- MD5 of remote backup file: $REMOTE_MD5"
    
    oc cp -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME:/var/www/html/wp-content/ai1wm-backups/$LATEST_FILE ./wp-backup.wpress --retries=5    #attempt to prevent the EOF error when copying the large backup by using retries option
    echo "- Grabbed backup file $LATEST_FILE"

    LOCAL_MD5=($(md5sum ./wp-backup.wpress))
    echo "-- MD5 of copied backup file: $LOCAL_MD5"

    echo "- Grabbing AIOWPMigration plugins"
    oc cp -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME:/var/www/html/wp-content/plugins/all-in-one-wp-migration ./plugins/all-in-one-wp-migration
    oc cp -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME:/var/www/html/wp-content/plugins/all-in-one-wp-migration-unlimited-extension ./plugins/all-in-one-wp-migration-unlimited-extension

    echo "- Grabbing list of enabled plugins"
    active_plugins=$(oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- php /tmp/wp-cli.phar plugin list --status=active --field=name)
    # log out of prod due to paranoia
    
    echo "Backup on prod finished"
    echo "::endgroup::"

    oc logout
    

    # Log in to OpenShift
    case "$ENVIRONMENT" in
        "dev")
        token=$DEV_TOKEN
        OC_SITE_NAME=digital-$SITE_NAME
        ;;
        "test")
        token=$TEST_TOKEN
        OC_SITE_NAME=digital-$SITE_NAME
        ;;
        "prod")
        token=$PROD_TOKEN
        #echo "Cant replicate prod to prod!"
        #exit 1
        ;;
        *)
        echo "Unknown environment: $ENVIRONMENT"
        exit 1
        ;;
    esac

    #dont allow live site to live site. do allow prod digital to prod backup.
    if [[ "$ENVIRONMENT" == "prod" ]]; then 
        if [[ "$OC_SITE_NAME" == "digital" ]]; then 
            echo "::error::Cant replicate to environment: production, site: digital!"
            exit 1
        fi
    fi 

    OC_ENV=$ENVIRONMENT
    echo "Deploying to the site $OC_SITE_NAME in $OC_ENV"

    echo "::group::Login to target OC"
    oc login $OPENSHIFT_SERVER --token=$token               #--insecure-skip-tls-verify=true
    echo "::endgroup::"

    
    NAMESPACE="c0cce6-$ENVIRONMENT"
    WORDPRESS_POD_NAME=$(oc get pods -n $NAMESPACE -l app=wordpress,role=wordpress-core,site=${OC_SITE_NAME} -o jsonpath='{.items[0].metadata.name}')
    WORDPRESS_CONTAINER_NAME=$(oc get pods -n $NAMESPACE $WORDPRESS_POD_NAME -o jsonpath='{.spec.containers[0].name}')

    if [ -z "$WORDPRESS_CONTAINER_NAME" ]; then
        echo "::error::Unknown site name: ${SITE_NAME}"
        exit 1
    fi 

    # Import site
    echo "::group::Import WP Site"

    # Download wp-cli in the GitHub Actions workspace
    echo "Getting and copying WP CLI phar"

    #Its already grabbed above, no need to re-grab.
    #curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar --fail
    #chmod +x wp-cli.phar

    # Copy wp-cli to the WordPress instance and install wordpress
    oc cp --no-preserve wp-cli.phar $NAMESPACE/$WORDPRESS_POD_NAME:/tmp/wp-cli.phar -c $WORDPRESS_CONTAINER_NAME
    oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- chmod +x /tmp/wp-cli.phar

    # Copy over import plugins
    echo "Copying over import plugins"
    oc cp --no-preserve ./plugins/all-in-one-wp-migration -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME:/var/www/html/wp-content/plugins
    oc cp --no-preserve ./plugins/all-in-one-wp-migration-unlimited-extension -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME:/var/www/html/wp-content/plugins
    oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- php /tmp/wp-cli.phar plugin activate all-in-one-wp-migration all-in-one-wp-migration-unlimited-extension

    # Copy over backup file
    echo "Uploading backup file"
    oc cp --no-preserve ./wp-backup.wpress -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME:/var/www/html/wp-content/ai1wm-backups/wp-backup.wpress --retries=5    #attempt to prevent the EOF error when copying the large backup by using retries option


    #perform the restore. Check for failure, and run again if failed.
    echo "Running restore"
    ret=0
    oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- bash -c "echo 'y' | php /tmp/wp-cli.phar ai1wm restore wp-backup.wpress" || ret=$?
    if [ $ret -eq 0 ]; then
        # The command was successful
        echo '- Restore command ran successfully'

    else
        # The command was not successful
        echo "Restore command failed, trying one more time..."

        #need to re-activate the plugins first
        oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- php /tmp/wp-cli.phar plugin activate all-in-one-wp-migration all-in-one-wp-migration-unlimited-extension

        oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- bash -c "echo 'y' | php /tmp/wp-cli.phar ai1wm restore wp-backup.wpress"
    fi


    #activate the plugins
    # oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- php /tmp/wp-cli.phar plugin activate $active_plugins

    #Disable site indexing
    oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- php /tmp/wp-cli.phar option set blog_public 0

    echo "::endgroup::"

    echo "Replicate production finished"

    #Generate GH Actions summary
    echo "### Replicated Production" >> $GITHUB_STEP_SUMMARY
    echo "Environment: ${OC_ENV}" >> $GITHUB_STEP_SUMMARY
    echo "Site: ${OC_SITE_NAME}" >> $GITHUB_STEP_SUMMARY
    echo "" >> $GITHUB_STEP_SUMMARY # this is a blank line


else
    echo "::error::Unable to find production"
    echo "Pod Name: $WORDPRESS_POD_NAME"
    echo "Container Name: $WORDPRESS_CONTAINER_NAME"


    echo "### Replicate Production Error " >> $GITHUB_STEP_SUMMARY
    echo "Environment: ${OC_ENV}" >> $GITHUB_STEP_SUMMARY
    echo "Site: ${OC_SITE_NAME}" >> $GITHUB_STEP_SUMMARY
    echo "" >> $GITHUB_STEP_SUMMARY # this is a blank line
    echo "Pod Name: $WORDPRESS_POD_NAME" >> $GITHUB_STEP_SUMMARY
    echo "Container Name: $WORDPRESS_CONTAINER_NAME" >> $GITHUB_STEP_SUMMARY
    echo "" >> $GITHUB_STEP_SUMMARY # this is a blank line
    echo "" >> $GITHUB_STEP_SUMMARY # this is a blank line
    echo "Unable to find production" >> $GITHUB_STEP_SUMMARY

fi