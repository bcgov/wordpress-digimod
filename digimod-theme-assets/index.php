<?php
/**
 * Plugin Name: DIGIMOD - Block Theme Frontend Enhancements
 * Description: A plugin to load custom scripts, styles and theme settings to augment the default BCGov Block Theme capabilities
 * Version: 1.6.1
 * Author: Digimod
 * License: GPL-2.0+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 * Repository: https://github.com/bcgov/wordpress-digimod/tree/main/digimod-theme-assets
 * Plugin URI: https://github.com/bcgov/wordpress-digimod/tree/main/digimod-theme-assets
 * Update URI: https://raw.githubusercontent.com/bcgov/wordpress-digimod/main/digimod-theme-assets/index.php
 *
 * @package Bcgov\DigitalGov
 */


// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
    exit( 'Direct access denied.' );
}


// Load the nessesary classes as we dont have a proper build script on the server side deployment to make use of the composer/vendor/autoloader.
require_once __DIR__ . '/Src/Bcgov/DigitalGov/Plugin.php';
require_once __DIR__ . '/Src/Bcgov/DigitalGov/Blocks.php';
require_once __DIR__ . '/Src/Bcgov/DigitalGov/Search.php';
require_once __DIR__ . '/Src/Bcgov/DigitalGov/SearchResultsBlock.php';



/**
 * Begins execution of the plugin.
 *
 * @since    1.0.0
 */
function run_diggov() {
	if ( class_exists( 'Bcgov\DigitalGov\Plugin' ) ) {
		new Bcgov\DigitalGov\Plugin();

	} else {
		echo '<!-- Unable to run plugin -->';
    }
}

/** This is to ensure that the common-plugin gets loaded before this plugin, otherwise admin functions will not work. */
add_action(
    'plugins_loaded',
    function () {
		run_diggov();
	}
);


/**
 * Load public and admin assets.
 *
 * @return void
 */
function custom_assets_loader() {
    $plugin_dir = plugin_dir_path( __FILE__ );
    $assets_dir = $plugin_dir . 'dist/assets/';

	$plugin_data    = get_plugin_data( $plugin_dir . 'index.php' );
	$plugin_version = $plugin_data['Version'];

    $public_css_files = glob( $assets_dir . 'public*.css' );
    $public_js_files  = glob( $assets_dir . 'public*.js' );

    $admin_css_files = glob( $assets_dir . 'admin*.css' );
    $admin_js_files  = glob( $assets_dir . 'admin*.js' );

    // Load public CSS and JS files.
    if ( ! is_admin() ) {
        foreach ( $public_css_files as $file ) {
            $file_url = plugins_url( str_replace( $plugin_dir, '', $file ), __FILE__ );
            wp_enqueue_style( 'custom-public-' . basename( $file, '.css' ), $file_url, [], $plugin_version );
        }

        foreach ( $public_js_files as $file ) {
            $file_url = plugins_url( str_replace( $plugin_dir, '', $file ), __FILE__ );
            wp_enqueue_script( 'custom-public-' . basename( $file, '.js' ), $file_url, [], $plugin_version, true );
        }
    } else {
        // Load admin CSS and JS files.
        foreach ( $admin_css_files as $file ) {
            $file_url = plugins_url( str_replace( $plugin_dir, '', $file ), __FILE__ );
            wp_enqueue_style( 'custom-admin-' . basename( $file, '.css' ), $file_url, [], $plugin_version );
        }

        foreach ( $admin_js_files as $file ) {
            $file_url = plugins_url( str_replace( $plugin_dir, '', $file ), __FILE__ );
            wp_enqueue_script( 'custom-admin-' . basename( $file, '.js' ), $file_url, [], $plugin_version, true );
        }
    }
}

add_action( 'wp_enqueue_scripts', 'custom_assets_loader' );
add_action( 'admin_enqueue_scripts', 'custom_assets_loader' );


/**
 * Modify block patterns by removing patterns and empty categories.
 *
 * This function takes an array of block patterns and removes specific patterns.
 * as well as entire categories if they become empty after removal.
 *
 * @param array $block_patterns Block patterns to adjust.
 */
function digimod_plugin_modify_block_patterns( $block_patterns ) {
    // Define the patterns to be removed. These are found at line 183: $block_patterns = [...
    // https://github.com/bcgov/bcgov-wordpress-block-theme/blob/development/src/Actions/PatternsSetup.php .
    // in:  public function get_block_patterns(): array { .
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

    // Traverse the block patterns.
    foreach ( $block_patterns as $category => &$patterns ) {

        if ( is_string( $patterns ) ) {
            // If it's a string, check if it's in the patterns to remove.
            if ( in_array( $patterns, $patterns_to_remove, true ) ) {
                unset( $block_patterns[ $category ] );
            }
        } elseif ( is_array( $patterns ) ) {
            // If it's an array, iterate through each pattern.
            foreach ( $patterns as $pattern_key => $pattern ) {
                // Check if the pattern should be removed.
                if ( in_array( $pattern_key, $patterns_to_remove, true ) ) {
                    unset( $patterns[ $pattern_key ] );
                }
            }

            // If a category is empty after removal, remove the entire category.
            if ( empty( $patterns ) ) {
                unset( $block_patterns[ $category ] );
            }
        }
    }

    // Return the modified block patterns.
    return $block_patterns;
}

add_filter( 'bcgov_blocks_theme_block_patterns', 'digimod_plugin_modify_block_patterns' );

/**
 * Remove Block Theme categories if patterns still exist.
 * Causes uncategorised patterns to be displayed.
 *
 * @param array $block_pattern_categories The block pattern categories.
 */
function digimod_plugin_modify_block_pattern_categories( $block_pattern_categories ) {
    // Modify or remove elements from $block_patterns as needed.
    unset( $block_pattern_categories['bcgov-blocks-theme-general'] );
    unset( $block_pattern_categories['bcgov-blocks-theme-header-footer'] );
    unset( $block_pattern_categories['bcgov-blocks-theme-page-layouts'] );
    unset( $block_pattern_categories['bcgov-blocks-theme-query'] );

    // Return the modified block patterns.
    return $block_pattern_categories;
}
// phpcs:ignore
// add_filter('bcgov_blocks_theme_block_pattern_categories', 'digimod_plugin_modify_block_pattern_categories');



/**
 * Load the Digimod theme.json and update the provided theme.json object.
 *
 * @param WP_Theme_JSON_Data $theme_json The theme JSON data object.
 * @return WP_Theme_JSON_Data The updated theme JSON object.
 */
function filter_theme_json_theme( $theme_json ) {

	static $plugin_theme_json = null;
	static $loaded            = false;

	if ( ! $loaded ) {
		$loaded = true;

		$plugin_theme_json_path = plugin_dir_path( __FILE__ ) . 'theme/theme.json';

		if ( ! is_readable( $plugin_theme_json_path ) ) {
			$plugin_theme_json = array();
			return $theme_json;
		}

		$plugin_theme_json = wp_json_file_decode(
			$plugin_theme_json_path,
			array(
				'associative' => true,
			)
		);

		if ( ! is_array( $plugin_theme_json ) ) {
			$plugin_theme_json = array();
		}
	}

	if ( ! empty( $plugin_theme_json ) ) {
		$theme_json->update_with( $plugin_theme_json );
	}

	return $theme_json;
}

