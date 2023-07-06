<?php
/**
* Plugin Name: DIGIMOD - Block Theme Frontend Enhancements
* Description: A plugin to load custom scripts, styles and theme settings to augment the default BCGov Block Theme capabilities
* Version: 1.0.1
* Author: Digimod
* License: GPL-2.0+
* License URI: http://www.gnu.org/licenses/gpl-2.0.txt
* Repository: https://github.com/bcgov/wordpress-digimod/tree/main/digimod-theme-assets
*/

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
    exit( 'Direct access denied.' );
}

/**
 * Load public and admin assets.
 * 
 * @return void
 */
function custom_assets_loader() {
    $plugin_dir = plugin_dir_path( __FILE__ );
    $assets_dir = $plugin_dir . 'dist/assets/';

    $public_css_files = glob( $assets_dir . 'public*.css' );
    $public_js_files = glob( $assets_dir . 'public*.js' );

    $admin_css_files = glob( $assets_dir . 'admin*.css' );
    $admin_js_files = glob( $assets_dir . 'admin*.js' );

    // Load public CSS and JS files
    if (!is_admin()) {
        foreach ( $public_css_files as $file ) {
            $file_url = plugins_url( str_replace( $plugin_dir, '', $file ), __FILE__ );
            wp_enqueue_style( 'custom-public-' . basename( $file, '.css' ), $file_url );
        }
        
        foreach ( $public_js_files as $file ) {
            $file_url = plugins_url(str_replace( $plugin_dir, '', $file ), __FILE__ );
            wp_enqueue_script( 'custom-public-' . basename( $file, '.js' ), $file_url, [], false, true );
        }
    } else {
        // Load admin CSS and JS files
        foreach ( $admin_css_files as $file ) {
            $file_url = plugins_url( str_replace( $plugin_dir, '', $file ), __FILE__ );
            wp_enqueue_style( 'custom-admin-' . basename( $file, '.css' ), $file_url );
        }

        foreach ( $admin_js_files as $file ) {
            $file_url = plugins_url( str_replace( $plugin_dir, '', $file ), __FILE__ );
            wp_enqueue_script( 'custom-admin-' . basename( $file, '.js' ), $file_url, [], false, true );
        }
    }

}

add_action( 'wp_enqueue_scripts', 'custom_assets_loader' );
add_action( 'admin_enqueue_scripts', 'custom_assets_loader' );


/**
 * Load the Digimod theme.json and update the provided theme.json object.
 * 
 * Retrieves the contents of the 'theme.json' file contains configuration settings for the Digimod theme.
 * 
 * @return object The updated theme.json object.
*/
function filter_theme_json_theme( $theme_json ) {

    $plugin_theme_json_path = trailingslashit( plugin_dir_path( __FILE__ ) ) . 'theme/theme.json';
    $plugin_theme_json = json_decode( file_get_contents( $plugin_theme_json_path ), true );

    return $theme_json->update_with( $plugin_theme_json );
}

add_filter( 'wp_theme_json_data_theme', 'filter_theme_json_theme' );
