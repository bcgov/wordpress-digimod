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

function create_block_multiple_blocks_plugin_block_init(){
register_block_type( __DIR__ . '/blocks/content-banner/build' );
register_block_type( __DIR__ . '/blocks/four-columns-text/build' );
register_block_type( __DIR__ . '/blocks/dm-col-sm-12-md-3-text/build' );
register_block_type( __DIR__ . '/blocks/h2-heading/build' );
register_block_type( __DIR__ . '/blocks/annotate/build' );
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


require('custom.php');

?>