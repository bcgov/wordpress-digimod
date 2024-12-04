#!/bin/bash
set -e

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