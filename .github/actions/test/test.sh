#!/bin/bash

#This should fail and cause the action to exit out.
curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli2.phar
#chmod +x wp-cli.phar

echo "Done bash script"
exit 2