add_filter( 'wp_theme_json_data_theme', 'filter_theme_json_theme' );


// VUE APP.

/**
 * Load shared Vue block styles in the block editor.
 */
function vuejs_app_plugin() {
    $plugin_dir = plugin_dir_path( __FILE__ );
    $assets_dir = $plugin_dir . 'dist/assets/';

	$plugin_data    = get_plugin_data( $plugin_dir . 'index.php' );
	$plugin_version = $plugin_data['Version'];

    $public_css_files = glob( $assets_dir . 'vue*.css' );
    //phpcs:ignore
    // $public_js_files = glob( $assets_dir . 'vue*.js' );  

    if ( is_admin() ) {
        foreach ( $public_css_files as $file ) {
            $file_url = plugins_url( str_replace( $plugin_dir, '', $file ), __FILE__ );
            wp_enqueue_style( 'vue-app-' . basename( $file, '.css' ), $file_url, [], $plugin_version );
        }
    }
}

add_action( 'enqueue_block_editor_assets', 'vuejs_app_plugin' );

//phpcs:disable
/**
 * Load vue app assets, only when the block is used on the page.
 *
 * @param array $attributes The attributes.
 */
/*
function vuejs_post_filter_app_dynamic_block_plugin( $attributes ) {

    $plugin_dir = plugin_dir_path( __FILE__ );
    $assets_dir = $plugin_dir . 'dist/assets/';

    $public_css_files = glob( $assets_dir . 'vue*.css' );
    $public_js_files  = glob( $assets_dir . 'vue*.js' );

    foreach ( $public_css_files as $file ) {
        $file_url = plugins_url( str_replace( $plugin_dir, '', $file ), __FILE__ );
        wp_enqueue_style( 'vue-app-' . basename( $file, '.css' ), $file_url );
    }

    foreach ( $public_js_files as $file ) {
        $file_url = plugins_url( str_replace( $plugin_dir, '', $file ), __FILE__ );
        wp_enqueue_script( 'vue-app-' . basename( $file, '.js' ), $file_url, [ 'bcgov-block-theme-public' ], false, true ); // Sets the dependency to Block Theme to enqueue after.
    }

    // Set up the attributes passed to the Vue frontend, with defaults.
    $columns           = isset( $attributes['columns'] ) ? $attributes['columns'] : 3;  // Fallback to '3' if not set.
    $className         = isset( $attributes['className'] ) ? $attributes['className'] : '';
    $postType          = isset( $attributes['postType'] ) ? $attributes['postType'] : 'posts';
    $postTypeLabel     = isset( $attributes['postTypeLabel'] ) ? $attributes['postTypeLabel'] : 'Posts';
    $headingSize       = isset( $attributes['headingSize'] ) ? $attributes['headingSize'] : 'h3';
    $headingLinkActive = isset( $attributes['headingLinkActive'] ) ? $attributes['headingLinkActive'] : 'false';
    $useExcerpt        = isset( $attributes['useExcerpt'] ) ? $attributes['useExcerpt'] : 'excerpt';

    // Add the 'data-columns' attribute to the output div.
    return '<div id="postFilterApp" class="' . esc_attr( $className ) . '" data-columns="' . esc_attr( $columns ) . '" data-post-type="' . esc_attr( $postType ) . '"  data-heading-size="' . esc_attr( $headingSize ) . '" data-heading-link-active="' . esc_attr( $headingLinkActive ) . '" data-use-excerpt="' . esc_attr( $useExcerpt ) . '" data-post-type-label="' . esc_attr( $postTypeLabel ) . '">Loading...</div>';
}
*/
//phpcs:enable

/**
 * Allow for overriding a js script embed tag to embed as a module.
 *   Used for Vue/Vite to be loaded as a module and not override the global namespace.
 *   Based on https://stackoverflow.com/questions/76573766/how-to-properly-create-wp-enqueue-and-functions-script-to-run-vite-frontend .
 *
 * @param bool $script_handle The name of the script to override.
 */
function script_type_module( $script_handle = false ): string {
    // change the script type to module.
    add_filter(
        'script_loader_tag',
        function ( $tag, $handle, $src ) use ( $script_handle ) {

			if ( $script_handle !== $handle ) {
				return $tag;
			}

			// return the new script module type tag.
			return '<script type="module" src="' . esc_url( $src ) . '" id="' . $handle . '-js"></script>'; //phpcs:ignore WordPress.WP.EnqueuedResources.NonEnqueuedScript
		},
        10,
        3
    );

	return false;
}


/**
 * Enqueue the shared Vue bundle assets.
 *
 * @param string $plugin_dir Plugin directory path.
 * @param string $plugin_version Plugin version.
 */
function digimod_enqueue_vue_bundle_assets( $plugin_dir, $plugin_version ) {
    $assets_dir = $plugin_dir . 'dist/assets/';

    $public_css_files = glob( $assets_dir . 'vue*.css' );
    $public_js_files  = glob( $assets_dir . 'vue*.js' );

    foreach ( $public_css_files as $file ) {
        $file_url = plugins_url( str_replace( $plugin_dir, '', $file ), __FILE__ );
        wp_enqueue_style( 'vue-app-' . basename( $file, '.css' ), $file_url, array(), $plugin_version );
    }

    foreach ( $public_js_files as $file ) {
        $file_url = plugins_url( str_replace( $plugin_dir, '', $file ), __FILE__ );
        $handle   = 'vue-app-' . basename( $file, '.js' );

        wp_enqueue_script( $handle, $file_url, array(), $plugin_version, true );
        script_type_module( $handle );
    }
}

/**
 * Extend the glossary block safe CSS property allowlist.
 *
 * WordPress sanitizes inline style values separately from allowed tag
 * attributes, so this keeps commonly used logical and layout properties
 * available on visitor-facing output.
 *
 * @param array $styles Allowed safe CSS properties.
 *
 * @return array
 */
function digimod_glossary_safe_style_css( $styles ) {
    $glossary_styles = array(
        'align-content',
        'align-items',
        'align-self',
        'column-gap',
        'gap',
        'inset',
        'inset-block',
        'inset-block-end',
        'inset-block-start',
        'inset-inline',
        'inset-inline-end',
        'inset-inline-start',
        'justify-content',
        'justify-items',
        'justify-self',
        'margin-block',
        'margin-block-end',
        'margin-block-start',
        'margin-inline',
        'margin-inline-end',
        'margin-inline-start',
        'padding-block',
        'padding-block-end',
        'padding-block-start',
        'padding-inline',
        'padding-inline-end',
        'padding-inline-start',
        'place-content',
        'place-items',
        'place-self',
        'row-gap',
        'text-wrap',
    );

    return array_unique( array_merge( $styles, $glossary_styles ) );
}

/**
 * Sanitize limited glossary block HTML input.
 *
 * @param string $content Glossary block field content.
 *
 * @return string
 */
