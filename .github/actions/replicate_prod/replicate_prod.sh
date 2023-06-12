#!/bin/bash

ENVIRONMENT=$1
SITE_NAME=$2
OPENSHIFT_SERVER=$3
DEV_TOKEN=$4
TEST_TOKEN=$5
PROD_TOKEN=$6
# Log in to OpenShift
oc login $INPUT_OPENSHIFT_SERVER --token=$INPUT_PROD_TOKEN --insecure-skip-tls-verify=true

# Export site from production
NAMESPACE="c0cce6-prod"
OC_ENV=prod
OC_SITE_NAME=digital-wp
WORDPRESS_POD_NAME=$(oc get pods -n $NAMESPACE -l app=wordpress,role=nginx,site=${OC_SITE_NAME} -o jsonpath='{.items[0].metadata.name}')
WORDPRESS_CONTAINER_NAME=$(oc get pods -n $NAMESPACE $WORDPRESS_POD_NAME -o jsonpath='{.spec.containers[0].name}')
# Download wp-cli in the GitHub Actions workspace
curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
chmod +x wp-cli.phar
# Copy wp-cli to the WordPress instance and install wordpress
oc cp --no-preserve wp-cli.phar $NAMESPACE/$WORDPRESS_POD_NAME:/tmp/wp-cli.phar -c $WORDPRESS_CONTAINER_NAME
oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- chmod +x /tmp/wp-cli.phar
# perform the backup
oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- php /tmp/wp-cli.phar ai1wm backup
LATEST_FILE=$(oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- bash -c 'ls -t /var/www/html/wp-content/ai1wm-backups | head -n 1 ')
oc cp -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME:/var/www/html/wp-content/ai1wm-backups/$LATEST_FILE ./wp-backup.wpress
oc cp -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME:/var/www/html/wp-content/plugins/all-in-one-wp-migration ./plugins/all-in-one-wp-migration
oc cp -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME:/var/www/html/wp-content/plugins/all-in-one-wp-migration-unlimited-extension ./plugins/all-in-one-wp-migration-unlimited-extension

active_plugins=$(oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- php /tmp/wp-cli.phar plugin list --status=active --field=name)
# log out of prod due to paranoia
oc logout

# Log in to OpenShift
echo "Deploying to $INPUT_ENVIRONMENT"
case "$INPUT_ENVIRONMENT" in
    "dev")
    token=$INPUT_DEV_TOKEN
    ;;
    "test")
    token=$INPUT_TEST_TOKEN
    ;;
    "prod")
    # token=$INPUT_PROD_TOKEN
    echo "For safety reasons, we won't run this action on prod!"
    exit 1
    ;;
    *)
    echo "Unknown environment: $INPUT_ENVIRONMENT"
    exit 1
    ;;
esac
oc login $INPUT_OPENSHIFT_SERVER --token=$token --insecure-skip-tls-verify=true
# Import site
NAMESPACE="c0cce6-$INPUT_ENVIRONMENT"
OC_ENV=$INPUT_ENVIRONMENT
OC_SITE_NAME=digital-$INPUT_SITE_NAME
WORDPRESS_POD_NAME=$(oc get pods -n $NAMESPACE -l app=wordpress,role=wordpress-core,site=${OC_SITE_NAME} -o jsonpath='{.items[0].metadata.name}')
WORDPRESS_CONTAINER_NAME=$(oc get pods -n $NAMESPACE $WORDPRESS_POD_NAME -o jsonpath='{.spec.containers[0].name}')

# Copy over import plugins
oc cp --no-preserve ./plugins/all-in-one-wp-migration -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME:/var/www/html/wp-content/plugins/all-in-one-wp-migration
oc cp --no-preserve ./plugins/all-in-one-wp-migration-unlimited-extension -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME:/var/www/html/wp-content/plugins/all-in-one-wp-migration-unlimited-extension

#activate the plugins
oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- php /tmp/wp-cli.phar plugin activate active_plugins

# Copy over backup file
oc cp --no-preserve ./wp-backup.wpress -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME:/var/www/html/wp-content/ai1wm-backups/wp-backup.wpress

#perform the restore
oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- bash -c "echo 'y' | php /tmp/wp-cli.phar ai1wm restore wp-backup.wpress"