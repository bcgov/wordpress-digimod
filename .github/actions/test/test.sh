#!/bin/bash

#Make sure bash exits on any error so that the github action is marked as error
set -e

OPENSHIFT_SERVER=$1
DEV_TOKEN=$2
TEST_TOKEN=$3
PROD_TOKEN=$4

NAMESPACE="c0cce6-prod"

#testing new OC login way
OC_TEMP_TOKEN=$(curl -k -X POST $OPENSHIFT_SERVER/api/v1/namespaces/$NAMESPACE/serviceaccounts/pipeline/token --header "Authorization: Bearer $DEV_TOKEN" -d '{"spec": {"expirationSeconds": 600}}' -H 'Content-Type: application/json; charset=utf-8' | jq -r '.status.token' )

oc login --token=$OC_TEMP_TOKEN --server=$OPENSHIFT_SERVER
oc logout

#This should fail and cause the action to exit out.
ret=0
curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli2.phar --fail || ret=$?

if [ $ret -eq 0 ]; then
    # The command was successful
    echo 'Success1'

    chmod +x wp-cli.phar
else
    # The command was not successful
    echo "Attempt failed1. Trying again..."
fi



ret=0
curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar --fail || ret=$?

if [ $ret -eq 0 ]; then
    # The command was successful
    echo 'Success2'

    chmod +x wp-cli.phar
else
    # The command was not successful
    echo "Attempt failed2. Trying again..."
fi




echo "Done bash script"
exit 2