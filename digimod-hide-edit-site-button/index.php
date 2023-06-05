<?php
/**
* Plugin Name: DIGIMOD - hide "Edit Site" button 
* Description: Hides "Edit Site" button on the top bar when viewing a published page
* Version: 1.0.0
* Author: Digimod
* License: GPL-2.0+
* License URI: http://www.gnu.org/licenses/gpl-2.0.txt
*/

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

function hide_edit_site_button() {
    if(is_user_logged_in() && is_page()) {
        echo '
            <style type="text/css">
                #wp-admin-bar-site-editor { display: none; }
            </style>
        ';
    }
}

add_action('wp_footer', 'hide_edit_site_button');