<?php
/**
 * Server-side rendering of the block.
 *
 * @package WordPress
 */

/**
 * Renders the block on the server.
 *
 * @param array    $attributes Block attributes.
 * @param string   $content    Block default content.
 * @param WP_Block $block      Block instance.
 *
 * @return string Returns the custom field
 */
function render_block_template_paragraph_container( $attributes, $content, $block ) {
    // echo('content: '.$content);
    return sprintf(
		'%1$s',
		$content
	);
}

function register_block_template_paragraph_container() {
    // automatically load dependencies and version
	// echo('register');
    $asset_file = include( plugin_dir_path( __FILE__ ) . '../build/index.asset.php');

    register_block_type( plugin_dir_path( __FILE__ ) .'../build', array(
        'api_version' => 2,
        'render_callback' => 'render_block_template_paragraph_container'
    ) );

}
add_action( 'init', 'register_block_template_paragraph_container' );