function digimod_prepare_limited_glossary_markup( $content ) {
    if ( ! is_string( $content ) ) {
        return '';
    }

    $content = trim( $content );

    if ( '' === $content ) {
        return '';
    }

    if ( ! preg_match( '/<[a-z!\/]/i', $content ) ) {
        $content = wpautop( $content );
    }

    $allowed_tags = array(
        'p'    => array(
            'style' => true,
        ),
        'div'  => array(
            'style' => true,
        ),
        'span' => array(
            'style' => true,
        ),
        'br'   => array(),
        'a'    => array(
            'href'   => true,
            'target' => true,
            'rel'    => true,
            'title'  => true,
            'style'  => true,
        ),
    );

    add_filter( 'safe_style_css', 'digimod_glossary_safe_style_css' );

    $sanitized_content = wp_kses( $content, $allowed_tags, array( 'http', 'https', 'mailto', 'tel' ) );

    remove_filter( 'safe_style_css', 'digimod_glossary_safe_style_css' );

    return $sanitized_content;
}


/**
 * Enqueue files for the vue app.
 *
 * @param array $attributes The attributes.
 */
function vuejs_custom_app_dynamic_block_plugin( $attributes ) {
    $plugin_dir = plugin_dir_path( __FILE__ );

	$plugin_data    = get_plugin_data( $plugin_dir . 'index.php' );
	$plugin_version = $plugin_data['Version'];
	$instance_id    = function_exists( 'wp_unique_id' ) ? wp_unique_id( 'digimod-wcag-filter-' ) : uniqid( 'digimod-wcag-filter-', false );

    digimod_enqueue_vue_bundle_assets( $plugin_dir, $plugin_version );

    // Access the 'columns' attribute.
    $columns = isset( $attributes['columns'] ) ? $attributes['columns'] : 3;  // Fallback to '3' if not set.

    $postType = isset( $attributes['postType'] ) ? $attributes['postType'] : 'wcag-card';

    $postTypeLabel = isset( $attributes['postTypeLabel'] ) ? $attributes['postTypeLabel'] : 'WCAG card';

    $className = isset( $attributes['className'] ) ? $attributes['className'] : '';

    $class_names = trim( 'digimod-vue-app-root digimod-wcag-filter-app ' . $className );

    return '<div class="' . esc_attr( $class_names ) . '" data-vue-app="wcag-filter" data-instance-id="' . esc_attr( $instance_id ) . '" data-columns="' . esc_attr( $columns ) . '" data-post-type="' . esc_attr( $postType ) . '" data-post-type-label="' . esc_attr( $postTypeLabel ) . '">Loading...</div>';
}

/**
 * Enqueue files for the filterable Standards Vue app.
 *
 * @param array $attributes Block attributes.
 *
 * @return string
 */
function digimod_standards_filter_dynamic_block_plugin( $attributes ) {
	$plugin_dir = plugin_dir_path( __FILE__ );

	$plugin_data    = get_plugin_data( $plugin_dir . 'index.php' );
	$plugin_version = $plugin_data['Version'];
	$instance_id    = function_exists( 'wp_unique_id' ) ? wp_unique_id( 'digimod-standards-filter-' ) : uniqid( 'digimod-standards-filter-', false );

	digimod_enqueue_vue_bundle_assets( $plugin_dir, $plugin_version );

	$columns                     = isset( $attributes['columns'] ) ? absint( $attributes['columns'] ) : 3;
	$columns                     = in_array( $columns, array( 2, 3, 4 ), true ) ? $columns : 3;
	$card_heading_level          = isset( $attributes['cardHeadingLevel'] ) ? $attributes['cardHeadingLevel'] : 'h3';
	$card_heading_level          = in_array( $card_heading_level, array( 'h2', 'h3', 'h4', 'h5', 'h6' ), true ) ? $card_heading_level : 'h3';
	$card_heading_font_size      = isset( $attributes['cardHeadingFontSize'] ) ? $attributes['cardHeadingFontSize'] : '';
	$card_heading_font_size_slug = isset( $attributes['cardHeadingFontSizeSlug'] ) ? $attributes['cardHeadingFontSizeSlug'] : '';
	$class_name                  = isset( $attributes['className'] ) ? $attributes['className'] : '';
	$class_names                 = trim( 'digimod-vue-app-root digimod-standards-filter-block ' . $class_name );

	return '<div class="' . esc_attr( $class_names ) . '" data-vue-app="standards-filter" data-instance-id="' . esc_attr( $instance_id ) . '" data-columns="' . esc_attr( $columns ) . '" data-card-heading-level="' . esc_attr( $card_heading_level ) . '" data-card-heading-font-size="' . esc_attr( $card_heading_font_size ) . '" data-card-heading-font-size-slug="' . esc_attr( $card_heading_font_size_slug ) . '">Loading Standards...</div>';
}

/**
 * Enqueue files for the glossary Vue app.
 *
 * @param array $attributes Block attributes.
 *
 * @return string
 */
function digimod_glossary_dynamic_block_plugin( $attributes ) {
    $plugin_dir = plugin_dir_path( __FILE__ );

	$plugin_data    = get_plugin_data( $plugin_dir . 'index.php' );
	$plugin_version = $plugin_data['Version'];
	$instance_id    = function_exists( 'wp_unique_id' ) ? wp_unique_id( 'digimod-glossary-' ) : uniqid( 'digimod-glossary-', false );

    digimod_enqueue_vue_bundle_assets( $plugin_dir, $plugin_version );

    $default_attributes = array(
		'title'             => 'Glossary',
		'titleHeadingLevel' => 'h1',
		'intro'             => "It's important to have a shared vocabulary. The official CSBC glossary is the definitive guide for all BC Public Service employees.",
		'searchToolsTitle'  => 'Search tools',
		'showAllLabel'      => 'Show all',
		'showTagCounts'     => true,
		'browseTitle'       => 'Jump to',
		'suggestTitle'      => 'Suggest a new glossary term',
		'suggestBody'       => 'Send us your submission for review.',
		'suggestEmail'      => 'do.contentdesign@gov.bc.ca',
		'className'         => '',
    );

	$attributes          = wp_parse_args( $attributes, $default_attributes );
	$class_names         = trim( 'digimod-vue-app-root digimod-glossary-block ' . $attributes['className'] );
	$show_tag_counts     = ! empty( $attributes['showTagCounts'] ) ? 'true' : 'false';
	$title_heading_level = in_array( $attributes['titleHeadingLevel'], array( 'h1', 'h2', 'h3', 'h4' ), true ) ? $attributes['titleHeadingLevel'] : 'h1';
	$intro_markup        = digimod_prepare_limited_glossary_markup( $attributes['intro'] );
	$suggest_body_markup = digimod_prepare_limited_glossary_markup( $attributes['suggestBody'] );

	return '<div class="' . esc_attr( $class_names ) . '" data-vue-app="glossary" data-instance-id="' . esc_attr( $instance_id ) . '" data-title="' . esc_attr( $attributes['title'] ) . '" data-title-heading-level="' . esc_attr( $title_heading_level ) . '" data-intro="' . esc_attr( $intro_markup ) . '" data-search-tools-title="' . esc_attr( $attributes['searchToolsTitle'] ) . '" data-show-all-label="' . esc_attr( $attributes['showAllLabel'] ) . '" data-show-tag-counts="' . esc_attr( $show_tag_counts ) . '" data-browse-title="' . esc_attr( $attributes['browseTitle'] ) . '" data-suggest-title="' . esc_attr( $attributes['suggestTitle'] ) . '" data-suggest-body="' . esc_attr( $suggest_body_markup ) . '" data-suggest-email="' . esc_attr( $attributes['suggestEmail'] ) . '">Loading glossary...</div>';
}

