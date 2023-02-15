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
function render_block_template_link_custom_field( $attributes, $content, $block ) {
    $url = get_field($attributes["url"]);
    $text = "";
    if (array_key_exists("content", $attributes) && get_field($attributes["content"])!=''){ // use custom field as source for link if provided
        $text = get_field($attributes["content"]);
    }else{
        $text = $attributes["linkText"];
    }
   
    return sprintf(
		'<a href="%1$s">%2$s</a>',
		$url, $text
	);
}

function register_block_template_link_custom_field() {
    // automatically load dependencies and version
	// echo('register');
    $asset_file = include( plugin_dir_path( __FILE__ ) . '../build/index.asset.php');

    register_block_type( plugin_dir_path( __FILE__ ) .'../build', array(
        'api_version' => 2,
        'render_callback' => 'render_block_template_link_custom_field'
    ) );

}
add_action( 'init', 'register_block_template_link_custom_field' );
