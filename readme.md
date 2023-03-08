# Digimod WordPress Development Project
The purpose of this project is to develop custom WordPress features to aid with the developlment of digital.gov.bc.ca site.

This project contains two parts:
- WordPress plugin:
  - Contains custom blocks
  - JS code that adds "Preview on digital.gov.bc.ca" button to the editor's top bar
- WordPress theme:
  - Contains CSS to render the content consistent with the look and feel of digital.gov.bc.ca
  - Contains patterns made from collections of blocks from the WordPress plugin

## Pre-requsites
- Docker (for WordPress development image)
- Node

## Set up your environment
run `npm install` inside the main project directory for wordpress dependencies.
run `npm install` inside multipule-blocks-plugin for block creation dependencies.

## Starting development environment
run `wp-env start` in the root directory to start wordpress development site

# Alternative development environment using localwp

Export production site using WP Migrate plugin (exclude WordPress core files). And import the site into localwp.

Clone this repo and bc gov theme fork (https://github.com/alex-struk/bcgov-wordpress-block-theme) to a location of your choice.

## Add symlinks (Windows)

Remove digimod plugins and bc gov theme downloaded using migration tool:

For example:

`C:\Users\ALSTRUK\Local Sites\digital-government-30_o\app\public\wp-content\plugins\multiple-blocks-plugin`

`C:\Users\ALSTRUK\Local Sites\digital-government-30_o\app\public\wp-content\plugins\digital-gov-plugin`

`C:\Users\ALSTRUK\Local Sites\digital-government-30_o\app\public\wp-content\themes\bcgov-wordpress-block-theme`

Add symlinks for digimod plugins (example):

`New-Item -ItemType Junction -Path "C:\Users\ALSTRUK\Local Sites\digital-government-30_o\app\public\wp-content\plugins\digital-gov-plugin" -Target "C:\Users\ALSTRUK\GitHub\wordpress-digimod\digital-gov-plugin"`

`New-Item -ItemType Junction -Path "C:\Users\ALSTRUK\Local Sites\digital-government-30_o\app\public\wp-content\plugins\multiple-blocks-plugin" -Target "C:\Users\ALSTRUK\GitHub\wordpress-digimod\multiple-blocks-plugin"`

Add symlink for bc gov theme (example):

`New-Item -ItemType Junction -Path "C:\Users\ALSTRUK\Local Sites\digital-government-30_o\app\public\wp-content\themes\bcgov-wordpress-block-theme" -Target "C:\Users\ALSTRUK\GitHub\bcgov-wordpress-block-theme"`

## Add local admin

Open site shell and run:

`wp user create localadmin localadmin@test.com --role=administrator`

# Working with blocks

## making changes to an existing block
Since blocks are written with JSX, they need to be re-built after each edit:

`wp-scripts build --webpack-src-dir=blocks/accordian/src/ --output-path=blocks/accordian/build/`

## building Gutenberg javascript extensions

`wp-scripts build assets/js/index.js --output-path=dist`

# Handling production crash because of an error in plugin
If wordpress crashes because of an error in plugin, we need to change the volume contents.

Login to pod with

`kubectl exec --stdin --tty POD-NAME -- /bin/bash`

navigate to `wp-content/plugins/`

rename crashing plugin from "plugin" to "plugin.disabled"

# Tests - JavaScript
## To run javascript tests:

`npx jest`

Note: corrently there are no regular jest tests.

To check jest JS coverage:

`npx jest --coverage`

## To run end-to-end tests for blocks:

Start WordPress development environment:

`wp-env start`

Run tests:

`npm run test:e2e`

To run a specific test:
`npm run test:e2e e2e-tests/two-columns.spec.js`

To debug end-to-end tests in Chrome browser:

`npm run test:e2e:debug`

After running the command, tests will be available for debugging in Chrome by going to chrome://inspect/#devices and clicking inspect under the path to /test-e2e.js.

## Tests - PHP
Install PHP, Composer, PHPUnit

Run

`./vendor/bin/phpunit .\multiple-blocks-plugin\tests`
