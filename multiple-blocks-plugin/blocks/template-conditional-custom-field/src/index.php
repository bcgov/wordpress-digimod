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
function render_block_template_conditional_custom_field( $attributes, $content, $block ) {

    $test = get_field($attributes["content"]);
    // render if custom field exists
    if ($test){
	    return $content;
    }else{
        return;
    }
    

    // return sprintf(
	// 	'%1$s',
	// 	$test
	// );

}

/**
 * Registers the `core/post-title` block on the server.
 */
function register_template_conditional_custom_field() {
    // echo('registering..');
	// register_block_type_from_metadata(
	// 	__DIR__ . '/template-custom-field',
	// 	array(
	// 		'render_callback' => 'render_block_custom_field',
	// 	)
	// );
    // automatically load dependencies and version
    $asset_file = include( plugin_dir_path( __FILE__ ) . '../build/index.asset.php');

    // wp_register_script(
    //     'template-custom-field',
    //     plugins_url( 'build/index.js', __FILE__ ),
    //     $asset_file['dependencies'],
    //     $asset_file['version']
    // );
	
    register_block_type( plugin_dir_path( __FILE__ ) .'../build', array(
        'api_version' => 2,
        // 'editor_script' => 'template-custom-field',
        'render_callback' => 'render_block_template_conditional_custom_field'
    ) );

}
add_action( 'init', 'register_template_conditional_custom_field' );
