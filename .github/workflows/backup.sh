#!/bin/bash

# Set directory
dir="/var/www/html/wp-content/ai1wm-backups"

# Check if the directory exists
if [ ! -d "$dir" ]
then
    echo "Directory $dir DOES NOT exist." >&2
    exit 1
fi

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

if [ "$num_files" -lt 2 ]; then
    echo "There are less than 2 .wpress files in $dir. Exiting..."
    exit 1
fi

# Delete the oldest .wpress file
if [ -n "$oldest_file" ]
then
    rm "$oldest_file"
    echo "Deleted $oldest_file"
else
    echo "No .wpress file to delete in $dir"
fi