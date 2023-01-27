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
function render_block_template_link_button_custom_field( $attributes, $content, $block ) {
    $test = get_field($attributes["url"]);
    return sprintf(
		'<div class="row" style="margin-top: 30px;">
            <div class="col-xs-12" style="flex-basis: auto;">
                <a href="%1$s" class="ExternalLinkButton">Start Using Now</a>
            </div>
        </div>',
		$test
	);
}

function register_block_template_link_button_custom_field() {
    // automatically load dependencies and version
	// echo('register');
    $asset_file = include( plugin_dir_path( __FILE__ ) . '../build/index.asset.php');

    register_block_type( plugin_dir_path( __FILE__ ) .'../build', array(
        'api_version' => 2,
        'render_callback' => 'render_block_template_link_button_custom_field'
    ) );

}
add_action( 'init', 'register_block_template_link_button_custom_field' );
