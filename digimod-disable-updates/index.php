<?php
/**
* Plugin Name: DIGIMOD - Disable Automatic Updates
* Description: Disables automatic WordPress updates as updates should be handled through github actions
* Version: 1.0.0
* Author: Digimod
* License: GPL-2.0+
* License URI: http://www.gnu.org/licenses/gpl-2.0.txt
*/

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

add_filter( 'automatic_updater_disabled', '__return_true');