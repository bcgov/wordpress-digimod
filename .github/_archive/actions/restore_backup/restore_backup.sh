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

# Log in to OpenShift
echo "::group::Login to Production OC"
oc login $OPENSHIFT_SERVER --token=$PROD_TOKEN              #--insecure-skip-tls-verify=true
echo "::endgroup::"

# Export backup file from backup
NAMESPACE="c0cce6-prod"
OC_ENV=prod
OC_SITE_NAME=$PROJECT_NAME-backup
WORDPRESS_POD_NAME=$(oc get pods -n $NAMESPACE -l app=wordpress,role=wordpress-core,site=${OC_SITE_NAME} -o jsonpath='{.items[0].metadata.name}')
WORDPRESS_CONTAINER_NAME=$(oc get pods -n $NAMESPACE $WORDPRESS_POD_NAME -o jsonpath='{.spec.containers[0].name}')
if [ -n "$WORDPRESS_CONTAINER_NAME" ]; then
    echo "::group::Export Backup File From Backup Site"

    # Download wp-cli in the GitHub Actions workspace
    echo "Getting and copying WP CLI phar"
    curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
    chmod +x wp-cli.phar

    # Copy wp-cli to the WordPress instance and install wordpress
    oc cp --no-preserve wp-cli.phar $NAMESPACE/$WORDPRESS_POD_NAME:/tmp/wp-cli.phar -c $WORDPRESS_CONTAINER_NAME
    oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- chmod +x /tmp/wp-cli.phar

    # perform the copy of the backup file
    echo "Copying of backup file from backup site..."

    # oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- php /tmp/wp-cli.phar ai1wm backup
    LATEST_FILE=$(oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- bash -c 'ls -t /var/www/html/wp-content/ai1wm-backups-history | sed -n '"$BACKUP_NUMBER"'p')
    
    if [ -z "$LATEST_FILE" ]; then
        echo "::error::Missing backup file. Backup number $BACKUP_NUMBER not found."

        exit 1
    fi

    echo "Will restore from $LATEST_FILE"
    echo "Downloading restore file..."
    oc cp -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME:/var/www/html/wp-content/ai1wm-backups-history/$LATEST_FILE ./wp-backup.wpress
    oc cp -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME:/var/www/html/wp-content/plugins/all-in-one-wp-migration ./plugins/all-in-one-wp-migration
    oc cp -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME:/var/www/html/wp-content/plugins/all-in-one-wp-migration-unlimited-extension ./plugins/all-in-one-wp-migration-unlimited-extension

    active_plugins=$(oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- php /tmp/wp-cli.phar plugin list --status=active --field=name)
    
    echo "Copy of backup file finished"
    echo "::endgroup::"

    # log out of prod due to paranoia
    oc logout

    

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
    oc login $OPENSHIFT_SERVER --token=$token                   #--insecure-skip-tls-verify=true
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
    curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
    chmod +x wp-cli.phar

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
    oc cp --no-preserve ./wp-backup.wpress -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME:/var/www/html/wp-content/ai1wm-backups/wp-backup.wpress

    #perform the restore
    echo "Running restore"
    echo " Namespace: ${NAMESPACE}"
    echo " Container Name: ${WORDPRESS_CONTAINER_NAME}"
    echo " Pod Name: ${WORDPRESS_POD_NAME}"
    
    oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- bash -c "echo 'y' | php /tmp/wp-cli.phar ai1wm restore wp-backup.wpress"

    #activate the plugins
    # oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- php /tmp/wp-cli.phar plugin activate $active_plugins

    #Disable site indexing
    oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- php /tmp/wp-cli.phar option set blog_public 0

    echo "::endgroup::"

    echo "Replicate backup finished"


    #Generate GH Actions summary
	echo "### Restored Backup" >> $GITHUB_STEP_SUMMARY
	echo "Environment: ${OC_ENV}" >> $GITHUB_STEP_SUMMARY
    echo "Project: ${PROJECT_NAME}" >> $GITHUB_STEP_SUMMARY
	echo "Site: ${OC_SITE_NAME}" >> $GITHUB_STEP_SUMMARY
    echo "Backup number: ${BACKUP_NUMBER}" >> $GITHUB_STEP_SUMMARY
	echo "" >> $GITHUB_STEP_SUMMARY # this is a blank line


else  
    echo "::error::Backup site not found!"

	#Generate GH Actions summary
	echo "### Restore Backup Error" >> $GITHUB_STEP_SUMMARY
	echo "Environment: ${OC_ENV}" >> $GITHUB_STEP_SUMMARY
    echo "Project: ${PROJECT_NAME}" >> $GITHUB_STEP_SUMMARY
	echo "Site: ${OC_SITE_NAME}" >> $GITHUB_STEP_SUMMARY
    echo "Backup number: ${BACKUP_NUMBER}" >> $GITHUB_STEP_SUMMARY
	echo "" >> $GITHUB_STEP_SUMMARY # this is a blank line
	
	exit 1
fi