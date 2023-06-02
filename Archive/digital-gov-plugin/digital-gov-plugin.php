<?php
/**
 * Plugin Name:       Digital Gov
 * Description:       Wordpress customizations specific to the Digital.gov.bc.ca site.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            DigiMod
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       digital-gov-plugin
 *
 * @package           meta-fields
 */

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
// add custom javascript
function meta_enqueue() {
  
	wp_enqueue_script(
	  'meta_data_extensions',
	  esc_url( plugins_url( '/dist/index.js', __FILE__ ) ),
	  array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor','acf-input' ),
	  '1.0.0',
	  true // Enqueue the script in the footer.
	);
  
  }
  
  add_action( 'enqueue_block_editor_assets', 'meta_enqueue' );

 /* WORKFLOW*/

//Add New Updating status
// Register Custom Post Status
function register_custom_post_status(){
	register_post_status( 'Updating', array(
		'label'                     => _x( 'Updating', 'post' ),
		'public'                    => true,
		'exclude_from_search'       => false,
		'show_in_admin_all_list'    => true,
		'show_in_admin_status_list' => true,
		'label_count'               => _n_noop( 'Updating <span class="count">(%s)</span>', 'Updating <span class="count">(%s)</span>' ),
	) );
	register_post_status( 'Technical Review', array(
		'label'                     => _x( 'Technical Review', 'post' ),
		'public'                    => true,
		'exclude_from_search'       => false,
		'show_in_admin_all_list'    => true,
		'show_in_admin_status_list' => true,
		'label_count'               => _n_noop( 'Technical Review <span class="count">(%s)</span>', 'Technical Review <span class="count">(%s)</span>' ),
	) );
	// register_post_status( 'Content Review', array(
	// 	'label'                     => _x( 'Content Review', 'post' ),
	// 	'public'                    => true,
	// 	'exclude_from_search'       => false,
	// 	'show_in_admin_all_list'    => true,
	// 	'show_in_admin_status_list' => true,
	// 	'label_count'               => _n_noop( 'Content Review <span class="count">(%s)</span>', 'Content Review <span class="count">(%s)</span>' ),
	// ) );

  }
  add_action( 'init', 'register_custom_post_status' );
  function custom_post_states( $post_states, $post ) {
	if ( $post->post_status === 'pending' ) {
	  $post_states['pending'] = __('Content Review');
	}
	return $post_states;
  }
  add_filter( 'display_post_states', 'custom_post_states', 10, 2 );

	//   add_action('transition_post_status', 'restrict_post_status_transition', 10, 3);

	//   function restrict_post_status_transition($new_status, $old_status, $post) {
	// 	if ($post->post_type == 'post' && $new_status == 'publish' && current_user_can( 'publish_posts' )) {
	// 		// 	do_action( 'admin_notices' );
	// 		//   // Restrict the transition
	// 		//   wp_update_post(array('ID' => $post->ID, 'post_status' => $old_status));
	// 		$response = array('error_msg' => "You must be a Production Manager to publish content.");
	// 		wp_send_json_error($response,418);
	// 		die();
	// 	} else if ($post->post_type == 'post' && $old_status == 'contentreview' && !in_array($new_status,array("draft")) && current_user_can( 'transition_to_technical_review' )) {
	// 		// 	do_action( 'admin_notices' );
	// 		//   // Restrict the transition
	// 		//   wp_update_post(array('ID' => $post->ID, 'post_status' => $old_status));
	// 		$response = array('error_msg' => "You must be a Content Strategist or Production Manager to approve a content review.");
	// 		wp_send_json_error($response,418);
	// 		die();
	// 	}
	// 	// $post_id = $_GET['id'];

	// 	// $post_content = get_post($post_id)->post_content; // do something with WP API.
	  
	// 	//echo json_encode($response);

	//   }
	//add_filter( 'bulk_actions-' . 'edit-post', '__return_empty_array', 99 );
	//add_filter( 'bulk_actions-' . 'edit-page', '__return_empty_array', 99 );
	//add_filter( 'post_row_actions', '__return_empty_array', 99 );
	//add_filter( 'page_row_actions', '__return_empty_array', 99 );


  /* CREATE CUSTOM ROLES */
  
  
  // Add a role on plugin activation
  // add_action( 'after_switch_theme', 'activate_my_theme' );
  function activate_my_theme() {
	$editor = get_role( 'editor' );
	add_role( 'content-author', 'Content Author', $editor->capabilities);
	add_role( 'subject-matter-expert', 'Subject Matter Expert', $editor->capabilities);
	add_role( 'production-manager', 'Production Manager', $editor->capabilities);
  }
  
  register_activation_hook( __FILE__, 'activate_my_theme' );
  
  
  /* ADD CAPABILITIES TO ROLES TO EDIT PAGES BASED ON CUSTOM PAGE STATUS */
  
  // Copywriter should not be able to edit their copy after the page goes into "review" state
  
