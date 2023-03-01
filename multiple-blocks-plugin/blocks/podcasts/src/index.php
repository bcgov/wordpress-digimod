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
function render_block_template_podcasts( $attributes, $content, $block ) {
    if ( is_admin() && ! wp_doing_ajax()  ) {
        // the block is being rendered in the editor, so return null to prevent the render_callback from firing
        return null;
    } else {
        // the block is being rendered outside the editor, so return your custom render function


// Reference global $post variable.
global $post;

// Get posts.
$posts = get_posts(array(
    'post_type' => 'podcast',
    'post_count' => 4
));  
//print_r($posts);
// Set global post variable to first post.
ob_start();
for ($idx = 0; $idx < count($posts); $idx++) {
$post = $posts[$idx];

// Setup post data.
setup_postdata( $post );

// Output template part.
block_template_part( 'podcast-card' );

// Reset post data.
wp_reset_postdata();
}
}
return ob_get_clean();
}

  

function register_block_template_podcasts() {
    // automatically load dependencies and version
	// echo('register');
  //$ts = get_block_templates();
//print_r($ts);
    $asset_file = include( plugin_dir_path( __FILE__ ) . '../build/index.asset.php');

    register_block_type( plugin_dir_path( __FILE__ ) .'../build', array(
        'api_version' => 2,
        'render_callback' => 'render_block_template_podcasts'
        ,
    ) );

}
add_action( 'init', 'register_block_template_podcasts' );