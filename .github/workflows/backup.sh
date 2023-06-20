#!/bin/bash

# Directory you want to work on
directory="/path/to/your/directory"

# Rename the latest file
latest_file="$(ls -t "$directory" | head -n1)"
if [ -n "$latest_file" ]; then
    mv -- "$directory/$latest_file" "$directory/newname.ext"
else
    echo "No files to rename in $directory."
fi

# Delete the oldest file
oldest_file="$(ls -rt "$directory" | head -n1)"
if [ -n "$oldest_file" ]; then
    rm -- "$directory/$oldest_file"
else
    echo "No files to delete in $directory."
fi