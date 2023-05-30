<?php
/**
* Plugin Name: DIGIMOD - filter app
* Description: A plugin that contains the app that powers WCAG filtering mechanism
* Version: 1.0.0
* Author: Digimod
* License: GPL-2.0+
* License URI: http://www.gnu.org/licenses/gpl-2.0.txt
*/

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// TODO: refactor code into individual modules instead of a single file
// VUE APP

// Register block to load the Vue.js app
function vuejs_wordpress_block() {
    wp_enqueue_script(
        'vuejs-wordpress-block',
        plugin_dir_url(__FILE__) . 'block.js',
        array( 'wp-blocks', 'wp-element', 'wp-editor' )
    );
}

add_action( 'enqueue_block_editor_assets', 'vuejs_wordpress_block' );

// this loads vue app assets onto the client: todo: this happens for all pages, not just when the block is used
function vuejs_app() {
    $plugin_dir = plugin_dir_path(__FILE__);
    $assets_dir = $plugin_dir . 'blocks/wcag-vue-app/wcag-app/dist/assets/';
    $public_js_files = glob($assets_dir . 'index-*.js');
    $public_css_files = glob($assets_dir . 'index-*.css');

    if (is_admin()) {
        foreach ($public_css_files as $file) {
            $file_url = plugins_url(str_replace($plugin_dir, '', $file), __FILE__);
            wp_enqueue_style('vue-app-' . basename($file, '.css'), $file_url);
        }

        foreach ($public_js_files as $file) {
            $file_url = plugins_url(str_replace($plugin_dir, '', $file), __FILE__);
            wp_enqueue_script('vue-app-' . basename($file, '.js'), $file_url, [], false, true);
        }
    }
}

add_action( 'enqueue_block_editor_assets', 'vuejs_app' );

// load vue app assets, only when the block is used on the page
function vuejs_app_dynamic_block( $attributes ) {
    $plugin_dir = plugin_dir_path( __FILE__ );
    $assets_dir = $plugin_dir . 'blocks/wcag-vue-app/wcag-app/dist/assets/';
    $public_js_files = glob($assets_dir . 'index-*.js');
    $public_css_files = glob($assets_dir . 'index-*.css');

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