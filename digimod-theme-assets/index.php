<?php
/**
* Plugin Name: DIGIMOD - Block Theme Frontend Enhancements
* Description: A plugin to load custom scripts, styles and theme settings to augment the default BCGov Block Theme capabilities
* Version: 1.1.4
* Author: Digimod
* License: GPL-2.0+
* License URI: http://www.gnu.org/licenses/gpl-2.0.txt
* Repository: https://github.com/bcgov/wordpress-digimod/tree/main/digimod-theme-assets
* Plugin URI: https://github.com/bcgov/wordpress-digimod/tree/main/digimod-theme-assets
* Update URI: https://raw.githubusercontent.com/bcgov/wordpress-digimod/main/digimod-theme-assets/index.php
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
function vuejs_wordpress_block_plugin() {
    wp_enqueue_script(
        'digimod-plugin/custom-filter-block',
        plugin_dir_url(__FILE__) . 'blocks/vue-blocks/custom-filter-vue-block.js',
        array( 'wp-blocks', 'wp-element', 'wp-editor' )
    );

    // wp_enqueue_script(
    //     'digimod-plugin/post-filter-block',
    //     plugin_dir_url(__FILE__) . 'blocks/vue-blocks/post-filter-vue-block.js',
    //     ['wp-blocks', 'wp-element', 'wp-editor']
    // );
}

add_action( 'enqueue_block_editor_assets', 'vuejs_wordpress_block_plugin' );

// this loads vue app assets onto the client: todo: this happens for all pages, not just when the block is used
function vuejs_app_plugin() {
    $plugin_dir = plugin_dir_path( __FILE__ );
    $assets_dir = $plugin_dir . 'dist/assets/';

    $public_css_files = glob( $assets_dir . 'vue*.css' );
    // $public_js_files = glob( $assets_dir . 'vue*.js' );

    if (is_admin()) {
        foreach ($public_css_files as $file) {
            $file_url = plugins_url(str_replace($plugin_dir, '', $file), __FILE__);
            wp_enqueue_style('vue-app-' . basename($file, '.css'), $file_url);
        }
    }
}

add_action( 'enqueue_block_editor_assets', 'vuejs_app_plugin' );


// load vue app assets, only when the block is used on the page
function vuejs_post_filter_app_dynamic_block_plugin($attributes) {

    $plugin_dir = plugin_dir_path(__FILE__);
    $assets_dir = $plugin_dir . 'dist/assets/';

    $public_css_files = glob($assets_dir . 'vue*.css');
    $public_js_files = glob($assets_dir . 'vue*.js');

    foreach ($public_css_files as $file) {
        $file_url = plugins_url(str_replace($plugin_dir, '', $file), __FILE__);
        wp_enqueue_style('vue-app-' . basename($file, '.css'), $file_url);
    }

    foreach ($public_js_files as $file) {
        $file_url = plugins_url(str_replace($plugin_dir, '', $file), __FILE__);
        wp_enqueue_script('vue-app-' . basename($file, '.js'), $file_url, ['bcgov-block-theme-public'], false, true); // Sets the dependency to Block Theme to enqueue after
    }

    // Set up the attributes passed to the Vue frontend, with defaults
    $columns = isset($attributes['columns']) ? $attributes['columns'] : 3;  // Fallback to '3' if not set
    $className = isset($attributes['className']) ? $attributes['className'] : '';
    $postType = isset($attributes['postType']) ? $attributes['postType'] : 'posts';
    $postTypeLabel = isset($attributes['postTypeLabel']) ? $attributes['postTypeLabel'] : 'Posts';
    $headingSize = isset($attributes['headingSize']) ? $attributes['headingSize'] : 'h3';
    $headingLinkActive = isset($attributes['headingLinkActive']) ? $attributes['headingLinkActive'] : 'false';
    $useExcerpt = isset($attributes['useExcerpt']) ? $attributes['useExcerpt'] : 'excerpt';

    // Add the 'data-columns' attribute to the output div
    return '<div id="postFilterApp" class="' . esc_attr($className) . '" data-columns="' . esc_attr($columns) . '" data-post-type="' . esc_attr($postType) . '"  data-heading-size="' . esc_attr($headingSize) . '" data-heading-link-active="' . esc_attr($headingLinkActive) . '" data-use-excerpt="' . esc_attr($useExcerpt) . '" data-post-type-label="' . esc_attr($postTypeLabel) . '">Loading...</div>';
}


function vuejs_custom_app_dynamic_block_plugin( $attributes ) {
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

     $postType = isset( $attributes['postType'] ) ? $attributes['postType'] : 'wcag-card'; 

     $postTypeLabel = isset($attributes['postTypeLabel']) ? $attributes['postTypeLabel'] : 'WCAG card';
     
     $className = isset( $attributes['className'] ) ? $attributes['className'] : ''; 

     // Add the 'data-columns' attribute to the output div
     return '<div id="app" class="' . esc_attr( $className ) . '" data-columns="' . esc_attr( $columns ) . '"  data-post-type="' . esc_attr( $postType ) . '" data-post-type-label="' . esc_attr($postTypeLabel) . '">Loading...</div>';
}

function vuejs_app_plugin_block_init() {
    
    register_block_type( 'digimod-plugin/custom-filter-block', [
        'render_callback' => 'vuejs_custom_app_dynamic_block_plugin',
    ] );

    // register_block_type('digimod-plugin/post-filter-block', [
    //     'render_callback' => 'vuejs_post_filter_app_dynamic_block_plugin',
    // ]);
}

add_action( 'init', 'vuejs_app_plugin_block_init' );


function custom_api_post_filter_callback() {
    $args = array(
        'post_type'      => 'post',
        'posts_per_page' => -1,
        'post_status'    => 'publish',
    );

    $projects = new \WP_Query($args);

    $posts_data = [];

    foreach ($projects->posts as $post) {
        $categories = wp_get_post_categories($post->ID, array('fields' => 'all'));

        $categories_data = array();
        foreach ($categories as $category) {
            $categories_data[] = array(
                'id'   => $category->term_id,
                'name' => $category->name,
                'slug' => $category->slug,
            );
        }

        $content = apply_filters('the_content', $post->post_content);

        if (!empty($post->post_excerpt)) {
            $excerpt = apply_filters('the_excerpt', $post->post_excerpt);
        } else {
            $excerpt = wp_trim_words($content, 30, '...'); // Generate excerpt with 30 words
        }

        $posts_data[] = (object) array(
            'id'         => $post->ID,
            'title'      => $post->post_title, 
            'link'       => get_permalink($post->ID),
            'content'    => $content, 
            'excerpt'    => $excerpt, 
            'categories' => $categories_data,
        );
    }

    return $posts_data;
}

function custom_api_posts_routes() {
    register_rest_route(
        'custom/v1',
        '/filter',
        array(
            'methods'             => 'GET',
            'callback'            => 'custom_api_post_filter_callback',
            'permission_callback' => '__return_true',
        )
    );
}


// add_action('rest_api_init', 'custom_api_posts_routes');








// Begin function to check for updates to plugin
require_once "digimod-update-check.php";

add_action( 'init', 'digimod_theme_assets_update_check_init' );
function digimod_theme_assets_update_check_init(){
    if(class_exists('digimod_plugin_update_check')){
        new digimod_plugin_update_check(__FILE__, plugin_basename(__FILE__) );
    }
}
//End update check code.