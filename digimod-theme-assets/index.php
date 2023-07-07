<?php
/**
* Plugin Name: DIGIMOD - Block Theme Frontend Enhancements
* Description: A plugin to load custom scripts, styles and theme settings to augment the default BCGov Block Theme capabilities
* Version: 1.1.1
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


// VUE APP

// Register block to load the Vue.js app
function vuejs_wordpress_block() {
    wp_enqueue_script(
        'vuejs-wordpress-block',
        plugin_dir_url(__FILE__) . 'blocks/wcag-vue-app/block.js',
        array( 'wp-blocks', 'wp-element', 'wp-editor' )
    );
}

add_action( 'enqueue_block_editor_assets', 'vuejs_wordpress_block' );

// this loads vue app assets onto the client: todo: this happens for all pages, not just when the block is used
function vuejs_app() {
    $plugin_dir = plugin_dir_path( __FILE__ );
    $assets_dir = $plugin_dir . 'dist/assets/';

    $public_css_files = glob( $assets_dir . 'vue*.css' );
    // $public_js_files = glob( $assets_dir . 'vue*.js' );

    if (is_admin()) {
        foreach ($public_css_files as $file) {
            $file_url = plugins_url(str_replace($plugin_dir, '', $file), __FILE__);
            wp_enqueue_style('vue-app-' . basename($file, '.css'), $file_url);
        }

        // foreach ($public_js_files as $file) {
        //     $file_url = plugins_url(str_replace($plugin_dir, '', $file), __FILE__);
        //     wp_enqueue_script('vue-app-' . basename($file, '.js'), $file_url, [], false, true);
        // }
    }
}

add_action( 'enqueue_block_editor_assets', 'vuejs_app' );

// load vue app assets, only when the block is used on the page
function vuejs_app_dynamic_block( $attributes ) {
    $plugin_dir = plugin_dir_path( __FILE__ );
    $assets_dir = $plugin_dir . 'dist/assets/';

    $public_css_files = glob( $assets_dir . 'vue*.css' );
    $public_js_files = glob( $assets_dir . 'vue*.js' );

    foreach ($public_css_files as $file) {
        $file_url = plugins_url(str_replace($plugin_dir, '', $file), __FILE__);
        wp_enqueue_style('vue-app-' . basename($file, '.css'), $file_url);
    }

    foreach ($public_js_files as $file) {
        $file_url = plugins_url(str_replace($plugin_dir, '', $file), __FILE__);
        wp_enqueue_script('vue-app-' . basename($file, '.js'), $file_url, [], false, true);
    }

     // Access the 'columns' attribute
     $columns = isset( $attributes['columns'] ) ? $attributes['columns'] : 3;  // Fallback to '3' if not set

     // Access the 'className' attribute
     $className = isset( $attributes['className'] ) ? $attributes['className'] : ''; 

     // Add the 'data-columns' attribute to the output div
     return '<div id="app" class="' . esc_attr( $className ) . '" data-columns="' . esc_attr( $columns ) . '">Loading...</div>';
}

function vuejs_app_block_init() {
    register_block_type( 'my-plugin/vuejs-wordpress-block', [
        'render_callback' => 'vuejs_app_dynamic_block',
    ] );
}
add_action( 'init', 'vuejs_app_block_init' );