/**
 * Initialize the blocks for the vue app.
 */
function vuejs_app_plugin_block_init() {

    register_block_type(
        'digimod-plugin/custom-filter-block',
        [
			'render_callback' => 'vuejs_custom_app_dynamic_block_plugin',
		]
    );

    register_block_type(
        'digimod-plugin/glossary-block',
        array(
			'render_callback' => 'digimod_glossary_dynamic_block_plugin',
		)
    );

	register_block_type(
		'digimod-plugin/standards-filter-block',
		array(
			'render_callback' => 'digimod_standards_filter_dynamic_block_plugin',
		)
	);

    // phpcs:disable
    /* 
    register_block_type('digimod-plugin/post-filter-block', [
     'render_callback' => 'vuejs_post_filter_app_dynamic_block_plugin',
     ]);
    */
    // phpcs:enable
}

add_action( 'init', 'vuejs_app_plugin_block_init' );


/**
 * Custom post filter for VUE app
 */
function custom_api_post_filter_callback() {
    $args = array(
        'post_type'      => 'post',
        'posts_per_page' => -1,
        'post_status'    => 'publish',
    );

    $projects = new \WP_Query( $args );

    $posts_data = [];

    foreach ( $projects->posts as $post ) {
        $categories = wp_get_post_categories( $post->ID, array( 'fields' => 'all' ) );

        $categories_data = array();
        foreach ( $categories as $category ) {
            $categories_data[] = array(
                'id'   => $category->term_id,
                'name' => $category->name,
                'slug' => $category->slug,
            );
        }

        $content = apply_filters( 'the_content', $post->post_content );

        if ( ! empty( $post->post_excerpt ) ) {
            $excerpt = apply_filters( 'the_excerpt', $post->post_excerpt );
        } else {
            $excerpt = wp_trim_words( $content, 30, '...' ); // Generate excerpt with 30 words.
        }

        $posts_data[] = (object) array(
            'id'         => $post->ID,
            'title'      => $post->post_title,
            'link'       => get_permalink( $post->ID ),
            'content'    => $content,
            'excerpt'    => $excerpt,
            'categories' => $categories_data,
        );
    }

    return $posts_data;
}

/**
 * Return glossary entries for the Vue glossary block.
 *
 * @param WP_REST_Request $request Request object.
 *
 * @return WP_REST_Response
 */
function digimod_glossary_api_callback( $request ) {
    unset( $request );

    $query_args = array(
        'post_type'      => 'definitions',
        'posts_per_page' => -1,
        'post_status'    => 'publish',
        'orderby'        => 'title',
        'order'          => 'ASC',
    );

    if ( taxonomy_exists( 'glossary_settings' ) ) {
        $show_in_glossary_term = get_term_by( 'slug', 'show-in-glossary', 'glossary_settings' );

        if ( $show_in_glossary_term && ! is_wp_error( $show_in_glossary_term ) ) {
            $query_args['tax_query'] = array(
                array(
                    'taxonomy' => 'glossary_settings',
                    'field'    => 'slug',
                    'terms'    => array( 'show-in-glossary' ),
                ),
            );
        }
    }

    $definitions = get_posts( $query_args );

    $entries = array();

    foreach ( $definitions as $definition ) {
        setup_postdata( $definition );

        $terms      = get_the_terms( $definition, 'glossary_category' );
        $categories = array();

        if ( ! is_wp_error( $terms ) && ! empty( $terms ) ) {
            foreach ( $terms as $term ) {
                $categories[] = array(
                    'id'   => (int) $term->term_id,
                    'name' => $term->name,
                    'slug' => $term->slug,
                );
            }
        }

        $entries[] = array(
            'id'         => (int) $definition->ID,
            'title'      => get_the_title( $definition->ID ),
            'slug'       => $definition->post_name,
            'link'       => get_permalink( $definition->ID ),
            'content'    => apply_filters( 'the_content', $definition->post_content ),
            'categories' => $categories,
        );
    }

    wp_reset_postdata();

	return rest_ensure_response( $entries );
}

/**
 * Get a Standards ACF field value, preserving group/array values.
 *
 * @param int    $post_id    Post ID.
 * @param string $field_name Field name.
 *
 * @return mixed
 */
function digimod_standards_get_field_value( $post_id, $field_name ) {
	if ( function_exists( 'get_field' ) ) {
		return get_field( $field_name, $post_id );
	}

	return get_post_meta( $post_id, $field_name, true );
}

/**
 * Normalize a taxonomy term for the Standards API.
 *
 * @param WP_Term $term Taxonomy term.
 *
 * @return array
 */
function digimod_standards_normalize_term( $term ) {
	return array(
		'id'     => (int) $term->term_id,
		'name'   => $term->name,
		'slug'   => $term->slug,
		'parent' => (int) $term->parent,
	);
}

/**
 * Normalize a Standard resource group from ACF.
 *
 * @param array $resource_group Resource group values.
 * @param int   $index    Resource number.
 *
 * @return array|null
 */
function digimod_standards_normalize_resource( $resource_group, $index ) {
	if ( ! is_array( $resource_group ) ) {
		return null;
	}

	$url = isset( $resource_group[ 'resource_' . $index . '_file_url' ] )
		? (string) $resource_group[ 'resource_' . $index . '_file_url' ]
		: '';
	$url = esc_url_raw( $url );

	if ( '' === $url ) {
		return null;
	}

	$label        = isset( $resource_group[ 'resource_' . $index . '_label' ] ) ? (string) $resource_group[ 'resource_' . $index . '_label' ] : '';
	$custom_label = isset( $resource_group[ 'resource_' . $index . '_custom_label' ] ) ? (string) $resource_group[ 'resource_' . $index . '_custom_label' ] : '';
	$details      = isset( $resource_group[ 'resource_' . $index . '_details' ] ) && is_array( $resource_group[ 'resource_' . $index . '_details' ] )
		? $resource_group[ 'resource_' . $index . '_details' ]
		: array();

	$label_names = array(
		'standard'       => 'Standard',
		'guidelines'     => 'Guidelines',
		'specifications' => 'Specifications',
		'outline'        => 'Outline',
		'memo'           => 'Memo',
		'other'          => $custom_label,
	);

	return array(
		'label'     => $label,
		'labelText' => isset( $label_names[ $label ] ) ? $label_names[ $label ] : $custom_label,
		'url'       => $url,
		'icon'      => isset( $details[ 'resource_' . $index . '_icon' ] ) ? (string) $details[ 'resource_' . $index . '_icon' ] : '',
		'filesize'  => isset( $details[ 'resource_' . $index . '_filesize' ] ) ? (string) $details[ 'resource_' . $index . '_filesize' ] : '',
	);
}

/**
 * Return Standards posts for the Vue filterable Standards block.
 *
 * @param WP_REST_Request $request Request object.
 *
 * @return WP_REST_Response
 */
