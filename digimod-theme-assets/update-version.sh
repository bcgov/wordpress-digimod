#!/bin/bash

# Change to reflect project version source of truth – typically style.css or index.php
VERSION_SOURCE="index.php"

# Get the current version number
CURRENT_VERSION=$(perl -ne 'print $1 if /Version: ([0-9.]+)/' $VERSION_SOURCE)

# Prompt for version increment type
echo "Current version:" $CURRENT_VERSION
echo "Choose the version increment type:"
echo "1. Major"
echo "2. Minor"
echo "3. Patch"
echo "4. No change"
read -p "Enter your choice (1/2/3/4): " CHOICE

# Split the current version into major, minor, and patch numbers
MAJOR=$(echo $CURRENT_VERSION | cut -d '.' -f 1)
MINOR=$(echo $CURRENT_VERSION | cut -d '.' -f 2)
PATCH=$(echo $CURRENT_VERSION | cut -d '.' -f 3)

# Increment the version number based on the chosen type
case $CHOICE in
  1) MAJOR=$((MAJOR + 1)); MINOR=0; PATCH=0 ;;
  2) MAJOR=$MAJOR ; MINOR=$((MINOR + 1)); PATCH=0 ;;
  3) MAJOR=$MAJOR ; MINOR=$MINOR; PATCH=$((PATCH + 1)) ;;
  4) echo "You chose not to make any changes to the version."; exit 0 ;;
  *) echo "Invalid choice. Exiting."; exit 1 ;;
esac

# Create the new version number
NEW_VERSION="${MAJOR}.${MINOR}.${PATCH}"

# Update style.css or index.php
perl -pi -e "s/Version: [0-9.]+/Version: ${NEW_VERSION}/" $VERSION_SOURCE

# Update package.json
perl -pi -e "s/\"version\": \"[0-9.]+\"/\"version\": \"${NEW_VERSION}\"/" package.json

echo "Version updated successfully to ${NEW_VERSION}! Don't forget to update the composer lock file."