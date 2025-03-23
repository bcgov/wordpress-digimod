#!/bin/bash

#Make sure bash exits on any error so that the github action is marked as error
set -e

OPENSHIFT_SERVER=$1
DEV_TOKEN=$2
TEST_TOKEN=$3
PROD_TOKEN=$4

NAMESPACE="c0cce6-dev"



echo "Done bash script"
exit 2