function digimod_standards_api_callback( $request ) {
	unset( $request );

	$posts = get_posts(
		array(
			'post_type'      => 'standard',
			'posts_per_page' => -1,
			'post_status'    => 'publish',
			'orderby'        => 'title',
			'order'          => 'ASC',
		)
	);

	$standards = array();

	foreach ( $posts as $post ) {
		setup_postdata( $post );

		$post_id = (int) $post->ID;
		$meta_1  = digimod_standards_get_field_value( $post_id, 'meta_1' );
		$meta_1  = is_array( $meta_1 ) ? $meta_1 : array();

		$resource_setting = isset( $meta_1['add_resources'] ) ? (string) $meta_1['add_resources'] : 'show_0';
		$resource_count   = 0;

		if ( preg_match( '/^show_(\d+)$/', $resource_setting, $matches ) ) {
			$resource_count = min( 5, absint( $matches[1] ) );
		}

		$resources = array();

		for ( $resource_index = 1; $resource_index <= 5; $resource_index++ ) {
			if ( $resource_index > $resource_count ) {
				continue;
			}

			$resource = digimod_standards_normalize_resource(
				digimod_standards_get_field_value( $post_id, 'resource-' . $resource_index ),
				$resource_index
			);

			if ( null !== $resource ) {
				$resources[] = $resource;
			}
		}

		$categories     = array();
		$category_terms = get_the_terms( $post_id, 'standard_category' );
		$status         = null;
		$status_terms   = get_the_terms( $post_id, 'standard_status' );

		if ( ! is_wp_error( $category_terms ) && ! empty( $category_terms ) ) {
			foreach ( $category_terms as $category_term ) {
				$categories[] = digimod_standards_normalize_term( $category_term );
			}
		}

		if ( ! is_wp_error( $status_terms ) && ! empty( $status_terms ) ) {
			$status_term = reset( $status_terms );
			$parent_term = $status_term;

			if ( ! empty( $status_term->parent ) ) {
				$maybe_parent = get_term( $status_term->parent, 'standard_status' );

				if ( $maybe_parent && ! is_wp_error( $maybe_parent ) ) {
					$parent_term = $maybe_parent;
				}
			}

			$status = array(
				'id'        => (int) $status_term->term_id,
				'name'      => $status_term->name,
				'slug'      => $status_term->slug,
				'parent'    => digimod_standards_normalize_term( $parent_term ),
				'colorSlug' => $parent_term->slug,
			);
		}

		$standards[] = array(
			'id'           => $post_id,
			'title'        => get_the_title( $post_id ),
			'content'      => apply_filters( 'the_content', $post->post_content ),
			'standardCode' => isset( $meta_1['standard_code'] ) ? (string) $meta_1['standard_code'] : '',
			'resources'    => $resources,
			'categories'   => $categories,
			'status'       => $status,
		);
	}

	usort(
		$standards,
		function ( $standard_a, $standard_b ) {
			$code_a          = trim( (string) $standard_a['standardCode'] );
			$code_b          = trim( (string) $standard_b['standardCode'] );
			$numeric_code_a  = '' !== $code_a && is_numeric( $code_a );
			$numeric_code_b  = '' !== $code_b && is_numeric( $code_b );
			$code_comparison = 0;

			if ( $numeric_code_a && $numeric_code_b ) {
				$numeric_a       = (float) $code_a;
				$numeric_b       = (float) $code_b;
				$code_comparison = $numeric_a <=> $numeric_b;
			} else {
				$code_comparison = strnatcasecmp( $code_a, $code_b );
			}

			if ( 0 !== $code_comparison ) {
				return $code_comparison;
			}

			return strcasecmp( (string) $standard_a['title'], (string) $standard_b['title'] );
		}
	);

	wp_reset_postdata();

	return rest_ensure_response( $standards );
}

/**
 * Get a card field value from ACF or post meta.
 *
 * @param int    $post_id    Post ID.
 * @param string $field_name Field name.
 *
 * @return string
 */
function digimod_filter_cards_get_field_value( $post_id, $field_name ) {
    if ( function_exists( 'get_field' ) ) {
        $value = get_field( $field_name, $post_id );
    } else {
        $value = get_post_meta( $post_id, $field_name, true );
    }

    if ( ! is_scalar( $value ) ) {
        return '';
    }

    return (string) $value;
}

/**
 * Get normalized card taxonomy tag names.
 *
 * @param int    $post_id        Post ID.
 * @param string $taxonomy       Taxonomy name.
 * @param array  $excluded_terms Term names to omit.
 *
 * @return array
 */
function digimod_filter_cards_get_tags( $post_id, $taxonomy, $excluded_terms = array() ) {
    $terms = get_the_terms( $post_id, $taxonomy );

    if ( is_wp_error( $terms ) || empty( $terms ) ) {
        return array();
    }

    $tags = array();

    foreach ( $terms as $term ) {
        if ( in_array( $term->name, $excluded_terms, true ) ) {
            continue;
        }

        $tags[] = $term->name;
    }

    return $tags;
}

/**
 * Return normalized filter cards for the Vue card filter block.
 *
 * @param WP_REST_Request $request Request object.
 *
 * @return WP_REST_Response|WP_Error
 */
function digimod_filter_cards_api_callback( $request ) {
    $post_type = sanitize_key( $request->get_param( 'post_type' ) );

    $supported_post_types = array(
        'wcag-card'         => array(
            'query_post_type' => 'wcag-card',
            'taxonomy'        => 'wcag_tag',
            'excluded_terms'  => array(),
        ),
        'common-components' => array(
            'query_post_type' => 'common-component',
            'taxonomy'        => 'common_component_category',
            'excluded_terms'  => array( 'Active' ),
        ),
    );

    if ( ! isset( $supported_post_types[ $post_type ] ) ) {
        return new WP_Error(
            'digimod_filter_cards_invalid_post_type',
            'Unsupported card post type.',
            array( 'status' => 400 )
        );
    }

    $post_type_config = $supported_post_types[ $post_type ];

    if ( ! post_type_exists( $post_type_config['query_post_type'] ) ) {
        return rest_ensure_response( array() );
    }

    $posts = get_posts(
        array(
            'post_type'      => $post_type_config['query_post_type'],
            'posts_per_page' => -1,
            'post_status'    => 'publish',
            'orderby'        => 'title',
            'order'          => 'ASC',
        )
    );

    $cards = array();

    foreach ( $posts as $post ) {
        setup_postdata( $post );

        $post_id                 = (int) $post->ID;
        $description             = digimod_filter_cards_get_field_value( $post_id, 'description' );
        $card_link               = '';
        $team_name_ministry      = '';
        $success_criteria_number = '';
        $success_criteria_level  = '';

        if ( 'wcag-card' === $post_type ) {
            $card_link               = digimod_filter_cards_get_field_value( $post_id, 'card_hyperlink' );
            $success_criteria_number = digimod_filter_cards_get_field_value( $post_id, 'success_criteria_number' );
            $success_criteria_level  = digimod_filter_cards_get_field_value( $post_id, 'success_criteria_level' );
        }

        if ( 'common-components' === $post_type ) {
            $short_description  = digimod_filter_cards_get_field_value( $post_id, 'short_description' );
            $description        = ! empty( $short_description ) ? $short_description : $description;
            $team_name_ministry = digimod_filter_cards_get_field_value( $post_id, 'team_name_ministry' );
        }

        $cards[] = array(
            'id'                    => $post_id,
            'title'                 => get_the_title( $post_id ),
            'link'                  => get_permalink( $post_id ),
            'cardLink'              => $card_link,
            'description'           => $description,
            'teamNameMinistry'      => $team_name_ministry,
            'successCriteriaNumber' => $success_criteria_number,
            'successCriteriaLevel'  => $success_criteria_level,
            'tags'                  => digimod_filter_cards_get_tags( $post_id, $post_type_config['taxonomy'], $post_type_config['excluded_terms'] ),
        );
    }

    wp_reset_postdata();

    return rest_ensure_response( $cards );
}

