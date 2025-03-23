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

oc login $OPENSHIFT_SERVER --token=$token 				#--insecure-skip-tls-verify=true


if [ -d "$PLUGIN" ]; then
	echo "Deploying $PLUGIN to $OC_SITE_NAME"

	WORDPRESS_POD_NAME=$(oc get pods -n $NAMESPACE -l app=wordpress,role=wordpress-core,site=${OC_SITE_NAME} -o jsonpath='{.items[0].metadata.name}')
	WORDPRESS_CONTAINER_NAME=$(oc get pods -n $NAMESPACE $WORDPRESS_POD_NAME -o jsonpath='{.spec.containers[0].name}')

	# Download wp-cli in the GitHub Actions workspace
	curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
	chmod +x wp-cli.phar

	# Copy wp-cli to the WordPress instance and install wordpress
	oc cp --no-preserve wp-cli.phar $NAMESPACE/$WORDPRESS_POD_NAME:/tmp/wp-cli.phar -c $WORDPRESS_CONTAINER_NAME
	oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- chmod +x /tmp/wp-cli.phar


	#Get installed version
	echo "Existing installed plugin version:"
	EXISTING_VER_RESULTS=$(oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- php /tmp/wp-cli.phar plugin get $PLUGIN --field=version)
	echo "${EXISTING_VER_RESULTS}"

	cd $PLUGIN
	tar -cf $PLUGIN.tar --exclude=./.github --exclude=node_modules ./*
	oc cp --no-preserve $PLUGIN.tar $NAMESPACE/$WORDPRESS_POD_NAME:/var/www/html/wp-content/plugins/$PLUGIN.tar -c $WORDPRESS_CONTAINER_NAME
	oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- rm -rf /var/www/html/wp-content/plugins/$PLUGIN  # This removes the old plugin directory
	oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- mkdir -p /var/www/html/wp-content/plugins/$PLUGIN
	oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- tar -xf /var/www/html/wp-content/plugins/$PLUGIN.tar -C /var/www/html/wp-content/plugins/$PLUGIN
	oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- rm /var/www/html/wp-content/plugins/$PLUGIN.tar


	echo "Newly installed plugin version:"
	NEW_VER_RESULTS=$(oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- php /tmp/wp-cli.phar plugin get $PLUGIN --field=version)
	echo "${NEW_VER_RESULTS}"



	echo "Clearing W3TC Cache"
	oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- php /tmp/wp-cli.phar w3-total-cache flush all

	echo $PLUGIN deployed successfully.
	

	#Generate GH Actions summary
	echo "### Deployed Plugin" >> $GITHUB_STEP_SUMMARY
	echo "Environment: ${OC_ENV}" >> $GITHUB_STEP_SUMMARY
	echo "Site: ${OC_SITE_NAME}" >> $GITHUB_STEP_SUMMARY
	echo "Plugin: ${PLUGIN}" >> $GITHUB_STEP_SUMMARY
	echo "" >> $GITHUB_STEP_SUMMARY # this is a blank line
	echo "" >> $GITHUB_STEP_SUMMARY # this is a blank line


	echo "Existing Installed plugin version: ${EXISTING_VER_RESULTS}" >> $GITHUB_STEP_SUMMARY
	echo "Newly Installed plugin version: ${NEW_VER_RESULTS}" >> $GITHUB_STEP_SUMMARY

	


else  
	echo "plugin $PLUGIN does not exist."

	#Generate GH Actions summary
	echo "### Deploy Plugin Error" >> $GITHUB_STEP_SUMMARY
	echo "Environment: ${OC_ENV}" >> $GITHUB_STEP_SUMMARY
	echo "Site: ${OC_SITE_NAME}" >> $GITHUB_STEP_SUMMARY
	echo "" >> $GITHUB_STEP_SUMMARY # this is a blank line

	echo "Plugin ${PLUGIN} does not exist." >> $GITHUB_STEP_SUMMARY
	echo "" >> $GITHUB_STEP_SUMMARY # this is a blank line
	
	exit 1
fi