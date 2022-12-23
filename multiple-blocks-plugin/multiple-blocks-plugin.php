<?php
/**
 * Plugin Name:       Multiple Blocks Plugin
 * Description:       Example block scaffolded with Create Block tool.
 * Requires at least: 5.9
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       multiple-blocks-plugin
 *
 * @package           create-block
 */

function create_block_multiple_blocks_plugin_block_init() {
  register_block_type( __DIR__ . '/blocks/dm-annotate/build' );
register_block_type( __DIR__ . '/blocks/dm-content-banner/build' );
register_block_type( __DIR__ . '/blocks/dm-content-banner-content/build' );
register_block_type( __DIR__ . '/blocks/dm-content-banner-image/build' );
register_block_type( __DIR__ . '/blocks/dm-content-block-container/build' );
register_block_type( __DIR__ . '/blocks/dm-col-sm-12/build' );
register_block_type( __DIR__ . '/blocks/dm-row/build' );
register_block_type( __DIR__ . '/blocks/dm-col-sm-12-md-3/build' );
register_block_type( __DIR__ . '/blocks/dm-col-sm-12-md-6/build' );
register_block_type( __DIR__ . '/blocks/dm-4-cols/build' );
register_block_type( __DIR__ . '/blocks/dm-3-cols/build' );
register_block_type( __DIR__ . '/blocks/dm-col-sm-12-md-4/build' );
register_block_type( __DIR__ . '/blocks/dm-card/build' );
register_block_type( __DIR__ . '/blocks/card-image-header-content/build' );
register_block_type( __DIR__ . '/blocks/card-image-header-content-image/build' );
register_block_type( __DIR__ . '/blocks/card-image-header-content-text/build' );

}
add_action( 'init', 'create_block_multiple_blocks_plugin_block_init' );


// add custom javascript
function myguten_enqueue() {
  
  wp_enqueue_script(
    'jq',
    plugins_url( 'jquery-3.6.2.min.js', __FILE__ )
  );
  wp_enqueue_script(
    'myguten-script',
    plugins_url( 'editor.js', __FILE__ )
  );
  

   // Enqueue our script
   wp_enqueue_script(
    'block_extensions',
    esc_url( plugins_url( '/dist/block_extensions.js', __FILE__ ) ),
    array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor' ),
    '1.0.0',
    true // Enqueue the script in the footer.
  );
}


add_action( 'enqueue_block_editor_assets', 'myguten_enqueue' );