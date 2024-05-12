<?php

/**
 * Plugin Name: DIGIMOD - Agile Fundamentals Training Materials
 * Description: Hosting of the Agile Fundamentals Training Materials under DigitalGov
 * Version: 1.0.0
 * Author: Digimod
 * License: GPL-2.0+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 * Plugin URI: https://github.com/bcgov/wordpress-digimod/tree/main/digimod-agile-fundamentals-training
 * Update URI: https://raw.githubusercontent.com/bcgov/wordpress-digimod/main/digimod-agile-fundamentals-training/index.php
 */

/* 
Changelog

1.0.0 - Initial release.

*/

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}



// Begin function to check for updates to plugin
require_once "digimod-update-check.php";

add_action('init', 'digimod_misc_update_check_init');
function digimod_misc_update_check_init()
{
    if (class_exists('digimod_plugin_update_check')) {
        new digimod_plugin_update_check(__FILE__, plugin_basename(__FILE__));
    }
}
//End update check code.