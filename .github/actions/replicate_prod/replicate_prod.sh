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
oc login $OPENSHIFT_SERVER --token=$PROD_TOKEN --insecure-skip-tls-verify=true
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
    curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
    chmod +x wp-cli.phar
    # Copy wp-cli to the WordPress instance and install wordpress
    oc cp --no-preserve wp-cli.phar $NAMESPACE/$WORDPRESS_POD_NAME:/tmp/wp-cli.phar -c $WORDPRESS_CONTAINER_NAME
    oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- chmod +x /tmp/wp-cli.phar
    # perform the backup

    echo "Running backup on prod.."

    oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- php /tmp/wp-cli.phar ai1wm backup
    LATEST_FILE=$(oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- bash -c 'ls -t /var/www/html/wp-content/ai1wm-backups | head -n 1 ')
    oc cp -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME:/var/www/html/wp-content/ai1wm-backups/$LATEST_FILE ./wp-backup.wpress
    oc cp -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME:/var/www/html/wp-content/plugins/all-in-one-wp-migration ./plugins/all-in-one-wp-migration
    oc cp -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME:/var/www/html/wp-content/plugins/all-in-one-wp-migration-unlimited-extension ./plugins/all-in-one-wp-migration-unlimited-extension

    active_plugins=$(oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- php /tmp/wp-cli.phar plugin list --status=active --field=name)
    # log out of prod due to paranoia
    
    echo "Backup on prod finished"
    echo "::endgroup::"

    oc logout
    

    # Log in to OpenShift
    echo "Deploying to $ENVIRONMENT"
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

    echo "::group::Login to target OC"
    oc login $OPENSHIFT_SERVER --token=$token --insecure-skip-tls-verify=true
    echo "::endgroup::"

    
    
    NAMESPACE="c0cce6-$ENVIRONMENT"
    OC_ENV=$ENVIRONMENT
    OC_SITE_NAME=digital-$SITE_NAME
    WORDPRESS_POD_NAME=$(oc get pods -n $NAMESPACE -l app=wordpress,role=wordpress-core,site=${OC_SITE_NAME} -o jsonpath='{.items[0].metadata.name}')
    WORDPRESS_CONTAINER_NAME=$(oc get pods -n $NAMESPACE $WORDPRESS_POD_NAME -o jsonpath='{.spec.containers[0].name}')

    if [ -z "$WORDPRESS_CONTAINER_NAME" ]; then
        echo "Error: Unknown site name: ${SITE_NAME}"
        exit 1
    fi 

    # Import site
    echo "::group::Import WP Site"

    # Copy over import plugins
    echo "Copying over import plugins"
    oc cp --no-preserve ./plugins/all-in-one-wp-migration -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME:/var/www/html/wp-content/plugins/all-in-one-wp-migration
    oc cp --no-preserve ./plugins/all-in-one-wp-migration-unlimited-extension -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME:/var/www/html/wp-content/plugins/all-in-one-wp-migration-unlimited-extension
    oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- php /tmp/wp-cli.phar plugin activate all-in-one-wp-migration all-in-one-wp-migration-unlimited-extension

    # Download wp-cli in the GitHub Actions workspace
    curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
    chmod +x wp-cli.phar

    # Copy wp-cli to the WordPress instance and install wordpress
    oc cp --no-preserve wp-cli.phar $NAMESPACE/$WORDPRESS_POD_NAME:/tmp/wp-cli.phar -c $WORDPRESS_CONTAINER_NAME
    oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- chmod +x /tmp/wp-cli.phar

    # Copy over backup file
    echo "Uploading backup file"
    oc cp --no-preserve ./wp-backup.wpress -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME:/var/www/html/wp-content/ai1wm-backups/wp-backup.wpress

    #perform the restore
    echo "Running restore"
    oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- bash -c "echo 'y' | php /tmp/wp-cli.phar ai1wm restore wp-backup.wpress"

    #activate the plugins
    # oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- php /tmp/wp-cli.phar plugin activate $active_plugins

    #Disable site indexing
    oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- php /tmp/wp-cli.phar option set blog_public 0

    echo "::endgroup::"

    echo "Replicate production finished"

else
    echo "Unable to find production"
    echo "Pod Name: $WORDPRESS_POD_NAME"
    echo "Container Name: $WORDPRESS_CONTAINER_NAME"

fi