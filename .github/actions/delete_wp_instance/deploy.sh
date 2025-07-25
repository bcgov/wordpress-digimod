#!/bin/bash

#Make sure bash exits on any error so that the github action is marked as error
set -e

ENVIRONMENT=$1
SITE_NAME=$2
PROJECT_NAME=$3
OPENSHIFT_SERVER=$4
DEV_TOKEN=$5
TEST_TOKEN=$6
PROD_TOKEN=$7

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
oc login $OPENSHIFT_SERVER --token=$token       #--insecure-skip-tls-verify=true
echo "::endgroup::"

#Go into the deployment folder
cd wordpress-deploy-digimod

#Setup some variables
export NAMESPACE="c0cce6-$ENVIRONMENT"
export OC_ENV=$ENVIRONMENT
export OC_SITE_NAME=$PROJECT_NAME-$SITE_NAME

#Generate GH Actions summary
echo "Environment: ${OC_ENV}" >> $GITHUB_STEP_SUMMARY
echo "Project: ${PROJECT_NAME}" >> $GITHUB_STEP_SUMMARY
echo "Site: ${OC_SITE_NAME}" >> $GITHUB_STEP_SUMMARY
echo "" >> $GITHUB_STEP_SUMMARY # this is a blank line

# Delete existing deployment, if it exists
echo "::group::Delete existing deployment"
export WORDPRESS_POD_NAME=$(oc get pods -n $NAMESPACE -l app=wordpress,role=wordpress-core,site=${OC_SITE_NAME} -o jsonpath='{.items[0].metadata.name}')
WORDPRESS_CONTAINER_NAME=$(oc get pods -n $NAMESPACE $WORDPRESS_POD_NAME -o jsonpath='{.spec.containers[0].name}')
if [ -n "$WORDPRESS_CONTAINER_NAME" ]; then
    chmod +x site-delete-unix.sh
    ./site-delete-unix.sh

    echo "### Deployment Deleted" >> $GITHUB_STEP_SUMMARY

else
    #Generate GH Actions summary
    echo "### Deployment Not Found (nothing deleted)" >> $GITHUB_STEP_SUMMARY
fi      

echo "" >> $GITHUB_STEP_SUMMARY # this is a blank line

echo "::endgroup::"