/**
 * Custom API routes for the VUE app
 */
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

/**
 * Register REST routes for the Vue glossary block.
 */
function digimod_glossary_routes() {
    register_rest_route(
        'digimod/v1',
        '/glossary',
        array(
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => 'digimod_glossary_api_callback',
            'permission_callback' => '__return_true',
        )
    );

    register_rest_route(
        'digimod/v1',
        '/filter-cards',
        array(
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => 'digimod_filter_cards_api_callback',
            'permission_callback' => '__return_true',
            'args'                => array(
                'post_type' => array(
                    'required'          => true,
                    'sanitize_callback' => 'sanitize_key',
                ),
            ),
        )
    );

	register_rest_route(
		'digimod/v1',
		'/standards',
		array(
			'methods'             => WP_REST_Server::READABLE,
			'callback'            => 'digimod_standards_api_callback',
			'permission_callback' => '__return_true',
		)
	);
}

// phpcs:ignore
// add_action('rest_api_init', 'custom_api_posts_routes');
add_action( 'rest_api_init', 'digimod_glossary_routes' );


// Disable the conversion of unicode emoji to HTML by WordPress.
// Based on https://wordpress.stackexchange.com/questions/185577/disable-emojicons-introduced-with-wp-4-2/185578#185578.
/**
 * Disable WordPress emoji scripts and styles.
 */
function disable_wp_emojicons() {
	// Remove all actions related to emojis.
	remove_action( 'admin_print_styles', 'print_emoji_styles' );
	remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
	remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
    remove_action( 'wp_print_styles', 'print_emoji_styles' );
    remove_filter( 'wp_mail', 'wp_staticize_emoji_for_email' );
	remove_filter( 'the_content_feed', 'wp_staticize_emoji' );
	remove_filter( 'comment_text_rss', 'wp_staticize_emoji' );
}
add_action( 'init', 'disable_wp_emojicons' );


/**
 * Disable WordPress's default taxonomy metabox for the Status taxonomy.
 *
 * @param array  $args     Taxonomy registration arguments.
 * @param string $taxonomy Taxonomy name.
 */
function remove_standard_status_default_checkboxes( $args, $taxonomy ) {

	if ( 'standard_status' === $taxonomy ) {
		$args['meta_box_cb'] = false;
	}

	return $args;
}
add_filter( 'register_taxonomy_args', 'remove_standard_status_default_checkboxes', 10, 2 );

/**
 * Remove the default Gutenberg taxonomy panel for the Status taxonomy.
 */
function remove_standard_status_editor_checkboxes() {

	$taxonomy = 'standard_status';

	wp_add_inline_script(
		'wp-edit-post',
		sprintf(
			"wp.domReady(function() {
				wp.data.dispatch('core/edit-post').removeEditorPanel('taxonomy-panel-%s');

				var syncStandardStatusSelect = function() {
					var select = document.querySelector('select[name=\"tax_input[%s][]\"]');

					if (!select || select.dataset.digimodStatusSync) {
						return;
					}

					select.dataset.digimodStatusSync = 'true';
					select.addEventListener('change', function() {
						var selectedTerm = parseInt(select.value, 10);
						wp.data.dispatch('core/editor').editPost({ '%s': selectedTerm ? [selectedTerm] : [] });
					});

					var selectedTerm = parseInt(select.value, 10);
					wp.data.dispatch('core/editor').editPost({ '%s': selectedTerm ? [selectedTerm] : [] });
				};

				syncStandardStatusSelect();

				if ('undefined' !== typeof MutationObserver) {
					new MutationObserver(syncStandardStatusSelect).observe(document.body, { childList: true, subtree: true });
				}

				var requirementsLock = 'digimod-standard-requirements';
				var requirementsNotice = 'digimod-standard-requirements-notice';

				var syncStandardRequirements = function() {
					var editor = wp.data.select('core/editor');
					var dispatcher = wp.data.dispatch('core/editor');
					var currentPost = editor.getCurrentPost ? editor.getCurrentPost() : {};
					var currentPostType = editor.getCurrentPostType ? editor.getCurrentPostType() : currentPost.type;

					if ('standard' !== currentPostType) {
						return;
					}

					var currentStatus = editor.getCurrentPostAttribute('status') || currentPost.status;
					var postId = editor.getCurrentPostId ? editor.getCurrentPostId() : currentPost.id;
					var coreSelect = wp.data.select('core');
					var entityEdits = postId && coreSelect.getEntityRecordEdits
						? coreSelect.getEntityRecordEdits('postType', 'standard', postId)
						: {};
					var editedRecord = postId && coreSelect.getEditedEntityRecord
						? coreSelect.getEditedEntityRecord('postType', 'standard', postId)
						: null;
					var getTerms = function(taxonomy) {
						var editedTerms = editor.getEditedPostAttribute(taxonomy);

						if (Object.prototype.hasOwnProperty.call(entityEdits || {}, taxonomy)) {
							return entityEdits[taxonomy];
						}

						if (undefined !== editedTerms) {
							return editedTerms;
						}

						if (editedRecord && Object.prototype.hasOwnProperty.call(editedRecord, taxonomy)) {
							return editedRecord[taxonomy];
						}

						return editor.getCurrentPostAttribute(taxonomy) || [];
					};
					var categories = getTerms('standard_category');
					var statuses = getTerms('standard_status');
					var hasTerms = function(terms) {
						if (Array.isArray(terms)) {
							return terms.some(hasTerms);
						}

						if (!terms || 'object' !== typeof terms) {
							return !!terms;
						}

						return Object.keys(terms).some(function(key) {
							if ('id' === key || 'term_id' === key || /^\d+$/.test(key)) {
								return !!terms[key];
							}

							return Array.isArray(terms[key]) || 'object' === typeof terms[key]
								? hasTerms(terms[key])
								: false;
						});
					};
					var missingCategory = !hasTerms(categories);
					var missingStatus = !hasTerms(statuses);
					var missingRequirement = missingCategory || missingStatus;
					var isExistingPost = !!postId && 'auto-draft' !== currentStatus;
					var isPublishing = editor.isPublishingPost ? editor.isPublishingPost() : false;

					if ((isExistingPost || isPublishing) && missingRequirement) {
						dispatcher.lockPostSaving(requirementsLock);
						wp.data.dispatch('core/notices').createErrorNotice(
							'Select at least one Standards Category and a Status before saving this Standard.',
							{ id: requirementsNotice, isDismissible: false }
						);
					} else {
						dispatcher.unlockPostSaving(requirementsLock);
						wp.data.dispatch('core/notices').removeNotice(requirementsNotice);
					}
				};

				wp.data.subscribe(syncStandardRequirements);
				syncStandardRequirements();
			});",
			esc_js( $taxonomy ),
			esc_js( $taxonomy ),
			esc_js( $taxonomy ),
			esc_js( $taxonomy )
		)
	);
}
add_action( 'enqueue_block_editor_assets', 'remove_standard_status_editor_checkboxes' );

