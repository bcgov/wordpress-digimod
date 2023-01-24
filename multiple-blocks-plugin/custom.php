<?php

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
 * Whitelist specific Gutenberg blocks (paragraph, heading, image, lists, etc.)
 *
 */
add_filter( 'allowed_block_types_all', 'allowed_block_types', 0, 2 );
 
function allowed_block_types( $allowed_blocks, $editor_context ) {
  if ($editor_context->name != 'core/edit-post'){
    return;
  }
  // echo (get_allowed_block_types($editor_context)[0]);
  $block_types = WP_Block_Type_Registry::get_instance()->get_all_registered();
  // echo (implode ($block_types));
  $ret = array();
  
  // allow all custom blocks that don't start with "dm-" - these ones are for internal use (construction of other blocks)
  // also filter out card-image blocks - these are for internal use too
  foreach ($block_types as &$value) {
    // echo(' item: ');
    // echo($value->name);
    // echo(' category: ');
    // echo($value->category);
    if (str_starts_with($value->name,'multiple-blocks-plugin') 
        and !str_starts_with($value->name,'multiple-blocks-plugin/dm-') 
        and !str_starts_with($value->name,'multiple-blocks-plugin/card-image')
    ){
      array_push($ret,$value->name);
    }
  }

  array_push($ret, 'core/paragraph');
  array_push($ret, 'core/list');
  array_push($ret, 'core/list-item');
  array_push($ret, 'core/post-title');
  // array_push($ret, 'core/column');
  // array_push($ret, 'core/columns');
  array_push($ret, 'core/image');

	return $ret;
}

/* CUSTOM POST TYPES */

/*
* Creating a function to create our CPT
*/
  
function custom_post_type() {
  
  // Set UI labels for Custom Post Type
      $labels = array(
          'name'                => _x( 'Common Component Page', 'Post Type General Name', 'twentytwentyone' ),
          'singular_name'       => _x( 'Common Component Page', 'Post Type Singular Name', 'twentytwentyone' ),
          'menu_name'           => __( 'Common Components', 'twentytwentyone' ),
          'parent_item_colon'   => __( 'Parent Common Component Page', 'twentytwentyone' ),
          'all_items'           => __( 'All Common Component Pages', 'twentytwentyone' ),
          'view_item'           => __( 'View Common Component Page', 'twentytwentyone' ),
          'add_new_item'        => __( 'Add New Common Component Page', 'twentytwentyone' ),
          'add_new'             => __( 'Add New', 'twentytwentyone' ),
          'edit_item'           => __( 'Edit Common Component Page', 'twentytwentyone' ),
          'update_item'         => __( 'Update Common Component Page', 'twentytwentyone' ),
          'search_items'        => __( 'Search Common Component Page', 'twentytwentyone' ),
          'not_found'           => __( 'Not Found', 'twentytwentyone' ),
          'not_found_in_trash'  => __( 'Not found in Trash', 'twentytwentyone' ),
      );
        
  // Set other options for Custom Post Type
        
      $args = array(
          'label'               => __( 'common-components', 'twentytwentyone' ),
          'description'         => __( 'Regular common component pages', 'twentytwentyone' ),
          'labels'              => $labels,
          // Features this CPT supports in Post Editor
          'supports'            => array( 'custom-fields'),
          // 'supports'            => array( 'title', 'editor', 'excerpt', 'author', 'thumbnail', 'comments', 'revisions', 'custom-fields', ),
          // You can associate this CPT with a taxonomy or custom taxonomy. 
          // 'taxonomies'          => array( 'genres' ),
          /* A hierarchical CPT is like Pages and can have
          * Parent and child items. A non-hierarchical CPT
          * is like Posts.
          */
          'hierarchical'        => true,
          'public'              => true,
          'show_ui'             => true,
          'show_in_menu'        => true,
          'show_in_nav_menus'   => true,
          'show_in_admin_bar'   => true,
          'menu_position'       => 5,
          'can_export'          => true,
          'has_archive'         => true,
          'exclude_from_search' => false,
          'publicly_queryable'  => true,
          'capability_type'     => 'page',
          'show_in_rest' => true,
          // 'template' => array(
          //   array('core/post-title', array(
          //     'level' => 1,
          //     'className' => 'sc-cOFTSb bGhVVJ'
          //   ))
          // )
      );
        
      // Registering your Custom Post Type
      register_post_type( 'common-component', $args );
    
  }
    
  /* Hook into the 'init' action so that the function
  * Containing our post type registration is not 
  * unnecessarily executed. 
  */
    
  add_action( 'init', 'custom_post_type', 0 );

  /* ADD DEFAULT TEMPLATE TO PAGE TYPE */

  function set_page_template() {
    $template = array(
      array('core/post-title', array(
        'level' => 1,
        'className' => 'h1-heading'
      )));

    $post_type_object = get_post_type_object( 'page' );
    $post_type_object->template = $template;
  }
  add_action( 'init', 'set_page_template',20 );

  ?>