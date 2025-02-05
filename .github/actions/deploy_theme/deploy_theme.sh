#!/bin/bash

#Make sure bash exits on any error so that the github action is marked as error
set -e

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

# Download wp-cli in the GitHub Actions workspace
curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
chmod +x wp-cli.phar
# Copy wp-cli to the WordPress instance and install wordpress
oc cp --no-preserve wp-cli.phar $NAMESPACE/$WORDPRESS_POD_NAME:/tmp/wp-cli.phar -c $WORDPRESS_CONTAINER_NAME
oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- chmod +x /tmp/wp-cli.phar
        
#Get installed version
echo "Existing installed theme version:"
oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- php /tmp/wp-cli.phar theme get $THEME_NAME --field=version


cd bcgov-wordpress-block-theme-digimod

#Satis is no longer available from GH action workers. /dist folder is commited when changes are made, should not need to build theme.
#composer update
#composer install

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


echo "Newly installed theme version:"
oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- php /tmp/wp-cli.phar theme get $THEME_NAME --field=version


echo "Clearing W3TC Cache"
#Perform the clear
oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- php /tmp/wp-cli.phar w3-total-cache flush all