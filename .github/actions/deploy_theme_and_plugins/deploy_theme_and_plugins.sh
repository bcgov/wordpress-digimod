#!/bin/bash

ENVIRONMENT=$1
SITE_NAME=$2
OPENSHIFT_SERVER=$3
DEV_TOKEN=$4
TEST_TOKEN=$5
PROD_TOKEN=$6

echo "Deploying to $ENVIRONMENT"
case "$ENVIRONMENT" in
    "dev")
    token=$DEV_TOKEN
    ;;
    "test")
    token=$TEST_TOKEN
    ;;
    "prod")
    # token=$PROD_TOKEN
    echo "For safety reasons, we won't run this action on prod!"
    exit 1
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
OC_SITE_NAME=digital-$SITE_NAME
WORDPRESS_POD_NAME=$(oc get pods -n $NAMESPACE -l  app=wordpress,role=wordpress-core,site=${OC_SITE_NAME} -o jsonpath='{.items[0].metadata.name}')
WORDPRESS_CONTAINER_NAME=$(oc get pods -n $NAMESPACE $WORDPRESS_POD_NAME -o jsonpath='{.spec.containers[0].name}')
DATE=$(date +%Y-%m-%d-%H-%M)
cd bcgov-wordpress-block-theme-digimod
composer install
# Check if the theme folder exists and rename it to create a backup
# Download wp-cli in the GitHub Actions workspace
# curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
# chmod +x wp-cli.phar
# # Copy wp-cli to the WordPress instance and install wordpress
# oc cp --no-preserve wp-cli.phar $NAMESPACE/$WORDPRESS_POD_NAME:/tmp/wp-cli.phar -c $WORDPRESS_CONTAINER_NAME
# oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- chmod +x /tmp/wp-cli.phar 
#oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- php /tmp/wp-cli.phar core install --url=${OC_SITE_NAME}.apps.silver.devops.gov.bc.ca --title="digital.gov.bc.ca Testing Framework" --admin_user=tester --admin_password=tester --admin_email=info@example.com

tar -cf theme.tar --exclude=./github ./
oc cp --no-preserve theme.tar $NAMESPACE/$WORDPRESS_POD_NAME:/var/www/html/wp-content/themes/theme.tar -c $WORDPRESS_CONTAINER_NAME
oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- mv /var/www/html/wp-content/themes/$THEME_NAME /var/www/html/wp-content/themes/${THEME_NAME}_bak
oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- mkdir /var/www/html/wp-content/themes/$THEME_NAME
oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- tar -xmf /var/www/html/wp-content/themes/theme.tar -C /var/www/html/wp-content/themes/$THEME_NAME
#oc cp --no-preserve . $NAMESPACE/$WORDPRESS_POD_NAME:/var/www/html/wp-content/themes/$THEME_NAME -c $WORDPRESS_CONTAINER_NAME
oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- php /tmp/wp-cli.phar theme activate $THEME_NAME --allow-root

# Deploy plugins
NAMESPACE="c0cce6-$ENVIRONMENT"
OC_SITE_NAME=digital-$SITE_NAME
WORDPRESS_POD_NAME=$(oc get pods -n $NAMESPACE -l  app=wordpress,role=wordpress-core,site=${OC_SITE_NAME} -o jsonpath='{.items[0].metadata.name}')
WORDPRESS_CONTAINER_NAME=$(oc get pods -n $NAMESPACE $WORDPRESS_POD_NAME -o jsonpath='{.spec.containers[0].name}')
tar -cf plugins.tar --exclude=./.github --exclude=node_modules --exclude=./Archive --exclude=./bcgov-wordpress-block-theme-digimod ./*/
oc cp --no-preserve plugins.tar $NAMESPACE/$WORDPRESS_POD_NAME:/var/www/html/wp-content/plugins/plugins.tar -c $WORDPRESS_CONTAINER_NAME
oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- tar -xf /var/www/html/wp-content/plugins/plugins.tar -C /var/www/html/wp-content/plugins
oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- php /tmp/wp-cli.phar plugin activate --all
# for dir in `ls -d */`; do
#   if [[ $dir != git* ]]; then
#       oc cp --no-preserve . $NAMESPACE/$WORDPRESS_POD_NAME:/var/www/html/wp-content/plugins/$dir -c $WORDPRESS_CONTAINER_NAME
#   fi
# done 