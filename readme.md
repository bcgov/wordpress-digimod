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

## to create a new block from html prototype
- add an element to the prototypes array near the top of the main.mjs file.
- execute main.mjs (`node main.mjs`)

## making changes to an existing block
Since blocks are written with JSX, they need to be re-built after each edit:

`wp-scripts build --webpack-src-dir=blocks/dm-accordian/src/ --output-path=blocks/dm-accordian/build/`

## building Gutenberg javascript extension

`wp-scripts build assets/js/block_extensions.js --output-path=dist`

## If wordpress crashes because of an error in plugin
If wordpress crashes because of an error in plugin, we need to change the volume contents.

Login to pod with

`kubectl exec --stdin --tty POD-NAME -- /bin/bash`

navigate to `wp-content/plugins/`

Use `vi` or other editor to change the file(s).

Save and quit the editor.

Wordpress should be working now.