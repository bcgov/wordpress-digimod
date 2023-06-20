#!/bin/bash

# GITHUB_TOKEN=$1
# TOOLS_TOKEN=$2
# OPENSHIFT_SERVER=$3
# DEV_TOKEN=$4
# TEST_TOKEN=$5
# PROD_TOKEN=$6
# # Log in to OpenShift
# oc login $OPENSHIFT_SERVER --token=$TOOLS_TOKEN --insecure-skip-tls-verify=true

# Define the environment variables
GITHUB_TOKEN=${GITHUB_TOKEN}

# Define the Github API URL for the Dockerfile
GITHUB_API_URL="https://api.github.com/repos/bcgov/wordpress-deploy-digimod/contents/openshift/templates/images/wordpress/docker/Dockerfile"

# Fetch the Dockerfile content from Github
dockerfile_content=$(curl -L $GITHUB_API_URL | jq -r ".content" | base64 --decode)

# Extract the current WordPress version from Dockerfile
current_version=$(echo "$dockerfile_content" | head -n 1 | awk '{print $2}' | cut -d ':' -f 2- | cut -d '-' -f 2-)

# Get latest WordPress version from DockerHub
latest_version=$(curl https://hub.docker.com/v2/repositories/library/wordpress/tags | jq -r '.results[0].name')

# Compare versions and update Dockerfile if needed
if [[ "$current_version" != "$latest_version" ]]; then
    # Replace the old version with the latest version
    updated_dockerfile_content=$(echo $dockerfile_content | sed "s/$current_version/$latest_version/")

    # Convert Dockerfile content to base64
    updated_base64_dockerfile_content=$(echo -n "$updated_dockerfile_content" | base64)

    # Extract SHA of the current Dockerfile
    current_sha=$(curl -s $GITHUB_API_URL | jq -r .sha)

    echo "current "$current_version

    echo "latest "$latest_version
    # Update the Dockerfile on GitHub
    # curl -X PUT -H "Authorization: token $GITHUB_TOKEN" \
    # -d "{\"message\":\"Update to latest WordPress version\",\"content\":\"$updated_base64_dockerfile_content\",\"sha\":\"$current_sha\"}" \
    # $GITHUB_API_URL

    # Update the image on openshift
    # oc process -f https://github.com/repos/bcgov/wordpress-deploy-digimod/contents/deployments/kustomize/overlays/openshift/images/image-builds | oc apply -f -
fi
# Trigger the WordPress Build workflow
# GITHUB_WORKFLOW_API_URL="https://api.github.com/repos/bcgov/wordpress-deploy-digimod/actions/workflows/wordpress-build.yaml/dispatches"

# curl -X POST -H "Authorization: token $GITHUB_TOKEN" \
#     -d '{"ref":"main"}' \
#     $GITHUB_WORKFLOW_API_URL