/**
 * Get the default Status term ID for new Standards.
 *
 * @return int
 */
function digimod_standard_default_status_id() {
	$term = get_term_by( 'slug', 'active', 'standard_status' );

	return $term && ! is_wp_error( $term ) ? (int) $term->term_id : 0;
}

/**
 * Make a hierarchical taxonomy single-select in the classic taxonomy metabox.
 *
 * Change `standard_status` to your taxonomy slug.
 */
function standard_status_single_select() {

	$taxonomy = 'standard_status';

	add_meta_box(
		$taxonomy . 'div',
		'Status',
		function ( $post ) use ( $taxonomy ) {

			$terms = get_terms(
                [
					'taxonomy'   => $taxonomy,
					'hide_empty' => false,
				]
            );

			if ( is_wp_error( $terms ) ) {
				return;
			}

			$selected = wp_get_object_terms(
				$post->ID,
				$taxonomy,
				[ 'fields' => 'ids' ]
			);

			$selected = $selected[0] ?? digimod_standard_default_status_id();

			$options = [];

			foreach ( $terms as $term ) {

				// Only include child terms.
				if ( ! $term->parent ) {
					continue;
				}

				$parent = get_term(
					$term->parent,
					$taxonomy
				);

				if ( is_wp_error( $parent ) || ! $parent ) {
					continue;
				}

				$options[] = [
					'id'     => $term->term_id,
					'label'  => $term->name,
					'colour' => strtolower( $parent->name ),
				];
			}

			// Sort alphabetically by status label.
			usort(
                $options,
                function ( $a, $b ) {
					return strcasecmp( $a['label'], $b['label'] );
				}
            );

			echo '<select name="tax_input[' . esc_attr( $taxonomy ) . '][]" style="width:auto;" required aria-required="true">';

			echo '<option value="" disabled>— Select status —</option>';

			foreach ( $options as $option ) {
				printf(
					'<option value="%1$d" %2$s>%3$s (%4$s)</option>',
					(int) $option['id'],
					selected( $selected, $option['id'], false ),
					esc_html( $option['label'] ),
					esc_html( $option['colour'] )
				);
			}

			echo '</select>';
		},
		null,
		'side',
		'default'
	);
}
add_action( 'add_meta_boxes', 'standard_status_single_select' );

/**
 * Check whether a Standard has at least one Status term.
 *
 * @param int $post_id Post ID.
 *
 * @return bool
 */
function digimod_standard_has_status( $post_id ) {
	$terms = wp_get_post_terms( $post_id, 'standard_status', array( 'fields' => 'ids' ) );

	return ! is_wp_error( $terms ) && ! empty( $terms );
}

/**
 * Check whether a Standard has at least one Standards Category term.
 *
 * @param int $post_id Post ID.
 *
 * @return bool
 */
function digimod_standard_has_category( $post_id ) {
	$terms = wp_get_post_terms( $post_id, 'standard_category', array( 'fields' => 'ids' ) );

	return ! is_wp_error( $terms ) && ! empty( $terms );
}

/**
 * Keep Standards without a Status from being published.
 *
 * The editor's required select is not enforced for every REST/editor save
 * path, so published Standards are downgraded to drafts when no Status is
 * assigned.
 *
 * @param array $data    Sanitized post data.
 * @param array $postarr Raw post data.
 *
 * @return array
 */
function digimod_require_standard_status_before_save( $data, $postarr ) {
	if ( 'standard' !== ( $data['post_type'] ?? '' ) || ! in_array( $data['post_status'], array( 'publish', 'future', 'private' ), true ) ) {
		return $data;
	}

	if ( defined( 'REST_REQUEST' ) && REST_REQUEST ) {
		return $data;
	}

	$post_id           = isset( $postarr['ID'] ) ? absint( $postarr['ID'] ) : 0;
	$status_is_set     = false;
	$status_was_sent   = false;
	$status_parameters = array( 'standard_status', 'tax_input' );

	foreach ( $status_parameters as $parameter ) {
		if ( ! array_key_exists( $parameter, $postarr ) ) {
			continue;
		}

		if ( 'tax_input' === $parameter ) {
			if ( ! is_array( $postarr[ $parameter ] ) || ! array_key_exists( 'standard_status', $postarr[ $parameter ] ) ) {
				continue;
			}

			$status_value = $postarr[ $parameter ]['standard_status'];
		} else {
			$status_value = $postarr[ $parameter ];
		}

		$status_was_sent = true;
		$status_values   = is_array( $status_value ) ? $status_value : array( $status_value );
		$status_is_set   = ! empty( array_filter( $status_values ) );
		break;
	}

	if ( ! $status_was_sent && $post_id ) {
		$status_is_set = digimod_standard_has_status( $post_id );
	}

	if ( ! $status_is_set ) {
		$data['post_status'] = 'draft';
	}

	return $data;
}
add_filter( 'wp_insert_post_data', 'digimod_require_standard_status_before_save', 10, 2 );

/**
 * Reject published Standard REST updates when a required taxonomy is
 * explicitly emptied. This runs before the REST controller can save the post,
 * avoiding a save followed by a silent downgrade to draft.
 *
 * @param mixed           $result  Response to short-circuit, if any.
 * @param WP_REST_Server  $server  REST server instance.
 * @param WP_REST_Request $request REST request.
 *
 * @return mixed
 */
function digimod_validate_standard_rest_requirements( $result, $server, $request ) {
	unset( $server );

	if ( null !== $result || ! in_array( $request->get_method(), array( 'POST', 'PUT', 'PATCH' ), true ) ) {
		return $result;
	}

	$route          = $request->get_route();
	$post_type      = get_post_type_object( 'standard' );
	$standard_route = $post_type && ! empty( $post_type->rest_base ) ? $post_type->rest_base : 'standard';

	if ( ! preg_match( '#^/wp/v2/' . preg_quote( $standard_route, '#' ) . '(?:/(\d+))?$#', $route, $matches ) ) {
		return $result;
	}

	$post_id = isset( $matches[1] ) ? absint( $matches[1] ) : 0;
	$post    = $post_id ? get_post( $post_id ) : null;
	$params  = $request->get_params();
	$status  = isset( $params['status'] ) && '' !== $params['status'] ? $params['status'] : ( $post ? $post->post_status : 'draft' );

	if ( ! in_array( $status, array( 'publish', 'future', 'private' ), true ) ) {
		return $result;
	}

	// A new Standard uses Active by default. Set it on the request so the
	// editor does not require the user to change the select before publishing.
	if ( ! $post_id && ! array_key_exists( 'standard_status', $params ) && ( ! isset( $params['tax_input'] ) || ! is_array( $params['tax_input'] ) || ! array_key_exists( 'standard_status', $params['tax_input'] ) ) ) {
		$default_status_id = digimod_standard_default_status_id();

		if ( $default_status_id ) {
			$request->set_param( 'standard_status', array( $default_status_id ) );
			$params = $request->get_params();
		}
	}

	$required_taxonomies = array(
		'standard_status'   => 'Standards require a Status before they can be published.',
		'standard_category' => 'Standards require at least one Standards Category before they can be published.',
	);

	foreach ( $required_taxonomies as $taxonomy => $message ) {
		$taxonomy_was_sent = array_key_exists( $taxonomy, $params );
		$taxonomy_value    = $taxonomy_was_sent ? $params[ $taxonomy ] : null;

		if ( ! $taxonomy_was_sent && isset( $params['tax_input'] ) && is_array( $params['tax_input'] ) && array_key_exists( $taxonomy, $params['tax_input'] ) ) {
			$taxonomy_was_sent = true;
			$taxonomy_value    = $params['tax_input'][ $taxonomy ];
		}

		if ( $taxonomy_was_sent ) {
			$taxonomy_values = is_array( $taxonomy_value ) ? $taxonomy_value : array( $taxonomy_value );

			if ( empty( array_filter( $taxonomy_values ) ) ) {
				return new WP_Error(
					'digimod_' . $taxonomy . '_required',
					$message,
					array( 'status' => 400 )
				);
			}
		} elseif ( ! $post_id ) {
			return new WP_Error(
				'digimod_' . $taxonomy . '_required',
				$message,
				array( 'status' => 400 )
			);
		}
	}

	return $result;
}
add_filter( 'rest_pre_dispatch', 'digimod_validate_standard_rest_requirements', 10, 3 );

