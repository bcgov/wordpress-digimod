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


NAMESPACE="f181a8-$ENVIRONMENT"

NEW_SITE_URL="https://$PROJECT_NAME-$SITE_NAME.apps.gold.devops.gov.bc.ca/"
echo "Checking the site $NEW_SITE_URL"


if [ $ENVIRONMENT != "prod" ]; then
    if [ $SITE_NAME != "backup" ]; then 
        echo "Can only check production-backup, ip block prevents checking other sites."
        exit 0
    fi
fi


RUNNER_IP=$(curl -s https://api.ipify.org)
echo "The runner's public IP is: $RUNNER_IP"
echo "ip=$RUNNER_IP" >> $GITHUB_OUTPUT


# Log in to OpenShift
echo "::group::Login to target OC"
#Sometimes oc login will fail to connect, so lets re-try on failure.
set +e
oc login $OPENSHIFT_SERVER --token=$PROD_TOKEN
ret=$?
set -e
if [ $ret -eq 0 ]; then
    # The command was successful
    echo "Login successful"

else
    echo "Re-trying oc-login in 10s..."

    sleep 10

    # The command was not successful, lets try again
    oc login $OPENSHIFT_SERVER --token=$PROD_TOKEN

fi

echo "::endgroup::"

OC_ENV=$ENVIRONMENT
if [ "$SITE_NAME" = "$PROJECT_NAME" ]; then
    OC_SITE_NAME="$PROJECT_NAME"
else
    OC_SITE_NAME="$PROJECT_NAME-$SITE_NAME"
fi

NGINX_ROUTE_NAME=$(oc get routes -n $NAMESPACE -l app=wordpress,role=nginx,site=${OC_SITE_NAME} -o jsonpath='{.items[0].metadata.name}')
echo "Route Name: $NGINX_ROUTE_NAME"

NGINX_ROUTE_IP_WHITELIST=$(oc get route -n $NAMESPACE $NGINX_ROUTE_NAME -o jsonpath='{.metadata.annotations.haproxy\.router\.openshift\.io/ip_whitelist}')

echo "Adding runner IP to route temporarily"
echo "Existing whitelist: $NGINX_ROUTE_IP_WHITELIST"
oc annotate route -n $NAMESPACE $NGINX_ROUTE_NAME --overwrite haproxy.router.openshift.io/ip_whitelist="$NGINX_ROUTE_IP_WHITELIST $RUNNER_IP"

echo "Waiting 10s for the route to update...."
sleep 10


#Perform query to check for status 200
echo "Checking for 200 status"
set +e
CMD_RESULTS=$(curl -s -o /dev/null -w "%{http_code}" ${NEW_SITE_URL})
CMD_EXIT_CODE=$?
set -e

if [ $CMD_EXIT_CODE -ne 0 ]; then
    echo "::error::Error trying to check remote url, ${CMD_RESULTS}"

    echo "Restoring pod ip whitelist"
    oc annotate route -n $NAMESPACE $NGINX_ROUTE_NAME --overwrite haproxy.router.openshift.io/ip_whitelist="$NGINX_ROUTE_IP_WHITELIST"


    exit $CMD_EXIT_CODE
fi



if [ $CMD_RESULTS -eq 200 ]; then
    echo "Success, restored site responded with http 200 - $NEW_SITE_URL"
fi

if [ "$CMD_RESULTS" -ne 200 ]; then
    echo "::error::Incorrect http status returned, ${CMD_RESULTS}"


    echo "Restoring pod ip whitelist"
    oc annotate route -n $NAMESPACE $NGINX_ROUTE_NAME --overwrite haproxy.router.openshift.io/ip_whitelist="$NGINX_ROUTE_IP_WHITELIST"


    exit 99
fi 


echo "Restoring pod ip whitelist"
oc annotate route -n $NAMESPACE $NGINX_ROUTE_NAME --overwrite haproxy.router.openshift.io/ip_whitelist="$NGINX_ROUTE_IP_WHITELIST"


echo "### Checked Restored Site" >> $GITHUB_STEP_SUMMARY
echo "Environment: ${OC_ENV}" >> $GITHUB_STEP_SUMMARY
echo "Project: ${PROJECT_NAME}" >> $GITHUB_STEP_SUMMARY
echo "Site: ${OC_SITE_NAME}" >> $GITHUB_STEP_SUMMARY
echo "" >> $GITHUB_STEP_SUMMARY # this is a blank line
echo "Http Result: $CMD_RESULTS" >> $GITHUB_STEP_SUMMARY


