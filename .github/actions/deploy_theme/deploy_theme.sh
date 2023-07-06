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
    ;;
    *)
    echo "Unknown environment: $ENVIRONMENT"
    exit 1
    ;;
esac
oc login $OPENSHIFT_SERVER --token=$token --insecure-skip-tls-verify=true

# Deploy theme
THEME_NAME="bcgov-wordpress-block-theme"
NAMESPACE="c0cce6-$ENVIRONMENT"
WORDPRESS_POD_NAME=$(oc get pods -n $NAMESPACE -l  app=wordpress,role=wordpress-core,site=${OC_SITE_NAME} -o jsonpath='{.items[0].metadata.name}')
WORDPRESS_CONTAINER_NAME=$(oc get pods -n $NAMESPACE $WORDPRESS_POD_NAME -o jsonpath='{.spec.containers[0].name}')
DATE=$(date +%Y-%m-%d-%H-%M)
cd bcgov-wordpress-block-theme-digimod
composer update
composer install

tar -cf theme.tar --exclude=./github ./
oc cp --no-preserve theme.tar $NAMESPACE/$WORDPRESS_POD_NAME:/var/www/html/wp-content/themes/theme.tar -c $WORDPRESS_CONTAINER_NAME
oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- mkdir -p /var/www/html/wp-content/themes/${THEME_NAME}_tmp
oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- tar -xmf /var/www/html/wp-content/themes/theme.tar -C /var/www/html/wp-content/themes/${THEME_NAME}_tmp

oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- rm -rf /var/www/html/wp-content/themes/${THEME_NAME}_bak
oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- mv /var/www/html/wp-content/themes/$THEME_NAME /var/www/html/wp-content/themes/${THEME_NAME}_bak
oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- mv /var/www/html/wp-content/themes/${THEME_NAME}_tmp /var/www/html/wp-content/themes/${THEME_NAME}
oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- rm -rf /var/www/html/wp-content/themes/theme.tar


#oc cp --no-preserve . $NAMESPACE/$WORDPRESS_POD_NAME:/var/www/html/wp-content/themes/$THEME_NAME -c $WORDPRESS_CONTAINER_NAME
oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- php /tmp/wp-cli.phar theme activate $THEME_NAME --allow-root