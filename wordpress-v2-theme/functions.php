<?php
/**
 * Functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package FSE
 * @since 1.0.0
 */

/**
 * Enqueue the style.css file.
 * 
 * @since 1.0.0
 */
function fse_styles() {
	wp_enqueue_style(
		'fse-style',
		get_stylesheet_uri(),
		array(),
		wp_get_theme()->get( 'Version' )
	);
}

function add_editor_styles() {
	// Add support for editor styles.
	  add_theme_support( 'editor-styles' );
	  // Enqueue editor styles.
	add_editor_style( 'style.css' );



	// Remove page title if first block is the acf-hero-block
	global $post;
     // check if the post is using the block editor
    //  if ( has_blocks( $post->post_content ) ) {
    //      $blocks = parse_blocks( $post->post_content );

         // check if the first block is the 'acf-hero-block'
        //  if ( $blocks[0]['blockName'] === 'acf/acf-hero-block' ) {

              // remove the page title if first block is the acf-hero-block
            //   remove_action( 'genesis_entry_header', 'genesis_entry_header_markup_open', 5 );
            //   remove_action( 'genesis_entry_header', 'genesis_do_post_title' );
            //   remove_action( 'genesis_entry_header', 'genesis_entry_header_markup_close', 15 );

        //  }

    //  }
}

// function wporg_add_custom_box() {
// 	$screens = [ 'post', 'page' ];
// 	foreach ( $screens as $screen ) {
// 		add_meta_box(
// 			'wporg_box_id',                 // Unique ID
// 			'Custom Meta Box Title',      // Box title
// 			'wporg_custom_box_html',  // Content callback, must be of type callable
// 			$screen,                            // Post type
// 			'side',  // position (normal, side, advanced)
// 			'high' // priority (default, low, high, core)
// 			// 'page'
// 		);
// 	}
// }
// function wporg_custom_box_html( $post ) {
	
// 	echo 'hello';
// }

// add_action( 'add_meta_boxes', 'wporg_add_custom_box' );




add_action( 'after_setup_theme', 'add_editor_styles' );

add_action( 'wp_enqueue_scripts', 'fse_styles' );

// remove core patterns
add_action('init', function() {
	remove_theme_support('core-block-patterns');
});



// allow aria-label on tags
// $allowed_html = array(
// 	'ul' => array(
// 	'aria-label' => array()
// 	)
// );

// wp_kses_allowed_html('page',$allowed_html);