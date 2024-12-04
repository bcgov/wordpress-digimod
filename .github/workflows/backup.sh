#!/bin/bash

#Make sure bash exits on any error so that the github action is marked as error
set -e


# Set directory
sourceDir="/var/www/html/wp-content/ai1wm-backups"
dir="/var/www/html/wp-content/ai1wm-backups-history"

# Check if the new directory exists
if [ ! -d "$dir" ]
then
    mkdir -p "$dir"
    echo "Directory $dir created."
fi

# Check if the directory exists
if [ ! -d "$sourceDir" ]
then
    echo "Directory $sourceDir DOES NOT exist." >&2
    exit 1
fi

# Copy .wpress files to the new directory
cp "$sourceDir"/*.wpress "$dir"

# Count the number of .wpress files
num_files=$(ls -1 "$dir"/*.wpress 2>/dev/null | wc -l)



# Get the latest .wpress file
latest_file=$(ls -t "$dir"/*.wpress | head -n1)

# Get the oldest .wpress file
oldest_file=$(ls -tr "$dir"/*.wpress | head -n1)

# Rename the latest file with the current datestamp
if [ -n "$latest_file" ]
then
    timestamp=$(date +%Y%m%d_%H%M%S)
    mv "$latest_file" "$dir/$timestamp.wpress"
    echo "Renamed $latest_file to $timestamp.wpress"
else
    echo "No .wpress file to rename in $dir"
fi

if [ "$num_files" -lt 7 ]; then
    echo "There are less than 7 .wpress files in $dir. Exiting..."
    exit 0
fi

# Delete the oldest .wpress file
if [ -n "$oldest_file" ]
then
    rm "$oldest_file"
    echo "Deleted $oldest_file"
else
    echo "No .wpress file to delete in $dir"
fi