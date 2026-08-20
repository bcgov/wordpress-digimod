<?php
/**
 * Plugin Name: DIGIMOD - Block Theme Frontend Enhancements
 * Description: A plugin to load custom scripts, styles and theme settings to augment the default BCGov Block Theme capabilities
 * Version: 1.4.3
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
