#!/bin/bash

ENVIRONMENT=$1
SITE_NAME=$2
OPENSHIFT_SERVER=$3
DEV_TOKEN=$4
TEST_TOKEN=$5
PROD_TOKEN=$6
KEYCLOAK_TEST_CLIENT_SECRET=$7

PLUGIN=$8

NAMESPACE="c0cce6-$ENVIRONMENT"
OC_SITE_NAME=digital-$SITE_NAME
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
	OC_SITE_NAME=digital
	;;
	*)
	echo "Unknown environment: $ENVIRONMENT"
	exit 1
	;;
esac

oc login $OPENSHIFT_SERVER --token=$token --insecure-skip-tls-verify=true


if [ -d "$PLUGIN" ]; then
	echo deploying $PLUGIN

	WORDPRESS_POD_NAME=$(oc get pods -n $NAMESPACE -l app=wordpress,role=wordpress-core,site=${OC_SITE_NAME} -o jsonpath='{.items[0].metadata.name}')
	WORDPRESS_CONTAINER_NAME=$(oc get pods -n $NAMESPACE $WORDPRESS_POD_NAME -o jsonpath='{.spec.containers[0].name}')

	cd $PLUGIN
	tar -cf $PLUGIN.tar --exclude=./.github --exclude=node_modules ./*
	oc cp --no-preserve $PLUGIN.tar $NAMESPACE/$WORDPRESS_POD_NAME:/var/www/html/wp-content/plugins/$PLUGIN.tar -c $WORDPRESS_CONTAINER_NAME
	oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- rm -rf /var/www/html/wp-content/plugins/$PLUGIN  # This removes the old plugin directory
	oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- mkdir -p /var/www/html/wp-content/plugins/$PLUGIN
	oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- tar -xf /var/www/html/wp-content/plugins/$PLUGIN.tar -C /var/www/html/wp-content/plugins/$PLUGIN
	oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- rm /var/www/html/wp-content/plugins/$PLUGIN.tar
	echo $PLUGIN deployed successfully.

else  
	echo "plugin $PLUGIN does not exist."
	exit 1
fi