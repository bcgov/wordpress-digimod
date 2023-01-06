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
  register_block_type( __DIR__ . '/blocks/content-banner/build' );
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


/* CREATE CUSTOM ROLES */

// Delete a role on plugin deactivation
// add_action( 'switch_theme', 'deactivate_my_theme' );

// function deactivate_my_theme() {
// 	remove_role( 'basic_contributor' );
// }

// Add a role on plugin activation
// add_action( 'after_switch_theme', 'activate_my_theme' );
register_activation_hook( __FILE__, 'activate_my_theme' );
function activate_my_theme() {
  $editor = get_role( 'editor' );
  add_role( 'copywriter', 'Copywriter', $editor->capabilities);
  add_role( 'subject-matter-expert', 'Subject Matter Expert', $editor->capabilities);
  add_role( 'production-manager', 'Production Manager', $editor->capabilities);
	// add_role( 'basic_contributor', 'Basic Contributor',
	// 	[
	// 		'read'         => true,
	// 		'edit_posts'   => true,
	// 		'upload_files' => true,
	// 	]
	// );
}

/* ADD CAPABILITIES TO ROLES TO EDIT PAGES BASED ON CUSTOM PAGE STATUS */

// Copywriter should not be able to edit their copy after the page goes into "review" state

register_activation_hook( __FILE__, 'epp_add_cap' );

/**
 * Add new capabilities to custom roles.
 *
 * @wp-hook "activate_" . __FILE__
 * @return  void
 */
function epp_add_cap()
{
    global $wp_roles;

    if ( ! isset( $wp_roles ) )
        $wp_roles = new WP_Roles;

    // copywriter can't edit pages under review OR ready to publish
    $wp_roles->add_cap( 'copywriter', 'deny_ready_to_publish_OR_review_edit' );

    // subject matter expert can't edit if page is ready to publish
    $wp_roles->add_cap( 'subject-matter-expert', 'deny_ready_to_publish_edit' );
}

add_filter( 'user_has_cap', 'process_deny_review_edit', 10, 3 );

/**
 * Allow editing others pending posts only with "deny_review_edit" capability.
 * Administrators can still edit those posts.
 *
 * @wp-hook user_has_cap
 * @param   array $allcaps All the capabilities of the user
 * @param   array $caps    [0] Required capability ('edit_others_posts')
 * @param   array $args    [0] Requested capability
 *                         [1] User ID
 *                         [2] Post ID
 * @return  array
 */
function process_deny_review_edit( $allcaps, $caps, $args )
{
    // Not our capability
    if ( ( 'edit_post' !== $args[0] && 'delete_post' !== $args[0] )
        or empty ( $allcaps['deny_review_edit'] )
    )
        return $allcaps;

    $post = get_post( $args[2] );

    // if page is in "review" status, then deny editing to copywriter
    // echo ($post->post_status);
    // echo ('review' == $post->post_status);

    if ( 'review' == $post->post_status )
    { 
        // echo($allcaps[ $caps[0] ]);
        $allcaps[ $caps[0] ] = FALSE;
    }else{
        // post is in some other state - allow editing
        $allcaps[ $caps[0] ] = TRUE;
    }

    return $allcaps;
}

add_filter( 'user_has_cap', 'process_deny_ready_to_publish_OR_review_edit', 10, 3 );

/**
 * Allow editing others pending posts only with "deny_ready_to_publish_OR_review_edit" capability.
 * Administrators can still edit those posts.
 *
 * @wp-hook user_has_cap
 * @param   array $allcaps All the capabilities of the user
 * @param   array $caps    [0] Required capability ('edit_others_posts')
 * @param   array $args    [0] Requested capability
 *                         [1] User ID
 *                         [2] Post ID
 * @return  array
 */
function process_deny_ready_to_publish_OR_review_edit( $allcaps, $caps, $args )
{
    // Not our capability
    if ( ( 'edit_post' !== $args[0] && 'delete_post' !== $args[0] )
        or empty ( $allcaps['deny_ready_to_publish_OR_review_edit'] )
    )
        return $allcaps;

    $post = get_post( $args[2] );

    // if page is in "ready-to-publish" or "review" status, then deny editing
    if ( 'ready-to-publish' == $post->post_status or 'review' == $post->post_status )
    { 
        $allcaps[ $caps[0] ] = FALSE;
    }else{
        // post is in some other state - allow editing
        $allcaps[ $caps[0] ] = TRUE;
    }

    return $allcaps;
}

