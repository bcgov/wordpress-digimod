<?php

/**
 * Plugin Name: DIGIMOD - Block Theme Frontend Enhancements
 * Description: A plugin to load custom scripts, styles and theme settings to augment the default BCGov Block Theme capabilities
 * Version: 1.1.5
 * Author: Digimod
 * License: GPL-2.0+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 * Repository: https://github.com/bcgov/wordpress-digimod/tree/main/digimod-theme-assets
 * Plugin URI: https://github.com/bcgov/wordpress-digimod/tree/main/digimod-theme-assets
 * Update URI: https://raw.githubusercontent.com/bcgov/wordpress-digimod/main/digimod-theme-assets/index.php
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit('Direct access denied.');
}

/**
 * Load public and admin assets.
 * 
 * @return void
 */
function custom_assets_loader()
{
    $plugin_dir = plugin_dir_path(__FILE__);
    $assets_dir = $plugin_dir . 'dist/assets/';

    $public_css_files = glob($assets_dir . 'public*.css');
    $public_js_files = glob($assets_dir . 'public*.js');

    $admin_css_files = glob($assets_dir . 'admin*.css');
    $admin_js_files = glob($assets_dir . 'admin*.js');

    // Load public CSS and JS files
    if (!is_admin()) {
        foreach ($public_css_files as $file) {
            $file_url = plugins_url(str_replace($plugin_dir, '', $file), __FILE__);
            wp_enqueue_style('custom-public-' . basename($file, '.css'), $file_url);
        }

        foreach ($public_js_files as $file) {
            $file_url = plugins_url(str_replace($plugin_dir, '', $file), __FILE__);
            wp_enqueue_script('custom-public-' . basename($file, '.js'), $file_url, [], false, true);
        }
    } else {
        // Load admin CSS and JS files
        foreach ($admin_css_files as $file) {
            $file_url = plugins_url(str_replace($plugin_dir, '', $file), __FILE__);
            wp_enqueue_style('custom-admin-' . basename($file, '.css'), $file_url);
        }

        foreach ($admin_js_files as $file) {
            $file_url = plugins_url(str_replace($plugin_dir, '', $file), __FILE__);
            wp_enqueue_script('custom-admin-' . basename($file, '.js'), $file_url, [], false, true);
        }
    }
}

add_action('wp_enqueue_scripts', 'custom_assets_loader');
add_action('admin_enqueue_scripts', 'custom_assets_loader');


/**
 * Modify block patterns by removing patterns and empty categories.
 *
 * This function takes an array of block patterns and removes specific patterns
 * as well as entire categories if they become empty after removal.
 *
 */
function digimod_plugin_modify_block_patterns($block_patterns)
{
    // Define the patterns to be removed. These are found at line 183: $block_patterns = [...
    // https://github.com/bcgov/bcgov-wordpress-block-theme/blob/development/src/Actions/PatternsSetup.php
    // in:  public function get_block_patterns(): array {
    $patterns_to_remove = array(
        'header-default',
        'footer-default',
        'bcgov-accordion-with-media-text',
        'bcgov-accordion-with-tables',
        'bcgov-alternating-cards',
        'bcgov-card-image-overlay',
        'bcgov-card-image-under-2-up',
        'bcgov-card-with-two-images',
        'bcgov-cards-portrait-3-up',
        'bcgov-detail-card-with-icons',
        'bcgov-general-banner',
        'bcgov-hero-banner',
        'bcgov-long-card',
        'bcgov-quote',
        'bcgov-small-quote-image',
        'bcgov-sequence-steps',
        'general-breadcrumb-nav',
        'general-hero',
        'query-grid',
        'bcgov-page-layout-example',
    );

    // Traverse the block patterns
    foreach ($block_patterns as $category => &$patterns) {

        if (is_string($patterns)) {
            // If it's a string, check if it's in the patterns to remove
            if (in_array($patterns, $patterns_to_remove, true)) {
                unset($block_patterns[$category]);
            }
        } elseif (is_array($patterns)) {
            // If it's an array, iterate through each pattern
            foreach ($patterns as $pattern_key => $pattern) {
                // Check if the pattern should be removed
                if (in_array($pattern_key, $patterns_to_remove, true)) {
                    unset($patterns[$pattern_key]);
                }
            }

            // If a category is empty after removal, remove the entire category
            if (empty($patterns)) {
                unset($block_patterns[$category]);
            }
        }
    }

    // Return the modified block patterns
    return $block_patterns;
}

add_filter('bcgov_blocks_theme_block_patterns', 'digimod_plugin_modify_block_patterns');

/* 
 * Remove Block Theme categories if patterns still exist. 
 * Causes uncategorised patterns to be displayed.
 */
function digimod_plugin_modify_block_pattern_categories($block_pattern_categories)
{
    // Modify or remove elements from $block_patterns as needed
    unset($block_pattern_categories['bcgov-blocks-theme-general']);
    unset($block_pattern_categories['bcgov-blocks-theme-header-footer']);
    unset($block_pattern_categories['bcgov-blocks-theme-page-layouts']);
    unset($block_pattern_categories['bcgov-blocks-theme-query']);

    // Return the modified block patterns
    return $block_pattern_categories;
}

// add_filter('bcgov_blocks_theme_block_pattern_categories', 'digimod_plugin_modify_block_pattern_categories');



/**
 * Load the Digimod theme.json and update the provided theme.json object.
 * 
 * Retrieves the contents of the 'theme.json' file contains configuration settings for the Digimod theme.
 * 
 * @return object The updated theme.json object.
 */
