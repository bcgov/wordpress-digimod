#!/bin/bash

ENVIRONMENT=$1
SITE_NAME=$2
OPENSHIFT_SERVER=$3
DEV_TOKEN=$4
TEST_TOKEN=$5
PROD_TOKEN=$6
KEYCLOAK_TEST_CLIENT_SECRET=$7

echo "Deploying to $ENVIRONMENT"
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
    OC_SITE_NAME=digital
    # echo "For safety reasons, we won't run this action on prod!"
    # exit 1
    ;;
    *)
    echo "Unknown environment: $ENVIRONMENT"
    exit 1
    ;;
esac
oc login $OPENSHIFT_SERVER --token=$token --insecure-skip-tls-verify=true

# Deploy plugins
NAMESPACE="c0cce6-$ENVIRONMENT"
OC_SITE_NAME=digital-$SITE_NAME
WORDPRESS_POD_NAME=$(oc get pods -n $NAMESPACE -l  app=wordpress,role=wordpress-core,site=${OC_SITE_NAME} -o jsonpath='{.items[0].metadata.name}')
WORDPRESS_CONTAINER_NAME=$(oc get pods -n $NAMESPACE $WORDPRESS_POD_NAME -o jsonpath='{.spec.containers[0].name}')

# Save the directories to be archived
dirs_to_archive=()
for d in */ ; do
    dir=${d%?}  # Remove trailing slash
    if [[ $dir != ".github" && $dir != "node_modules" && $dir != "Archive" && $dir != "bcgov-wordpress-block-theme-digimod"  && $dir != "testing" ]]; then
        dirs_to_archive+=($dir)
    fi
done

# Delete the directories in the target location
for dir in "${dirs_to_archive[@]}"; do
    oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- rm -rf /var/www/html/wp-content/plugins/$dir
done

tar -cf plugins.tar --exclude=./.github --exclude=node_modules --exclude=./Archive --exclude=./testing --exclude=./bcgov-wordpress-block-theme-digimod ./*/
oc cp --no-preserve plugins.tar $NAMESPACE/$WORDPRESS_POD_NAME:/var/www/html/wp-content/plugins/plugins.tar -c $WORDPRESS_CONTAINER_NAME
oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- tar -xf /var/www/html/wp-content/plugins/plugins.tar -C /var/www/html/wp-content/plugins
# We won't activate any plugins - this can be done manually
#oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- php /tmp/wp-cli.phar plugin activate --all