add_filter( 'user_has_cap', 'process_deny_ready_to_publish_edit', 10, 3 );

/**
 * Allow editing others pending posts only with "deny_ready_to_publish_edit" capability.
 * Administrators can still edit those posts.
 *
 * @wp-hook user_has_cap
 * @param   array $allcaps All the capabilities of the user
 * @param   array $caps    [0] Required capability ('edit_others_posts')
 * @param   array $args    [0] Requested capability
 *                         [1] User ID
 *                         [2] Post ID
 * @return  array
 */
function process_deny_ready_to_publish_edit( $allcaps, $caps, $args )
{
    // Not our capability
    if ( ( 'edit_post' !== $args[0] && 'delete_post' !== $args[0] )
        or empty ( $allcaps['deny_ready_to_publish_edit'] )
    )
        return $allcaps;

    $post = get_post( $args[2] );

    // if page is in "ready-to-publish" or "review" status, then deny editing
    //echo($post->post_status);
    if ( 'ready-to-publish' == $post->post_status)
    { 
        $allcaps[ $caps[0] ] = FALSE;
    }else{
        // post is in some other state - allow editing
        $allcaps[ $caps[0] ] = TRUE;
    }

    return $allcaps;
}


/*
 * Whitelist specific Gutenberg blocks (paragraph, heading, image and lists)
 *
 */
add_filter( 'allowed_block_types_all', 'allowed_block_types', 0, 2 );
 
function allowed_block_types( $allowed_blocks, $editor_context ) {
  // echo (get_allowed_block_types($editor_context)[0]);
  $block_types = WP_Block_Type_Registry::get_instance()->get_all_registered();
  // echo (implode ($block_types));
  $ret = array();
  
  foreach ($block_types as &$value) {
    // echo(' item: ');
    // echo($value->name);
    // echo(' category: ');
    // echo($value->category);
    if (str_starts_with($value->name,'multiple-blocks-plugin') and !str_starts_with($value->name,'multiple-blocks-plugin/dm-') and !str_starts_with($value->name,'multiple-blocks-plugin/card-image')
    // or $value->name=='core/group'
    // or $value->name=='core/image'
    // or $value->name=='core/post-title'
    ){
      //  item: multiple-blocks-plugin/h2-heading category: widgets
      //  item: multiple-blocks-plugin/annotate category: widgets
      //  item: multiple-blocks-plugin/dm-content-banner category: widgets
      //  item: multiple-blocks-plugin/dm-content-banner-content category: widgets
      //  item: multiple-blocks-plugin/dm-content-banner-image category: widgets
      //  item: multiple-blocks-plugin/dm-content-block-container category: widgets
      //  item: multiple-blocks-plugin/dm-col-sm-12 category: widgets
      //  item: multiple-blocks-plugin/dm-row category: widgets
      //  item: multiple-blocks-plugin/dm-col-sm-12-md-3 category: widgets
      //  item: multiple-blocks-plugin/dm-col-sm-12-md-6 category: widgets
      //  item: multiple-blocks-plugin/dm-4-cols category: widgets
      //  item: multiple-blocks-plugin/dm-3-cols category: widgets
      //  item: multiple-blocks-plugin/dm-col-sm-12-md-4 category: widgets
      //  item: multiple-blocks-plugin/dm-card category: widgets
      //  item: multiple-blocks-plugin/card-image-header-content category: widgets
      //  item: multiple-blocks-plugin/card-image-header-content-image category: widgets
      //  item: multiple-blocks-plugin/card-image-header-content-text category: widgets
      // $whiteList = array(['multiple-blocks-plugin/h2-heading',])
      array_push($ret,$value->name);
    }
    // echo('<br>');
  }

  array_push($ret, 'core/paragraph');
  array_push($ret, 'core/list');
  array_push($ret, 'core/list-item');

	return $ret;
}