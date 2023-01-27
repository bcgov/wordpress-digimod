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
function render_block_template_p_custom_field( $attributes, $content, $block ) {
    $test = get_field($attributes["content"]);
    return sprintf(
		'<p>%1$s</p>',
		$test
	);

}

function register_block_template_p_custom_field() {
    // automatically load dependencies and version
	// echo('register');
    $asset_file = include( plugin_dir_path( __FILE__ ) . '../build/index.asset.php');

    register_block_type( plugin_dir_path( __FILE__ ) .'../build', array(
        'api_version' => 2,
        'render_callback' => 'render_block_template_p_custom_field'
    ) );

}
add_action( 'init', 'register_block_template_p_custom_field' );