//   register_activation_hook( __FILE__, 'epp_add_cap' );
  
//   /**
//    * Add new capabilities to custom roles.
//    *
//    * @wp-hook "activate_" . __FILE__
//    * @return  void
//    */
//   function epp_add_cap()
//   {
// 	  global $wp_roles;
  
// 	  if ( ! isset( $wp_roles ) )
// 		  $wp_roles = new WP_Roles;
  
// 	  // copywriter can't edit pages under review OR ready to publish
// 	  $wp_roles->add_cap( 'copywriter', 'deny_ready_to_publish_OR_review_edit' );
  
// 	  // subject matter expert can't edit if page is ready to publish
// 	  $wp_roles->add_cap( 'subject-matter-expert', 'deny_ready_to_publish_edit' );
//   }
  
//   add_filter( 'user_has_cap', 'process_deny_review_edit', 10, 3 );
  
//   /**
//    * Allow editing others pending posts only with "deny_review_edit" capability.
//    * Administrators can still edit those posts.
//    *
//    * @wp-hook user_has_cap
//    * @param   array $allcaps All the capabilities of the user
//    * @param   array $caps    [0] Required capability ('edit_others_posts')
//    * @param   array $args    [0] Requested capability
//    *                         [1] User ID
//    *                         [2] Post ID
//    * @return  array
//    */
//   function process_deny_review_edit( $allcaps, $caps, $args )
//   {
// 	  // Not our capability
// 	  if ( ( 'edit_post' !== $args[0] && 'delete_post' !== $args[0] )
// 		  or empty ( $allcaps['deny_review_edit'] )
// 	  )
// 		  return $allcaps;
  
// 	  $post = get_post( $args[2] );
  
// 	  // if page is in "review" status, then deny editing to copywriter
// 	  // echo ($post->post_status);
// 	  // echo ('review' == $post->post_status);
  
// 	  if ( 'review' == $post->post_status )
// 	  { 
// 		  // echo($allcaps[ $caps[0] ]);
// 		  $allcaps[ $caps[0] ] = FALSE;
// 	  }else{
// 		  // post is in some other state - allow editing
// 		  $allcaps[ $caps[0] ] = TRUE;
// 	  }
  
// 	  return $allcaps;
//   }
  
//   add_filter( 'user_has_cap', 'process_deny_ready_to_publish_OR_review_edit', 10, 3 );
  
//   /**
//    * Allow editing others pending posts only with "deny_ready_to_publish_OR_review_edit" capability.
//    * Administrators can still edit those posts.
//    *
//    * @wp-hook user_has_cap
//    * @param   array $allcaps All the capabilities of the user
//    * @param   array $caps    [0] Required capability ('edit_others_posts')
//    * @param   array $args    [0] Requested capability
//    *                         [1] User ID
//    *                         [2] Post ID
//    * @return  array
//    */
//   function process_deny_ready_to_publish_OR_review_edit( $allcaps, $caps, $args )
//   {
// 	  // Not our capability
// 	  if ( ( 'edit_post' !== $args[0] && 'delete_post' !== $args[0] )
// 		  or empty ( $allcaps['deny_ready_to_publish_OR_review_edit'] )
// 	  )
// 		  return $allcaps;
  
// 	  $post = get_post( $args[2] );
  
// 	  // if page is in "ready-to-publish" or "review" status, then deny editing
// 	  if ( 'ready-to-publish' == $post->post_status or 'review' == $post->post_status )
// 	  { 
// 		  $allcaps[ $caps[0] ] = FALSE;
// 	  }else{
// 		  // post is in some other state - allow editing
// 		  $allcaps[ $caps[0] ] = TRUE;
// 	  }
  
// 	  return $allcaps;
//   }
  
//   add_filter( 'user_has_cap', 'process_deny_ready_to_publish_edit', 10, 3 );
  
