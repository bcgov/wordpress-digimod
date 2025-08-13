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
PLUGIN_BRANCH_NAME=$8



NAMESPACE="c0cce6-$ENVIRONMENT"
OC_ENV=$ENVIRONMENT
OC_SITE_NAME=$PROJECT_NAME-$SITE_NAME

PLUGIN="bcgov-plugin-cleanbc"

case "$ENVIRONMENT" in
	"dev")
	token=$DEV_TOKEN
	;;
	"test")
	token=$TEST_TOKEN
	;;
	"prod")		
	#todo exception for the cleanbc production sites that are cleanbc, cleanbc-bh, cleanbc-goev
	token=$PROD_TOKEN
	OC_SITE_NAME=$PROJECT_NAME
	;;
	*)
	echo "Unknown environment: $ENVIRONMENT"
	exit 1
	;;
esac

echo "Deploying to the site $OC_SITE_NAME in $OC_ENV"

echo "::group::Login to OC"
oc login $OPENSHIFT_SERVER --token=$token 				#--insecure-skip-tls-verify=true
echo "::endgroup::"

echo "::group::Cloning plugin repo - Branch ${PLUGIN_BRANCH_NAME}"
git clone https://github.com/bcgov/${PLUGIN} -b ${PLUGIN_BRANCH_NAME}
echo "::endgroup::"

if [ -d "$PLUGIN" ]; then
	echo "Deploying $PLUGIN (${PLUGIN_BRANCH_NAME}) to $OC_SITE_NAME"

	WORDPRESS_POD_NAME=$(oc get pods -n $NAMESPACE -l app=wordpress,role=wordpress-core,site=${OC_SITE_NAME} -o jsonpath='{.items[0].metadata.name}')
	WORDPRESS_CONTAINER_NAME=$(oc get pods -n $NAMESPACE $WORDPRESS_POD_NAME -o jsonpath='{.spec.containers[0].name}')

	# Download wp-cli in the GitHub Actions workspace
	curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
	chmod +x wp-cli.phar

	# Copy wp-cli to the WordPress instance 
	oc cp --no-preserve wp-cli.phar $NAMESPACE/$WORDPRESS_POD_NAME:/tmp/wp-cli.phar -c $WORDPRESS_CONTAINER_NAME
	oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- chmod +x /tmp/wp-cli.phar


	#Get installed version
	set +e
	echo "Existing installed plugin version:"
	EXISTING_VER_RESULTS=$(oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- php /tmp/wp-cli.phar plugin get $PLUGIN --field=version 2>&1)
	EXISTING_VER_RESULTS_EXIT_CODE=$?
	set -e
	if [ $EXISTING_VER_RESULTS_EXIT_CODE -eq 0 ]; then
		echo "${EXISTING_VER_RESULTS}"

	else
		EXISTING_VER_RESULTS="Plugin not found"
		echo "Plugin not found"

		echo "::warning::Plugin not found"s
	fi


	cd $PLUGIN
	tar -cf $PLUGIN.tar --exclude=./.github --exclude=node_modules --exclude=tests --exclude=Vite-tests --exclude=package.json --exclude=package-lock.json ./*
	oc cp --no-preserve $PLUGIN.tar $NAMESPACE/$WORDPRESS_POD_NAME:/var/www/html/wp-content/plugins/$PLUGIN.tar -c $WORDPRESS_CONTAINER_NAME
	
	#TODO remove when finally ready to enable deployment code.
	oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- rm -rf /var/www/html/wp-content/plugins/$PLUGIN  # This removes the old plugin directory
	oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- mkdir -p /var/www/html/wp-content/plugins/$PLUGIN
	oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- tar -xf /var/www/html/wp-content/plugins/$PLUGIN.tar -C /var/www/html/wp-content/plugins/$PLUGIN
	oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- rm /var/www/html/wp-content/plugins/$PLUGIN.tar


	echo "Newly installed plugin version:"
	NEW_VER_RESULTS=$(oc exec -n $NAMESPACE -c $WORDPRESS_CONTAINER_NAME $WORDPRESS_POD_NAME -- php /tmp/wp-cli.phar plugin get $PLUGIN --field=version)
	echo "${NEW_VER_RESULTS}"



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


	echo $PLUGIN deployed successfully.


	#Generate GH Actions summary
	echo "### Deployed Plugin" >> $GITHUB_STEP_SUMMARY
	echo "Environment: ${OC_ENV}" >> $GITHUB_STEP_SUMMARY
    echo "Project: ${PROJECT_NAME}" >> $GITHUB_STEP_SUMMARY
	echo "Site: ${OC_SITE_NAME}" >> $GITHUB_STEP_SUMMARY
	echo "Plugin: ${PLUGIN}" >> $GITHUB_STEP_SUMMARY
	echo "Branch: ${PLUGIN_BRANCH_NAME}" >> $GITHUB_STEP_SUMMARY
	echo "" >> $GITHUB_STEP_SUMMARY # this is a blank line

	echo "Existing Installed plugin version: ${EXISTING_VER_RESULTS}" >> $GITHUB_STEP_SUMMARY
	echo "Newly Installed plugin version: ${NEW_VER_RESULTS}" >> $GITHUB_STEP_SUMMARY
	echo "" >> $GITHUB_STEP_SUMMARY # this is a blank line

	


else  
	echo "::error::Plugin $PLUGIN does not exist."

	#Generate GH Actions summary
	echo "### Deploy Plugin Error" >> $GITHUB_STEP_SUMMARY
	echo "Environment: ${OC_ENV}" >> $GITHUB_STEP_SUMMARY
    echo "Project: ${PROJECT_NAME}" >> $GITHUB_STEP_SUMMARY
	echo "Site: ${OC_SITE_NAME}" >> $GITHUB_STEP_SUMMARY
	echo "" >> $GITHUB_STEP_SUMMARY # this is a blank line

	echo "Plugin ${PLUGIN} does not exist." >> $GITHUB_STEP_SUMMARY
	echo "" >> $GITHUB_STEP_SUMMARY # this is a blank line
	
	exit 1
fi