function filter_theme_json_theme($theme_json)
{

    $plugin_theme_json_path = trailingslashit(plugin_dir_path(__FILE__)) . 'theme/theme.json';
    $plugin_theme_json = json_decode(file_get_contents($plugin_theme_json_path), true);

    return $theme_json->update_with($plugin_theme_json);
}

add_filter('wp_theme_json_data_theme', 'filter_theme_json_theme');


// VUE APP

// Register block to load the Vue.js app
function vuejs_wordpress_block_plugin()
{
    wp_enqueue_script(
        'digimod-plugin/custom-filter-block',
        plugin_dir_url(__FILE__) . 'blocks/vue-blocks/custom-filter-vue-block.js',
        array('wp-blocks', 'wp-element', 'wp-editor')
    );

    // wp_enqueue_script(
    //     'digimod-plugin/post-filter-block',
    //     plugin_dir_url(__FILE__) . 'blocks/vue-blocks/post-filter-vue-block.js',
    //     ['wp-blocks', 'wp-element', 'wp-editor']
    // );
}

add_action('enqueue_block_editor_assets', 'vuejs_wordpress_block_plugin');

// this loads vue app assets onto the client: todo: this happens for all pages, not just when the block is used
function vuejs_app_plugin()
{
    $plugin_dir = plugin_dir_path(__FILE__);
    $assets_dir = $plugin_dir . 'dist/assets/';

    $public_css_files = glob($assets_dir . 'vue*.css');
    // $public_js_files = glob( $assets_dir . 'vue*.js' );

    if (is_admin()) {
        foreach ($public_css_files as $file) {
            $file_url = plugins_url(str_replace($plugin_dir, '', $file), __FILE__);
            wp_enqueue_style('vue-app-' . basename($file, '.css'), $file_url);
        }
    }
}

add_action('enqueue_block_editor_assets', 'vuejs_app_plugin');


// load vue app assets, only when the block is used on the page
function vuejs_post_filter_app_dynamic_block_plugin($attributes)
{

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


function vuejs_custom_app_dynamic_block_plugin($attributes)
{
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
        wp_enqueue_script('vue-app-' . basename($file, '.js'), $file_url, [], false, true);
    }

    // Access the 'columns' attribute
    $columns = isset($attributes['columns']) ? $attributes['columns'] : 3;  // Fallback to '3' if not set

    $postType = isset($attributes['postType']) ? $attributes['postType'] : 'wcag-card';

    $postTypeLabel = isset($attributes['postTypeLabel']) ? $attributes['postTypeLabel'] : 'WCAG card';

    $className = isset($attributes['className']) ? $attributes['className'] : '';

    // Add the 'data-columns' attribute to the output div
    return '<div id="app" class="' . esc_attr($className) . '" data-columns="' . esc_attr($columns) . '"  data-post-type="' . esc_attr($postType) . '" data-post-type-label="' . esc_attr($postTypeLabel) . '">Loading...</div>';
}

function vuejs_app_plugin_block_init()
{

    register_block_type('digimod-plugin/custom-filter-block', [
        'render_callback' => 'vuejs_custom_app_dynamic_block_plugin',
    ]);

    // register_block_type('digimod-plugin/post-filter-block', [
    //     'render_callback' => 'vuejs_post_filter_app_dynamic_block_plugin',
    // ]);
}

add_action('init', 'vuejs_app_plugin_block_init');


function custom_api_post_filter_callback()
{
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

function custom_api_posts_routes()
{
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


/**
 * Protect the excerpt for protected pages on search results
 */
function digimod_theme_assets_protect_excerpt( $excerpt, $post ) {
    if(is_search()){
        $post_excerpt = $post->post_excerpt ?
            $excerpt :
            wp_trim_excerpt('', $post);
        $post_is_restricted = custom_redirect_to_login_check_if_url_in_list(get_permalink($post));

        $result_content = '';
        if($post_is_restricted){
            if( is_user_logged_in() ){
                $result_content .= $post_excerpt;
            }else{
                $result_content .= ' <p>' . __('There is no excerpt because this is a protected post. ') . '</p>';
            }

        }else{
            $result_content .= $post_excerpt;         
        }  
        return $result_content;
    }

    return $excerpt;
}
add_filter( 'get_the_excerpt', 'digimod_theme_assets_protect_excerpt', 10,2);



/**
 *  Override the filter so that it looks for the search results template inside of our plugin folder
 */
function portfolio_page_template(){
    return plugin_dir_path(__FILE__) .'theme/templates/search-results.php';
}
add_filter( 'searchwp_live_search_results_template', 'portfolio_page_template', 99 );


/** 
 * Provide for the ability to change block html content.
 *  Used to add attributes to the search results post content.
 */
function digimod_theme_assets_render_block(string $block_content, array $block): string {
    if(is_search()){
        if ( isset( $block['blockName'] )){
            if($block['blockName'] === 'core/post-title'){

                $html = str_replace(
                    [
                        'class="wp-block-post-title"',
                    ],
                    [
                        'class="wp-block-post-title" title="private"'
                    ],
                    $block_content
                );
                return $html;

            }elseif($block['blockName'] === 'core/post-excerpt'){
                $html = str_replace(
                    [
                        'class="wp-block-post-excerpt"',
                    ],
                    [
                        'class="wp-block-post-excerpt" title="private"'
                    ],
                    $block_content
                );
                return $html;
            }
        }
    }

    return $block_content;
}
add_filter('render_block', 'digimod_theme_assets_render_block', null, 2);



// Begin function to check for updates to plugin
require_once "digimod-update-check.php";

add_action('init', 'digimod_theme_assets_update_check_init');
function digimod_theme_assets_update_check_init()
{
    if (class_exists('digimod_plugin_update_check')) {
        new digimod_plugin_update_check(__FILE__, plugin_basename(__FILE__));
    }
}
//End update check code.