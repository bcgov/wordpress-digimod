<?php

// disable automatic core updates
// add_filter( 'auto_update_core', '__return_false' );

// add custom javascript
function myguten_enqueue() {
  
  wp_enqueue_script(
    'block_extensions',
    esc_url( plugins_url( '/dist/index.js', __FILE__ ) ),
    array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor','acf-input' ),
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
  // filter out template related blocks as well
  foreach ($block_types as &$value) {
    // echo(' item: ');
    // echo($value->name);
    // echo(' category: ');
    // echo($value->category);
    if (str_starts_with($value->name,'multiple-blocks-plugin') 
        and !str_starts_with($value->name,'multiple-blocks-plugin/dm-') 
        and !str_starts_with($value->name,'multiple-blocks-plugin/card-image')
        and !str_starts_with($value->name,'multiple-blocks-plugin/template')
        and !str_starts_with($value->name,'multiple-blocks-plugin/meta-block')
        and !str_starts_with($value->name,'multiple-blocks-plugin/h2-heading')
        and !str_starts_with($value->name,'multiple-blocks-plugin/h3-heading')
    ){
      array_push($ret,$value->name);
    }
  }

  array_push($ret, 'core/paragraph');
  array_push($ret, 'core/video');
  array_push($ret, 'core/embed');
  array_push($ret, 'core/freeform');
  // array_push($ret, 'core/cover');
  array_push($ret, 'core/list');
  array_push($ret, 'core/list-item');
  array_push($ret, 'core/post-title');
  // array_push($ret, 'core/heading');
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
          'supports'            => array( 'title','custom-fields'),
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
    
      // COMMUNITY OF PRACTICE
      // Set UI labels for Custom Post Type
      $labels_cop = array(
        'name'                => _x( 'Community of Practice Page', 'Post Type General Name', 'twentytwentyone' ),
        'singular_name'       => _x( 'Community of Practice', 'Post Type Singular Name', 'twentytwentyone' ),
        'menu_name'           => __( 'Communities of Practice', 'twentytwentyone' ),
        'parent_item_colon'   => __( 'Parent Community of Practice Page', 'twentytwentyone' ),
        'all_items'           => __( 'All Communities of Practice Pages', 'twentytwentyone' ),
        'view_item'           => __( 'View Community of Practice Page', 'twentytwentyone' ),
        'add_new_item'        => __( 'Add New Community of Practice Page', 'twentytwentyone' ),
        'add_new'             => __( 'Add New', 'twentytwentyone' ),
        'edit_item'           => __( 'Edit Community of Practice Page', 'twentytwentyone' ),
        'update_item'         => __( 'Update Community of Practice Page', 'twentytwentyone' ),
        'search_items'        => __( 'Search Community of Practice Page', 'twentytwentyone' ),
        'not_found'           => __( 'Not Found', 'twentytwentyone' ),
        'not_found_in_trash'  => __( 'Not found in Trash', 'twentytwentyone' ),
    );
      
// Set other options for Custom Post Type
      
    $args_cop = array(
        'label'               => __( 'cop', 'twentytwentyone' ),
        'description'         => __( 'Regular community of practice pages', 'twentytwentyone' ),
        'labels'              => $labels_cop,
        // Features this CPT supports in Post Editor
        'supports'            => array( 'title','custom-fields'),
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
    register_post_type( 'cop', $args_cop );
    // run this once to clear 404 error for custom post types
    // flush_rewrite_rules( false );
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


/* OVERRIDE YOUTUBE EMBED TO GENERATE DESIRED HTML OUTPUT */



function override_core_embed($block_attributes, $content, $block){
  // echo ('hello');
  return sprintf('<div react-component="ReactPlayer" url="%1$s"></div>',$block_attributes['url']);
}



function override_core_image($block_attributes, $content, $block){
  // todo: is there a better way of doing this?
  // unwrap image out of figure tag, add any additional classes to the image class (originally assigned to figure tag)
  // print_r($block_attributes);
  $className = '';
  if (array_key_exists('className',$block_attributes))
    $className = $block_attributes['className'];
  $innerHtml = $block->inner_html;
  
  // echo(' inner html: '.$innerHtml);

  preg_match_all('/<img[^>]+>/i', $innerHtml, $imgTags);
  $img = $imgTags[0];

  // echo('img[0]'. $img[0]);
  preg_match_all('/class="[^"]+"/i', $img[0], $classAttrs);

  if(empty($classAttrs[0])){
    // echo('NO CLASS');
    $img = str_replace('<img', sprintf('<img class="%s"',$className), $img[0]);
  }else{
    $img = preg_replace('/class="[^"]+"/i', sprintf('class="%s"',$className) , $img)[0];
  }

  // print_r($block_attributes);

  if(array_key_exists('templatedURL',$block_attributes)){
    // The regular expression to match the src attribute value
    $regex = '/(<img[^>]+)(src=["\']?[^"\']+[\'"]?)([^>]*>)/';

    // The new src attribute value
    $newSrc = $block_attributes['templatedURL'];

    // Replace the src attribute value in the HTML string using preg_replace
    $img = preg_replace($regex, '$1src="' . $newSrc . '"$3', $img);

  }elseif(array_key_exists('templatedCustomField',$block_attributes)){
    // The regular expression to match the src attribute value
    $regex = '/(<img[^>]+)(src=["\']?[^"\']+[\'"]?)([^>]*>)/';

    // The new src attribute value
    $newSrc = get_field($block_attributes['templatedCustomField']);

    // Replace the src attribute value in the HTML string using preg_replace
    $img = preg_replace($regex, '$1src="' . $newSrc . '"$3', $img);
  }

  // print_r($imgTags);
  // print_r($block);
  $img = process_acf_short_codes($img); // in case we have ACF fields in url
  // echo(' processing img: '. $img);
  return $img;//sprintf('<div react-component="ReactPlayer" url="%1$s"></div>',$block_attributes['url']);
}

function process_acf_short_codes($content){
  // for some reason ACF shortcodes are not working in templates, so parse them out here for raw html block
  // todo: investigate why it's not working in templates
  // todo: add this feature to any block content

  // it may have been html encoded, need to process that..

  preg_match_all('/\[acf field="(.*?)"\]/', $content, $matches);
  $names = $matches[1];

  $replaceWithFunction = function ($name) {
    $replacing_with = get_field($name);
    return $replacing_with;
  };

  $newHtml = preg_replace_callback('/\[acf field=".*?"\]/', function ($matches) use ($names, $replaceWithFunction) {
      static $i = 0;
      return $replaceWithFunction($names[$i++]);
  }, $content);

  // it may have been html encoded, need to process that..
  
  preg_match_all('/\[acf field=&quot;(.*?)&quot;\]/', $newHtml, $matches);
  $names = $matches[1];

  $replaceWithFunction = function ($name) {
    // echo('replacing: '. $name);
    $replacing_with = get_field($name);
    // echo(' with: '.$replacing_with);
    return $replacing_with;
  };
  // echo('$newHtml: '.$newHtml);
  $newHtml = preg_replace_callback('/\[acf field=&quot;.*?&quot;\]/', function ($matches) use ($names, $replaceWithFunction) {
    // echo('REPLACE');
      static $i = 0;
      return $replaceWithFunction($names[$i++]);
  }, $newHtml);


  return $newHtml;
}

function override_core_html($block_attributes, $content, $block){
  // echo('HTML');
  $r =process_acf_short_codes($content);
  // echo('r: '.$r);
  // echo("HTML DONE");
  return $r;
}

add_filter( 'register_block_type_args', 'override_core', 10, 2 ); 
function override_core( $args, $name ) {
   if ( $name == 'core/embed' )
      $args['render_callback'] = 'override_core_embed';

    if ( $name == 'core/image' )
      $args['render_callback'] = 'override_core_image';

    if ( $name == 'core/html' )
      $args['render_callback'] = 'override_core_html';

  return $args;
} 


/* CUSTOM API ENDPOINTS */
function ret_tempate( $request_data  ) {
  $t = get_block_template('wordpress-v2-theme//wp-custom-template-common-component');
  return rest_ensure_response( array('content'=>$t->content) );

  // return $t->content;


  // $ts = get_block_templates();
  // print_r($ts);

  
  // $posts = get_posts( array(
  //   'author' => $data['id'],
  // ) );

  // if ( empty( $posts ) ) {
  //   return null;
  // }

  // return $posts[0]->post_title;



  // $parameters = $request_data->get_params();
  // $type = '';
  // if(!isset( $parameters['type'] ) || empty($parameters['type']) ) {
  //   $type = 'wp-custom-template-common-component';
  // }else{
  //   $type = $parameters['type'];
  // }

  //   	// if(!isset( $parameters['type'] ) || empty($parameters['type']) ) {
  //   		// $response = wp_get_theme()->get_page_templates();
  //   	// } else {
	// 			$args = array(
	//         'post_type' => 'page',
	//         'post_status' => 'publish',
	//         'meta_query' => array(
  //           array(
  //             'key' => '_wp_page_template',
  //             'value' => $type
  //           )
  //       	)
  //   		);
	// 			$query = new WP_Query($args);
	// 			$response = $query->posts;
  //   	// }

  //     // No static frontpage is set
  //     if( count($response) < 1 ) {
  //       return new WP_Error( 'wpse-error',
  //         esc_html__( 'No templates found', 'wpse' ),
  //         [ 'status' => 404 ] );
  //     }

  //     // Return the response
  //     return $response;
}

add_action( 'rest_api_init', function () {
  register_rest_route( 'multiple-blocks-plugin/v1', '/author/(?P<id>\d+)', array(
    'methods' => 'GET',
    'callback' => 'ret_tempate',
    'permission_callback' => function () {
      return current_user_can( 'edit_pages' );
    }
  ) );
} );


/* RENDER IMAGES WITHOUT FIGURE TAG */

function imageOnly($deprecated, $attr, $content = null) 
{
    echo('image only!');
    return do_shortcode( $content );
}
add_filter( 'img_caption_shortcode', 'imageOnly', 10, 3 );

// Here's some code generated by AI in case more advanced filtering is needed (not tested):
//
// What's the code to prevent WordPress from wrapping image tag inside figure tag when using the image block in the gutenberg editor?
//
// You can prevent WordPress from wrapping images in a figure tag by using a filter in your theme's functions.php file. Here's an example of the code:
// add_filter( 'img_caption_shortcode', 'my_img_caption_shortcode_filter', 10, 3 );
// function my_img_caption_shortcode_filter( $empty, $attr, $content ){
//   $atts = shortcode_atts( array(
//       'id'      => '',
//       'align'   => 'alignnone',
//       'width'   => '',
//       'caption' => '',
//       'class'   => '',
//   ), $attr, 'caption' );

//   $atts['width'] = (int) $atts['width'];

//   if ( $atts['width'] < 1 || empty( $atts['caption'] ) ) {
//       return $content;
//   }

//   if ( ! empty( $atts['id'] ) ) {
//       $atts['id'] = 'id="' . esc_attr( sanitize_html_class( $atts['id'] ) ) . '" ';
//   }

//   $class = trim( 'wp-caption ' . $atts['align'] . ' ' . $atts['class'] );

//   if ( current_theme_supports( 'html5', 'caption' ) ) {
//       return '<figure ' . $atts['id'] . ' class="' . esc_attr( $class ) . '">'
//       . do_shortcode( $content ) . '<figcaption class="wp-caption-text">' . $atts['caption'] . '</figcaption></figure>';
//   }

//   return '<div ' . $atts['id'] . ' class="' . esc_attr( $class ) . '">'
//   . do_shortcode( $content ) . '<p class="wp-caption-text">' . $atts['caption'] . '</p></div>';
// }
// This code will remove the wrapping figure tag, while preserving the caption text. You can customize the code to meet your needs.
?>