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

 // TODO: DELETE THIS - enable to allow installation of blocks on local
//  add_filter('https_ssl_verify', '__return_false');

require(  __DIR__ . '/blocks/template-raw-custom-field/src/index.php');
require(  __DIR__ . '/blocks/template-h1-custom-field/src/index.php');
require(  __DIR__ . '/blocks/template-p-custom-field/src/index.php');
require(  __DIR__ . '/blocks/template-h3-custom-field/src/index.php');
require(  __DIR__ . '/blocks/template-conditional-custom-field/src/index.php');
require(  __DIR__ . '/blocks/template-link-button-custom-field/src/index.php');
require(  __DIR__ . '/blocks/template-link-custom-field/src/index.php');
require(  __DIR__ . '/blocks/template-paragraph-container/src/index.php');
require(  __DIR__ . '/blocks/template-image-custom-field/src/index.php');
require(  __DIR__ . '/blocks/template-badges-custom-field/src/index.php');
require(  __DIR__ . '/blocks/template-acf-wysiwyg-container/src/index.php');

require(  __DIR__ . '/blocks/meta-block/src/index.php');

function create_block_multiple_blocks_plugin_block_init(){

// register_block_type( __DIR__ . '/blocks/meta-block/build' );

register_block_type( __DIR__ . '/blocks/content-banner/build' );
// register_block_type( __DIR__ . '/blocks/two-tabs/build' );
register_block_type( __DIR__ . '/blocks/four-columns-text/build' );
register_block_type( __DIR__ . '/blocks/two-columns/build' );
register_block_type( __DIR__ . '/blocks/three-columns/build' );
register_block_type( __DIR__ . '/blocks/dm-col-sm-12-md-3-text/build' );
register_block_type( __DIR__ . '/blocks/h2-heading/build' );
register_block_type( __DIR__ . '/blocks/h3-heading/build' );
register_block_type( __DIR__ . '/blocks/annotate/build' );
register_block_type( __DIR__ . '/blocks/accordian/build' );
register_block_type( __DIR__ . '/blocks/embed-youtube/build' );
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
register_block_type( __DIR__ . '/blocks/dm-pros-list/build' );
register_block_type( __DIR__ . '/blocks/dm-cons-list/build' );
register_block_type( __DIR__ . '/blocks/pros-and-cons/build' );


}
add_action( 'init', 'create_block_multiple_blocks_plugin_block_init' );


require('custom.php');

?>