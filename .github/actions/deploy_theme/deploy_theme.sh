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

case "$ENVIRONMENT" in
    "dev")
    token=$DEV_TOKEN
    OC_SITE_NAME=$PROJECT_NAME-$SITE_NAME
    ;;
    "test")
    token=$TEST_TOKEN
    OC_SITE_NAME=$PROJECT_NAME-$SITE_NAME
    ;;
    "prod")
    token=$PROD_TOKEN
    OC_SITE_NAME=$PROJECT_NAME
    ;;
    *)
    echo "Unknown environment: $ENVIRONMENT"
    exit 1
    ;;
esac

OC_ENV=$ENVIRONMENT

echo "Deploying to the site $OC_SITE_NAME in $OC_ENV"

oc login $OPENSHIFT_SERVER --token=$token                   #--insecure-skip-tls-verify=true

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
set +e
EXISTING_VER_RESULTS=$(oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- php /tmp/wp-cli.phar theme get $THEME_NAME --field=version 2>&1)
EXISTING_VER_RESULTS_EXIT_CODE=$?
set -e
if [ $EXISTING_VER_RESULTS_EXIT_CODE -eq 0 ]; then
    echo "${EXISTING_VER_RESULTS}"

else
    EXISTING_VER_RESULTS="Block-theme not found"
    echo "Block-theme not found"

    echo "::warning::Block-theme not found"
fi

cd bcgov-wordpress-block-theme-digimod

#Satis is no longer available from GH action workers. /dist folder is commited when changes are made, should not need to build theme.
#composer update
#composer install

#Tar up the theme as it exists in the runner from the cloned repo
tar -cf theme.tar --exclude .github --exclude .git --exclude-vcs ./

#copy up the theme and extract it to _tmp folder
oc cp --no-preserve theme.tar $NAMESPACE/$WORDPRESS_POD_NAME:/var/www/html/wp-content/themes/theme.tar -c $WORDPRESS_CONTAINER_NAME
oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- mkdir -p /var/www/html/wp-content/themes/${THEME_NAME}_tmp
oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- tar -xmf /var/www/html/wp-content/themes/theme.tar -C /var/www/html/wp-content/themes/${THEME_NAME}_tmp

#remove any old backup if it exists
oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- rm -rf /var/www/html/wp-content/themes/${THEME_NAME}_bak

#if theme exists, move it to the _bak folder
if [ $EXISTING_VER_RESULTS_EXIT_CODE -eq 0 ]; then
oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- mv /var/www/html/wp-content/themes/$THEME_NAME /var/www/html/wp-content/themes/${THEME_NAME}_bak
fi

#move the new theme into the final folder name, and remove the tar archive
oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- mv /var/www/html/wp-content/themes/${THEME_NAME}_tmp /var/www/html/wp-content/themes/${THEME_NAME}
oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- rm -rf /var/www/html/wp-content/themes/theme.tar


#oc cp --no-preserve . $NAMESPACE/$WORDPRESS_POD_NAME:/var/www/html/wp-content/themes/$THEME_NAME -c $WORDPRESS_CONTAINER_NAME
oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- php /tmp/wp-cli.phar theme activate $THEME_NAME --allow-root


echo "Newly installed theme version:"
NEW_VER_RESULTS=$(oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- php /tmp/wp-cli.phar theme get $THEME_NAME --field=version)
echo "${NEW_VER_RESULTS}"


#Perform the clear
echo "Clearing W3TC Cache"
set +e
W3TC_VERSION=$(oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- php /tmp/wp-cli.phar plugin get w3-total-cache --field=version 2>&1)
W3TC_VERSION_EXIT_CODE=$?
set -e
if [ $W3TC_VERSION_EXIT_CODE -eq 0 ]; then		
    oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- php /tmp/wp-cli.phar w3-total-cache flush all

else
    echo "W3TC Not installed"

    echo "::warning::W3TC Not installed"
fi

#Generate GH Actions summary
echo "### Deployed Block-theme" >> $GITHUB_STEP_SUMMARY
echo "Environment: ${OC_ENV}" >> $GITHUB_STEP_SUMMARY
echo "Project: ${PROJECT_NAME}" >> $GITHUB_STEP_SUMMARY
echo "Site: ${OC_SITE_NAME}" >> $GITHUB_STEP_SUMMARY
echo "" >> $GITHUB_STEP_SUMMARY # this is a blank line
echo "" >> $GITHUB_STEP_SUMMARY # this is a blank line


echo "Existing Installed version: ${EXISTING_VER_RESULTS}" >> $GITHUB_STEP_SUMMARY
echo "Newly Installed version: ${NEW_VER_RESULTS}" >> $GITHUB_STEP_SUMMARY