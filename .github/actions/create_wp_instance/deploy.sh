#!/bin/bash

ENVIRONMENT=$1
SITE_NAME=$2
OPENSHIFT_SERVER=$3
DEV_TOKEN=$4
TEST_TOKEN=$5
PROD_TOKEN=$6

#NG. no longer grabbing the branch    -b digimod-deploy
git clone  https://github.com/bcgov/wordpress-deploy-digimod.git
      
#Log in to OpenShift
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


echo "::group::Login to OC"
oc login $OPENSHIFT_SERVER --token=$token --insecure-skip-tls-verify=true
echo "::endgroup::"

#Go into the deployment folder
cd wordpress-deploy-digimod

#Setup some variables
export NAMESPACE="c0cce6-$ENVIRONMENT"
export OC_ENV=$ENVIRONMENT
export OC_SITE_NAME=digital-$SITE_NAME

# Delete existing deployment, if it exists
echo "::group::Delete existing deployment"
export WORDPRESS_POD_NAME=$(oc get pods -n $NAMESPACE -l app=wordpress,role=wordpress-core,site=${OC_SITE_NAME} -o jsonpath='{.items[?(0)].metadata.name}')
WORDPRESS_CONTAINER_NAME=$(oc get pods -n $NAMESPACE $WORDPRESS_POD_NAME -o jsonpath='{.spec.containers[0].name}')
if [ -n "$WORDPRESS_CONTAINER_NAME" ]; then
    echo "Found existing site."
    chmod +x site-delete-unix.sh
    ./site-delete-unix.sh
else
    echo "Existing site not found, nothing to delete."
fi      
echo "::endgroup::"

# Create new WordPress instance
echo "::group::Create new deployment"
chmod +x site-builder-unix.sh
./site-builder-unix.sh
echo "::endgroup::"

# Wait for WordPress pod to be running

WORDPRESS_POD_NAME=$(oc get pods -n $NAMESPACE -l app=wordpress,role=wordpress-core,site=${OC_SITE_NAME} -o jsonpath='{.items[?(0)].metadata.name}')
oc wait --for=condition=Ready pod/$WORDPRESS_POD_NAME -n $NAMESPACE --timeout=5m
# Wait for the WordPress container to be created
WORDPRESS_CONTAINER_NAME=null;
while true; do
    WORDPRESS_CONTAINER_NAME=$(oc get pods -n $NAMESPACE $WORDPRESS_POD_NAME -o jsonpath='{.spec.containers[0].name}')
    if [ -n "$WORDPRESS_CONTAINER_NAME" ]; then
    break
    fi
    echo "Waiting for WordPress container to be created..."
    sleep 5
done
# Add an additional sleep to ensure the container is fully initialized
echo "Waiting for WordPress container to be fully initialized..."
sleep 15


# Install wordpress
echo "::group::Install wordpress"
# Download wp-cli in the GitHub Actions workspace
curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
chmod +x wp-cli.phar

# Copy wp-cli to the WordPress instance and install wordpress
oc cp --no-preserve wp-cli.phar $NAMESPACE/$WORDPRESS_POD_NAME:/tmp/wp-cli.phar -c $WORDPRESS_CONTAINER_NAME
oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- chmod +x /tmp/wp-cli.phar

#Perform a site install
WP_INSTALL_RESULTS=$(oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- php /tmp/wp-cli.phar core install --url=${OC_SITE_NAME}.apps.silver.devops.gov.bc.ca --admin_user=tester --admin_email=info@example.com  --title="${OC_SITE_NAME}.gov.bc.ca Testing Framework")
echo "WP Install Results: ${WP_INSTALL_RESULTS}"

#Disable site indexing
oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- php /tmp/wp-cli.phar option set blog_public 0
echo "::endgroup::"

#Generate GH Actions summary
echo "### Deployment:" >> $GITHUB_STEP_SUMMARY
echo "Deployment Environment: ${ENVIRONMENT}" >> $GITHUB_STEP_SUMMARY
echo "Site Name: ${SITE_NAME}"  >> $GITHUB_STEP_SUMMARY
echo "" >> $GITHUB_STEP_SUMMARY # this is a blank line

echo "### WP Install Results: " >> $GITHUB_STEP_SUMMARY
echo "" >> $GITHUB_STEP_SUMMARY # this is a blank line
echo "${WP_INSTALL_RESULTS}" >> $GITHUB_STEP_SUMMARY