#!/bin/bash

#Make sure bash exits on any error so that the github action is marked as error
set -e

ENVIRONMENT=$1
export PROJECT_NAME=$2
export SITE_NAME=$3
OPENSHIFT_SERVER=$4
DEV_TOKEN=$5
TEST_TOKEN=$6
PROD_TOKEN=$7
OC_NAMEPLATE=$8
OC_TIER=$9

if [ "$OC_NAMEPLATE" == "c0cce6" ]; then
    #NG. no longer grabbing the branch    -b digimod-deploy
    git clone  https://github.com/bcgov/wordpress-deploy-digimod.git
else
    git clone  https://github.com/bcgov/wordpress-deploy-cleanbcdx.git
fi


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
    token=$PROD_TOKEN
    #todo re-disable
    #echo "For safety reasons, we won't run this action on prod!"
    #exit 1
    ;;
    *)
    echo "Unknown environment: $ENVIRONMENT"
    exit 1
    ;;
esac


echo "::group::Login to OC"
#Sometimes oc login will fail to connect, so lets re-try on failure.
set +e
oc login $OPENSHIFT_SERVER --token=$token
ret=$?
set -e
if [ $ret -eq 0 ]; then
    # The command was successful
    echo "Login successful"

else
    echo "Re-trying oc-login in 10s..."

    sleep 10

    # The command was not successful, lets try again
    oc login $OPENSHIFT_SERVER --token=$token

fi
echo "::endgroup::"

#Go into the deployment folder
DEPLOY_REPO_FOLDER=""
if [ "$OC_NAMEPLATE" == "c0cce6" ]; then
    echo "Using digimod deploy folder"
    #cd wordpress-deploy-digimod
    DEPLOY_REPO_FOLDER=wordpress-deploy-digimod

else
    echo "Using cleanbcdx deploy folder"
    #cd wordpress-deploy-cleanbcdx
    DEPLOY_REPO_FOLDER=wordpress-deploy-cleanbcdx
fi


#Setup some variables
export NAMESPACE="$OC_NAMEPLATE-$ENVIRONMENT"
export OC_ENV=$ENVIRONMENT
export OC_SITE_NAME=$PROJECT_NAME-$SITE_NAME

# Delete existing deployment, if it exists
echo "::group::Checking for existing deployment"
export WORDPRESS_POD_NAME=$(./.github/oc-retry-wrapper.sh get pods -n $NAMESPACE -l app=wordpress,role=wordpress-core,site=${OC_SITE_NAME} -o jsonpath='{.items[0].metadata.name}')
WORDPRESS_CONTAINER_NAME=$(./.github/oc-retry-wrapper.sh get pods -n $NAMESPACE $WORDPRESS_POD_NAME -o jsonpath='{.spec.containers[0].name}')
if [ -n "$WORDPRESS_CONTAINER_NAME" ]; then
    echo "Found existing site."
    echo "::endgroup::"

    #Changed to not delete if it exists, just in case the site has content. Delete should be an active action.
    #chmod +x $DEPLOY_REPO_FOLDER/site-delete-unix.sh
    # ./$DEPLOY_REPO_FOLDER/site-delete-unix.sh


    echo "::error::Found existing site!"

	#Generate GH Actions summary
	echo "### Create WP Instance Error" >> $GITHUB_STEP_SUMMARY
	echo "Environment: ${OC_ENV}" >> $GITHUB_STEP_SUMMARY
	echo "Project: ${PROJECT_NAME}" >> $GITHUB_STEP_SUMMARY
	echo "Site: ${SITE_NAME}" >> $GITHUB_STEP_SUMMARY
	echo "" >> $GITHUB_STEP_SUMMARY # this is a blank line

	echo "Site already exists." >> $GITHUB_STEP_SUMMARY
	echo "" >> $GITHUB_STEP_SUMMARY # this is a blank line
	
	exit 1

else
    echo "Existing site not found, nothing to delete."
fi      
echo "::endgroup::"

# Create new WordPress instance
echo "::group::Create new deployment"
chmod +x $DEPLOY_REPO_FOLDER/site-builder-unix.sh
./$DEPLOY_REPO_FOLDER/site-builder-unix.sh
echo "::endgroup::"

# Wait for WordPress pod to be running

echo "Waiting for WordPress container to be created...5 minutes timeout"
WORDPRESS_POD_NAME=$(./.github/oc-retry-wrapper.sh get pods -n $NAMESPACE -l app=wordpress,role=wordpress-core,site=${OC_SITE_NAME} -o jsonpath='{.items[0].metadata.name}')
./.github/oc-retry-wrapper.sh wait --for=condition=Ready pod/$WORDPRESS_POD_NAME -n $NAMESPACE --timeout=5m
# Wait for the WordPress container to be created
WORDPRESS_CONTAINER_NAME=null;
while true; do
    WORDPRESS_CONTAINER_NAME=$(./.github/oc-retry-wrapper.sh get pods -n $NAMESPACE $WORDPRESS_POD_NAME -o jsonpath='{.spec.containers[0].name}')
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

echo "Downloading wp-cli to action runner"
# Download wp-cli in the GitHub Actions workspace
curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
chmod +x wp-cli.phar

echo "Copying wp-cli to pod"
# Copy wp-cli to the WordPress instance and install wordpress
./.github/oc-retry-wrapper.sh cp --no-preserve wp-cli.phar $NAMESPACE/$WORDPRESS_POD_NAME:/tmp/wp-cli.phar -c $WORDPRESS_CONTAINER_NAME
./.github/oc-retry-wrapper.sh exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- chmod +x /tmp/wp-cli.phar

echo "Performing wordpress install"
#Perform a site install
WP_INSTALL_RESULTS=$(./.github/oc-retry-wrapper.sh exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- php /tmp/wp-cli.phar core install --url=${OC_SITE_NAME}.apps.${OC_TIER}.devops.gov.bc.ca --admin_user=tester --admin_email=info@example.com  --title="${OC_SITE_NAME}.gov.bc.ca Testing Framework")
echo "WP Install Results: ${WP_INSTALL_RESULTS}"

#Disable site indexing
./.github/oc-retry-wrapper.sh exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- php /tmp/wp-cli.phar option set blog_public 0
echo "::endgroup::"

#Generate GH Actions summary
echo "### Deployment:" >> $GITHUB_STEP_SUMMARY
echo "Environment: ${ENVIRONMENT}" >> $GITHUB_STEP_SUMMARY
echo "Project: ${PROJECT_NAME}" >> $GITHUB_STEP_SUMMARY
echo "Site: ${SITE_NAME}"  >> $GITHUB_STEP_SUMMARY
echo "" >> $GITHUB_STEP_SUMMARY # this is a blank line

echo "### WP Install Results: " >> $GITHUB_STEP_SUMMARY
echo "" >> $GITHUB_STEP_SUMMARY # this is a blank line
echo "Admin Username: tester" >> $GITHUB_STEP_SUMMARY 
echo "${WP_INSTALL_RESULTS}" >> $GITHUB_STEP_SUMMARY

echo "**Change the ADMIN password ASAP!**" >> $GITHUB_STEP_SUMMARY