//   /**
//    * Allow editing others pending posts only with "deny_ready_to_publish_edit" capability.
//    * Administrators can still edit those posts.
//    *
//    * @wp-hook user_has_cap
//    * @param   array $allcaps All the capabilities of the user
//    * @param   array $caps    [0] Required capability ('edit_others_posts')
//    * @param   array $args    [0] Requested capability
//    *                         [1] User ID
//    *                         [2] Post ID
//    * @return  array
//    */
//   function process_deny_ready_to_publish_edit( $allcaps, $caps, $args )
//   {
// 	  // Not our capability
// 	  if ( ( 'edit_post' !== $args[0] && 'delete_post' !== $args[0] )
// 		  or empty ( $allcaps['deny_ready_to_publish_edit'] )
// 	  )
// 		  return $allcaps;
  
// 	  $post = get_post( $args[2] );
  
// 	  // if page is in "ready-to-publish" or "review" status, then deny editing
// 	  //echo($post->post_status);
// 	  if ( 'ready-to-publish' == $post->post_status)
// 	  { 
// 		  $allcaps[ $caps[0] ] = FALSE;
// 	  }else{
// 		  // post is in some other state - allow editing
// 		  $allcaps[ $caps[0] ] = TRUE;
// 	  }
  
// 	  return $allcaps;
//   }

function digital_gov_metadata_block_block_init() {
	register_block_type(
		__DIR__ . '/build',
		array(
			'render_callback' => 'digital_gov_metadata_block_render_callback',
		)
	);
}
add_action( 'init', 'digital_gov_metadata_block_block_init' );

function digital_gov_metadata_block_render_callback( $attributes, $content, $block ) {
	
	$page_status = get_post_meta( get_the_ID(), '_digital_gov_page_status', true );
    
	$output = "";

	if( ! empty( $page_status ) ){
		$output .= '<h3>' . esc_html( $page_status ) . '</h3>';
	}
	if( strlen( $output ) > 0 ){
		return '<div ' . get_block_wrapper_attributes() . '>' . $output . '</div>';
	} else {
		return '<div ' . get_block_wrapper_attributes() . '>' . '<strong>' . __( 'Sorry. No fields available here!' ) . '</strong>' . '</div>';
	}
} 
// register meta box
function digital_gov_add_meta_box(){
	add_meta_box(
		'digital_gov_meta_box', 
		__( 'Post Status' ), 
		'digital_gov_build_meta_box_callback', 
		'post', 
		'side',
		'default',
		// hide the meta box in Gutenberg
		array('__back_compat_meta_box' => true)
	 );
}

// build meta box
function digital_gov_build_meta_box_callback( $post ){
	  wp_nonce_field( 'digital_gov_save_meta_box_data', 'digital_gov_meta_box_nonce' );
	  $status = get_post_meta( $post->ID, '_digital_gov_page_status', true );
	  ?>
	  <div class="inside">
	  	  <p><strong>status</strong></p>
		  <p><input type="text" id="digital_gov_page_status" name="digital_gov_page_status" value="<?php echo esc_attr( $status ); ?>" /></p>	
	  </div>
	  <?php
}
add_action( 'add_meta_boxes', 'digital_gov_add_meta_box' );
// save metadata
function digital_gov_save_meta_box_data( $post_id ) {
	if ( ! isset( $_POST['digital_gov_meta_box_nonce'] ) )
		return;
	if ( ! wp_verify_nonce( $_POST['digital_gov_meta_box_nonce'], 'digital_gov_save_meta_box_data' ) )
		return;
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE )
		return;
	if ( ! current_user_can( 'edit_post', $post_id ) )
		return;

	if ( ! isset( $_POST['digital_gov_page_status'] ) )
		return;

	$status = sanitize_text_field( $_POST['digital_gov_page_status'] );

	update_post_meta( $post_id, '_digital_gov_page_status', $status );
}
add_action( 'save_post', 'digital_gov_save_meta_box_data' );

/**
 * Register the custom meta fields
 */
function digital_gov_register_meta() {

    $metafields = [ '_digital_gov_page_status'];

    foreach( $metafields as $metafield ){
        // Pass an empty string to register the meta key across all existing post types.
        register_post_meta( '', $metafield, array(
            'show_in_rest' => true,
            'type' => 'string',
            'single' => true,
            'sanitize_callback' => 'sanitize_text_field',
            'auth_callback' => function() { 
                return current_user_can( 'edit_posts' );
            }
        ));
    }  
}
add_action( 'init', 'digital_gov_register_meta' );


