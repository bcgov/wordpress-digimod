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
function render_block_template_cc_links( $attributes, $content, $block ) {
    $test = get_field($attributes["field_name"]);
    return sprintf(
        '<div style="margin-bottom: 67px;" role="navigation" aria-label="on this page">
        <div class="row">
          <div class="col-xs-12">
            <h2 aria-hidden="true" class="h2-heading">On this page</h2>
          </div>
        </div>
        <div class="row between-xs">
          <div class="col-sm-2">
            <a href="#" class="sc-bBrHrO kxVFkV">Overview</a>
          </div>
          <div class="col-sm-2">
            <a href="#" class="sc-bBrHrO kxVFkV">Why should I use this?</a>
          </div>
          <div class="col-sm-2">
            <a href="#" class="sc-bBrHrO kxVFkV">Who else is using this?</a>
          </div>
          <div class="col-sm-2">
            <a href="#" class="sc-bBrHrO kxVFkV">About %1$s</a>
          </div>
          <div class="col-sm-2">
            <a href="#" class="sc-bBrHrO kxVFkV">Getting started</a>
          </div>
          <div class="col-sm-2">
            <a href="#" class="sc-bBrHrO kxVFkV">Support</a>
          </div>
        </div>
      </div>',
		$test
	);
}

function register_block_template_cc_links() {
    // automatically load dependencies and version
	// echo('register');
    $asset_file = include( plugin_dir_path( __FILE__ ) . '../build/index.asset.php');

    register_block_type( plugin_dir_path( __FILE__ ) .'../build', array(
        'api_version' => 2,
        'render_callback' => 'render_block_template_cc_links'
    ) );

}
add_action( 'init', 'register_block_template_cc_links' );