/**
 * Reject REST saves that would publish a Standard without a Status.
 *
 * @param WP_Post|WP_Error $prepared_post Prepared post object.
 * @param WP_REST_Request  $request       REST request.
 *
 * @return WP_Post|WP_Error
 */
function digimod_require_standard_status_rest_save( $prepared_post, $request ) {
	if ( is_wp_error( $prepared_post ) || ! in_array( $prepared_post->post_status, array( 'publish', 'future', 'private' ), true ) ) {
		return $prepared_post;
	}

	$status_is_set = false;

	if ( $request->has_param( 'standard_status' ) ) {
		$status_value  = $request->get_param( 'standard_status' );
		$status_values = is_array( $status_value ) ? $status_value : array( $status_value );
		$status_is_set = ! empty( array_filter( $status_values ) );
	} elseif ( $prepared_post->ID ) {
		$status_is_set = digimod_standard_has_status( $prepared_post->ID );
	}

	if ( ! $status_is_set ) {
		return new WP_Error(
			'digimod_standard_status_required',
			'Standards require a Status before they can be published.',
			array( 'status' => 400 )
		);
	}

	return $prepared_post;
}
add_filter( 'rest_pre_insert_standard', 'digimod_require_standard_status_rest_save', 10, 2 );

/**
 * Reject REST saves that would publish a Standard without a Category.
 *
 * @param WP_Post|WP_Error $prepared_post Prepared post object.
 * @param WP_REST_Request  $request       REST request.
 *
 * @return WP_Post|WP_Error
 */
function digimod_require_standard_category_rest_save( $prepared_post, $request ) {
	if ( is_wp_error( $prepared_post ) || ! in_array( $prepared_post->post_status, array( 'publish', 'future', 'private' ), true ) ) {
		return $prepared_post;
	}

	$category_is_set = false;
	$request_params  = $request->get_params();

	if ( array_key_exists( 'standard_category', $request_params ) ) {
		$category_value  = $request_params['standard_category'];
		$category_values = is_array( $category_value ) ? $category_value : array( $category_value );
		$category_is_set = ! empty( array_filter( $category_values ) );
	} elseif ( isset( $request_params['tax_input'] ) && is_array( $request_params['tax_input'] ) && array_key_exists( 'standard_category', $request_params['tax_input'] ) ) {
		$category_value  = $request_params['tax_input']['standard_category'];
		$category_values = is_array( $category_value ) ? $category_value : array( $category_value );
		$category_is_set = ! empty( array_filter( $category_values ) );
	} elseif ( $prepared_post->ID ) {
		$category_is_set = digimod_standard_has_category( $prepared_post->ID );
	}

	if ( ! $category_is_set ) {
		return new WP_Error(
			'digimod_standard_category_required',
			'Standards require at least one Standards Category before they can be published.',
			array( 'status' => 400 )
		);
	}

	return $prepared_post;
}
add_filter( 'rest_pre_insert_standard', 'digimod_require_standard_category_rest_save', 10, 2 );

/**
 * Final safeguard for published Standards without a Status.
 *
 * @param int     $post_id Post ID.
 * @param WP_Post $post    Post object.
 */
function digimod_require_standard_status_after_save( $post_id, $post ) {
	if ( ( defined( 'REST_REQUEST' ) && REST_REQUEST ) || 'standard' !== $post->post_type || 'publish' !== $post->post_status || digimod_standard_has_status( $post_id ) ) {
		return;
	}

	wp_update_post(
		array(
			'ID'          => $post_id,
			'post_status' => 'draft',
		)
	);
}
add_action( 'save_post_standard', 'digimod_require_standard_status_after_save', 10, 2 );

/**
 * Final safeguard for classic saves without a Standards Category.
 *
 * @param int     $post_id Post ID.
 * @param WP_Post $post    Post object.
 */
function digimod_require_standard_category_after_save( $post_id, $post ) {
	if ( ( defined( 'REST_REQUEST' ) && REST_REQUEST ) || 'standard' !== $post->post_type || 'publish' !== $post->post_status || digimod_standard_has_category( $post_id ) ) {
		return;
	}

	wp_update_post(
		array(
			'ID'          => $post_id,
			'post_status' => 'draft',
		)
	);
}
add_action( 'save_post_standard', 'digimod_require_standard_category_after_save', 10, 2 );

/**
 * Final safeguard for REST saves after taxonomy terms have been assigned.
 *
 * @param WP_Post         $post    Inserted post object.
 * @param WP_REST_Request $request REST request.
 * @param bool            $creating Whether this is a new post.
 */
function digimod_require_standard_status_after_rest_save( $post, $request, $creating ) {
	unset( $request, $creating );

	if ( 'standard' !== $post->post_type || 'publish' !== $post->post_status || digimod_standard_has_status( $post->ID ) ) {
		return;
	}

	wp_update_post(
		array(
			'ID'          => $post->ID,
			'post_status' => 'draft',
		)
	);
}
add_action( 'rest_after_insert_standard', 'digimod_require_standard_status_after_rest_save', 10, 3 );

/**
 * Final safeguard for REST saves without a Standards Category.
 *
 * @param WP_Post         $post    Inserted post object.
 * @param WP_REST_Request $request REST request.
 * @param bool            $creating Whether this is a new post.
 */
function digimod_require_standard_category_after_rest_save( $post, $request, $creating ) {
	unset( $request, $creating );

	if ( 'standard' !== $post->post_type || 'publish' !== $post->post_status || digimod_standard_has_category( $post->ID ) ) {
		return;
	}

	wp_update_post(
		array(
			'ID'          => $post->ID,
			'post_status' => 'draft',
		)
	);
}
add_action( 'rest_after_insert_standard', 'digimod_require_standard_category_after_rest_save', 10, 3 );

// Begin function to check for updates to plugin.
require_once 'digimod-update-check.php';

/**
 * Register and setup the Digimod plugin update check
 */
function digimod_theme_assets_update_check_init() {
    if ( class_exists( 'digimod_plugin_update_check' ) ) {
        new digimod_plugin_update_check( __FILE__, plugin_basename( __FILE__ ) );
    }
}
add_action( 'init', 'digimod_theme_assets_update_check_init' );
// End update check code.
