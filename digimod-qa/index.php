<?php
/**
* Plugin Name: DIGIMOD - QA functionality
* Description: Changes WordPress workflow to include QA functionality through IDIR protection
* Version: 2.0.2
* Author: Digimod
* License: GPL-2.0+
* License URI: http://www.gnu.org/licenses/gpl-2.0.txt
*/

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Beta testing - run only on specific pages
// array(9158,9174,9179,11108,9493,9675,9721,9750,9772,10089,10125,10107,10796,10232,10513,10535,10568,10553,10348,10590,10622,10633,10650,10017,7686,13102,10138,13125,13009,13072,13148);

function get_qa_ids(){
    // Get the restricted post IDs from the saved settings
    $restricted_posts = get_option('custom_qa_restricted_urls_enabled', '');

    // Convert the saved IDs to an array
    $restricted_post_ids = array_filter(array_map('trim', explode(PHP_EOL, $restricted_posts)));
    return $restricted_post_ids;
}

function qa_runOnClient(){
    global $post;
    $qa_ids=get_qa_ids();
    
    if ( !isset( $post ) ) { // global post object is not set - do not run qa functionality on this page (for example 404)
        return false;
    }

    $current_url = get_permalink($post->ID);
    $path = parse_url($current_url, PHP_URL_PATH);
    
    if ( is_singular( 'wcag' ) || (is_array($qa_ids) && in_array($post->ID,$qa_ids))) {
        return true;
    }else{
        return false;
    }
}

// Beta testing - run only on specific pages
function qa_runOnAdmin(){
    global $post;

    // Make sure we're on an admin page and it's the post editor
    if (is_admin() && get_current_screen()->base == 'post') {
        return qa_runOnAdmin_checkPostID($post->ID);
    }
    return false;
}

function qa_enqueue_admin_script($hook) {
    global $typenow;

    // Don't load for the block editor (Gutenberg)
    if ($hook === 'post.php' || $hook === 'post-new.php') {
        return;
    }
    
    if ($typenow=="wcag"){ // todo: remove this once out of beta
        // If user has "restrict_publish_to_qa_only" capability, then enqeue the script that modifies the admin interface
        // Will hide published posts from view and only leave rewrite-republish posts (if exists)
        // if they don't exist, then will replace the edit button to act as a rewrite and republish button
        // NEW: do this for all users instead of just restrict_publish_to_qa_only users
        $current_user = wp_get_current_user();
        $role = $current_user->roles[0]; 
        // if (current_user_can('restrict_publish_to_qa_only') && $role!='administrator'){
            wp_enqueue_script( 'qa_admin', plugin_dir_url( __FILE__ ) . 'qa-admin.js', array( 'jquery' ), '1.0', true );
        // }
        
    }
}

// Hook into the 'admin_enqueue_scripts' action
add_action('admin_enqueue_scripts', 'qa_enqueue_admin_script');


function qa_enqueue_admin_script_all() {
    global $typenow;
    if ($typenow=="wcag"){ // todo: remove this once out of beta
        wp_enqueue_script( 'qa-admin-all', plugin_dir_url( __FILE__ ) . 'qa-admin-all.js', array( 'jquery', 'wp-edit-post' ), '1.0', true );
    }
}
add_action( 'admin_enqueue_scripts', 'qa_enqueue_admin_script_all' );


function qa_runOnAdmin_checkPostID($postId){
    $qa_ids=get_qa_ids();

    $post_type = get_post_type($postId);

    $current_url = get_permalink($postId);
    $path = parse_url($current_url, PHP_URL_PATH);
    
    if ($post_type == 'wcag' || in_array($postId,$qa_ids)) {
        // This is a 'wcag' post type
        // Perform your actions here
        return true;
    }else{
        // check if it's a rewrite and republish post, and if the original is in the allowed list, run admin scripts
        $origId = qa_get_orig_id_from_rewrite_and_republish_id($postId);
        if($origId){
            if(in_array($origId,$qa_ids)){
                return true;
            }
        }
    }

    return false;
}

add_action('admin_head', 'qa_runOnAdmin');

// Enqueue JS for the editor
function publish_to_qa_button_enqueue() {
    if (!qa_runOnAdmin()){
        return;
    }
    wp_enqueue_script( 'publish-to-qa-button', plugin_dir_url( __FILE__ ) . 'publish-to-qa.js', array( 'jquery', 'wp-edit-post' ), '1.0', true );
}
add_action( 'enqueue_block_editor_assets', 'publish_to_qa_button_enqueue' );

// function that checks if user can publish anything (by checking capabilities that start with "publish_")
function user_can_publish_any() {
    $current_user = wp_get_current_user();
    
    // If the user is not logged in, they won't have any capabilities
    if (!$current_user->exists()) {
        return false;
    }

    foreach ($current_user->allcaps as $cap => $granted) {
        if ($granted && strpos($cap, 'publish_') === 0) {
            return true;
        }
    }
    return false;
}

// this will remove "clone" and "new draft" buttons for non-admin users (while leaving "rewrite and republish")
function qa_my_admin_style($hook) {
    global $typenow;
    global $post;
    $current_user = wp_get_current_user();
    $role = null;
    // if ( !empty( $current_user->roles ) ) {
    //     // The user has roles, so we'll get the first one (users can have multiple roles)
    //     $role = $current_user->roles[0]; 
    //     if ($role!='administrator'){
    //         // not admin - hide publish button
    //         // wp_enqueue_style('my-admin-style', get_template_directory_uri() . '/css/remove-clone-and-new-draft.css');

            if ($hook === 'post.php' || $hook === 'post-new.php') {
                return;
            }
            
            if ($typenow=="wcag"){ // todo: remove this once out of beta
                wp_enqueue_style( 'hide-clone-and-new-draft',plugin_dir_url( __FILE__ ) . 'remove-clone-and-new-draft.css', false, '1.0', 'all' );
                $current_user = wp_get_current_user();
                $role = $current_user->roles[0]; 
                if (current_user_can('restrict_publish_to_qa_only') && $role!='administrator'){ // hide rewrite and republish option for contributors
                    wp_enqueue_style( 'hide-rewrite-republish',plugin_dir_url( __FILE__ ) . 'remove-rewrite-republish.css', false, '1.0', 'all' );
                }

            }
    //     }
    // }
    
}
add_action('admin_enqueue_scripts', 'qa_my_admin_style');

// Add editor style
function qa_enqueue_block_editor_styles() {
    if (!qa_runOnAdmin()){
        return;
    }

    global $post;
    $current_user = wp_get_current_user();
    $role = null;
    // if (!user_can_publish_any()){ // if user can't publish anything, don't show "publish" button at all
    if ( !empty( $current_user->roles ) ) {
        // The user has roles, so we'll get the first one (users can have multiple roles)
        $role = $current_user->roles[0]; 
        if ($role!='administrator'){
            // not admin - hide publish button
            wp_enqueue_style( 'my-block-editor-styles',plugin_dir_url( __FILE__ ) . 'editor-style.css', false, '1.0', 'all' );

            $postStatus = get_post_status($post->ID ); 

            if ($postStatus=='publish'){
                // not admin and it's published - hide switch to draft button
                wp_enqueue_style( 'hide-all',plugin_dir_url( __FILE__ ) . 'hide-all.css', false, '1.0', 'all' );
            }
        }
    }

    wp_enqueue_style( 'qa-editor-global',plugin_dir_url( __FILE__ ) . 'editor-global.css', false, '1.0', 'all' );
}
add_action( 'enqueue_block_editor_assets', 'qa_enqueue_block_editor_styles' );

// Register custom states

// function my_custom_post_status(){
//     register_post_status( 'awaiting_review', array(
//          'label'                     => _x( 'Awaiting Review', 'post' ),
//          'public'                    => true,
//          'exclude_from_search'       => true,
//          'show_in_admin_all_list'    => true,
//          'show_in_admin_status_list' => true,
//          'label_count'               => _n_noop( 'Awaiting Review <span class="count">(%s)</span>', 'Awaiting Review <span class="count">(%s)</span>' ),
//     ));
// }
// add_action( 'init', 'my_custom_post_status' );


// API endpoint for toggling QA publish status

function digimod_qa_toggle( $request ) {
    $data =  $request->get_body_params();
    $postId = $data['postId'];
    $post = get_post( $postId );

    $post_type = get_post_type_object( $post->post_type );
    if ( !current_user_can( $post_type->cap->publish_posts ) ) {
        return;
    }

    $unpublish = false;
    if ( 'publish' !== get_post_status( $postId ) ) {
        $updated_post = array(
            'ID' => $postId,
            'post_status' => 'publish',
        );
    
         // Temporarily remove the action
         remove_action('transition_post_status', 'qa_restrict_publish_to_qa_only', 10);
        
         try{
            wp_update_post( $updated_post, true );
         }catch(Exception $e){}
         
         // Add the action back
         add_action('transition_post_status', 'qa_restrict_publish_to_qa_only', 10, 3);

    }else{
        $unpublish = true;
    }

    // Get the restricted post IDs from the saved settings
    $restricted_posts = get_option('custom_qa_restricted_urls', '');

    // Convert the saved IDs to an array
    $restricted_post_ids = array_filter(array_map('trim', explode(PHP_EOL, $restricted_posts)));

    // Check if the ID is not in the array
    $added = false;
    $removed = false;
    if (!in_array($postId, $restricted_post_ids)) {
        // If it's not in the array, add it
        $added=true;
        $restricted_post_ids[] = $postId;
    }else{
        // If it's in the array, remove it
        $removed = true;
        $post_index = array_search($postId, $restricted_post_ids);
        unset($restricted_post_ids[$post_index]);
    }

    // Convert the array back into a string, with each ID on a new line
    $restricted_posts = implode(PHP_EOL, $restricted_post_ids);

    // Save the updated list of post IDs
    update_option('custom_qa_restricted_urls', $restricted_posts);

    // echo('unpublish is: ');
    // echo($unpublish?'true':'false');
    if ($unpublish){
        // Unpublish the post
        $post->post_status = 'draft';
        wp_update_post($post);
    }

    if (!$unpublish && $removed){
        // this should not happen, but may because of js race condition or the like:
        // we removed the entry from the plugin, but we are not unpublishing??
    }

    // Return a response
    return new WP_REST_Response( array(
        'status' => $added,
    ), 200 );
}

add_action( 'rest_api_init', function () {
    register_rest_route( 'publish-to-qa/v1', '/endpoint', array(
        'methods' => 'POST',
        'callback' => 'digimod_qa_toggle',
        'permission_callback' => function () {
            return  is_user_logged_in();
          }
    ) );
});

// API endpoint to remove QA lock (used for "publish" feature for admin)
$duplicatingPost = false;
function digimod_qa_remove_qa_lock( $request ) {
    $current_user = wp_get_current_user();
    global $duplicatingPost;
    $role = null;
    if ( !empty( $current_user->roles ) ) {
        // The user has roles, so we'll get the first one (users can have multiple roles)
        $role = $current_user->roles[0]; 
        if ($role=='administrator'){
            $data =  $request->get_body_params();

            $postId = $data['postId'];
            

            // Get the restricted post IDs from the saved settings
            $restricted_posts = get_option('custom_qa_restricted_urls', '');

            // Convert the saved IDs to an array
            $restricted_post_ids = array_filter(array_map('trim', explode(PHP_EOL, $restricted_posts)));

            if (!in_array($postId, $restricted_post_ids)) {

            }else{
                // If it's in the array, remove it
                $post_index = array_search($postId, $restricted_post_ids);
                unset($restricted_post_ids[$post_index]);
            }

            // Convert the array back into a string, with each ID on a new line
            $restricted_posts = implode(PHP_EOL, $restricted_post_ids);

            // Save the updated list of post IDs
            update_option('custom_qa_restricted_urls', $restricted_posts);

            // Post is now published - setup a rewrite and republish clone
            $new_id = qa_create_rewrite_and_republish_post($postId);

            // Return a response
            return new WP_REST_Response( array(
                'redirectTo' => $new_id,
            ), 200 );
        }
    }
}

function qa_create_rewrite_and_republish_post($postId){
    $post = get_post( $postId );
    require_once(WP_PLUGIN_DIR . '/duplicate-post/src/post-duplicator.php');
    $duplicatingPost = true;
    $post_duplicator= new \Yoast\WP\Duplicate_Post\Post_Duplicator();
    $new_id = $post_duplicator->create_duplicate_for_rewrite_and_republish( $post );
    return $new_id;
}

add_action( 'rest_api_init', function () {
    register_rest_route( 'publish-to-qa/v1', '/remove-lock', array(
        'methods' => 'POST',
        'callback' => 'digimod_qa_remove_qa_lock',
        'permission_callback' => function () {
            return  is_user_logged_in();
          }
    ) );
});


// API endpoint to add QA lock - this is used for "unpublish" feature
function digimod_qa_add_qa_lock( $request ) {
    $current_user = wp_get_current_user();
    $role = null;
    if ( !empty( $current_user->roles ) ) {
        // The user has roles, so we'll get the first one (users can have multiple roles)
        $role = $current_user->roles[0]; 
        if ($role=='administrator'){
            $data =  $request->get_body_params();

            $postId = $data['postId'];
            $post = get_post( $postId );

            $post_meta = get_post_meta( $postId, '_dp_original', true );
            $is_rewrite_and_republish = !empty($post_meta );

            if ($is_rewrite_and_republish){
                // delete this rewrite and republish post
                wp_delete_post($postId, true);
                // get the original post id, and set that back to qa
                $postId = $post_meta ;
            }

            // Get the restricted post IDs from the saved settings
            $restricted_posts = get_option('custom_qa_restricted_urls', '');

            // Convert the saved IDs to an array
            $restricted_post_ids = array_filter(array_map('trim', explode(PHP_EOL, $restricted_posts)));

            if (!in_array($postId, $restricted_post_ids)) {
                $added=true;
                $restricted_post_ids[] = $postId;
            }

            // Convert the array back into a string, with each ID on a new line
            $restricted_posts = implode(PHP_EOL, $restricted_post_ids);

            // Save the updated list of post IDs
            update_option('custom_qa_restricted_urls', $restricted_posts);

            // Return a response
            if(!$is_rewrite_and_republish){
                return new WP_REST_Response( array(
                    'status' => 'ok',
                ), 200 );
            }else{
                return new WP_REST_Response( array(
                    'redirectTo' => $postId,
                ), 200 );
            }
        }
    }
}

add_action( 'rest_api_init', function () {
    register_rest_route( 'publish-to-qa/v1', '/add-lock', array(
        'methods' => 'POST',
        'callback' => 'digimod_qa_add_qa_lock',
        'permission_callback' => function () {
            return  is_user_logged_in();
          }
    ) );
});


// API endpoint for getting uer role

function digimod_qa_get_role( $request ) {
    $current_user = wp_get_current_user();
    $role = null;
    if ( !empty( $current_user->roles ) ) {
        // The user has roles, so we'll get the first one (users can have multiple roles)
        $role = $current_user->roles[0]; 
    } 

    // Return a response
    return new WP_REST_Response( array(
        'role' => $role,
    ), 200 );
}

add_action( 'rest_api_init', function () {
    register_rest_route( 'publish-to-qa/v1', '/get-user-role', array(
        'methods' => 'POST',
        'callback' => 'digimod_qa_get_role',
        'permission_callback' => function () {
            return  is_user_logged_in();
          }
    ) );
});


// function digimod_qa_request_publish( $request ) {
    
//     $data =  $request->get_body_params();
//     $postId = $data['postId'];

//     // Update the post into the database
//     $my_post = array(
//         'ID'           => $postId,
//         'post_status'   => 'awaiting_review',
//     );
//     wp_update_post( $my_post );

//     // Return a response
//     return new WP_REST_Response( array(
//         'status' => 'ok',
//     ), 200 );
// }

// add_action( 'rest_api_init', function () {
//     register_rest_route( 'publish-to-qa/v1', '/qa-request-publish', array(
//         'methods' => 'POST',
//         'callback' => 'digimod_qa_request_publish',
//         'permission_callback' => function () {
//             return  true; // TODO: implement //is_user_logged_in();
//           }
//     ) );
// });


// API endpoint to get the status of the page

function digimod_qa_get_status($request) {
    global $post;

    $data =  $request->get_body_params();
    $postId = $data['postId'];

    // get post status, e.g. "publish"
    $postStatus = get_post_status( $postId );

    // check if the post is a "rewrite and republish" post
    $is_rewrite_and_republish = !empty(get_post_meta( $postId, '_dp_original', true ));

    // Get the restricted post IDs from the saved settings
    $restricted_posts = get_option('custom_qa_restricted_urls', '');

    // Convert the saved IDs to an array
    $restricted_post_ids = array_filter(array_map('trim', explode(PHP_EOL, $restricted_posts)));

    // Check if the post ID is not in the array
    if (!in_array($postId, $restricted_post_ids)) {
        // it's not in the array
        return new WP_REST_Response( array(
            'status' => false,
            'postStatus' => $postStatus,
            'is_rewrite_and_republish'=>$is_rewrite_and_republish
        ), 200 );
    }else{
        // If it's in the array
        // Return a response
        return new WP_REST_Response( array(
            'status' => true,
            'postStatus' => $postStatus,
            'is_rewrite_and_republish'=>$is_rewrite_and_republish
        ), 200 );
    }

    // Convert the array back into a string, with each ID on a new line
    $restricted_posts = implode(PHP_EOL, $restricted_post_ids);

    // Save the updated list of post IDs
    update_option('custom_qa_restricted_urls', $restricted_posts);

    // The rest of the commented code can stay as is, 
    // as it seems unrelated to the switch from URLs to post IDs.
}

add_action( 'rest_api_init', function () {
    register_rest_route('publish-to-qa/v1', '/get-status', array(
        'methods' => 'POST',
        'callback' => 'digimod_qa_get_status',
        'permission_callback' => function () {
            return is_user_logged_in();
        }
    ));
});



// Serve QA pages instead of regular pages if user is logged in and there's a rewrite and republish page published to QA

function serve_rewrite_and_republish_version($post_object) {
    if (!qa_runOnClient()){
        return;
    }

    // only serve qa pages to users with appropriate role
    global $current_user;
    // print_r( $current_user->roles);

    // to access QA pages user should be in QA role OR be and administrator OR have a password
    if ((is_user_logged_in() && in_array('qa', $current_user->roles))  || (is_user_logged_in() && !in_array('administrator', $current_user->roles)) || passwordCheck()) {
        
    }else{
        return;
    }

    // Get the post types for which the "rewrite & republish" feature is enabled
    $bannerShown = false;
    $enabled_post_types = get_option( 'duplicate_post_types_enabled', array() );
    if ( in_array( $post_object->post_type, $enabled_post_types ) ) {
        // Check if there is a "rewrite & republish" version of the current post
        $republished_posts = get_posts( array(
            'post_type'      => $post_object->post_type,
            'post_status'    => 'draft', // You might need to adjust this depending on how your site handles "rewrite & republish" posts
            'posts_per_page' => 1,
            'meta_key'       => '_dp_original',
            'meta_value'     => $post_object->ID,
        ) );

        if ( !empty( $republished_posts ) ) {
            $bannerShown=true;
            // There is a "rewrite & republish" version of the post, so serve it instead
            $post_object = $republished_posts[0];
            add_action( 'wp_enqueue_scripts', 'qa_enqueue_custom_js' );
            $post_object->post_content = '<div style="
                display:none;
                text-align: center;
                background: #ff6200;
                z-index: 999;
                position: relative;
                font-weight: bold;
                color: white;
                padding: 10px;" id="qa-notification">You are viewing a QA version of the page. <span style="text-decoration:underline; cursor:pointer; display:none;" id="qa-exit-button">Exit</span></div>
                <script>
                    window.onload = function() {
                        // Check if cookie exists
                        var cookieName = "qa_guid"; // Replace with your actual cookie name
                        if (document.cookie.split(";").some((item) => item.trim().startsWith(cookieName + "="))) {
                            // If cookie exists, show the button
                            document.getElementById("qa-exit-button").style.display = "inline";
                        }
                        
                        // Add event listener to the Exit button
                        document.getElementById("qa-exit-button").addEventListener("click", function() {
                            // Delete the cookie by setting its expiration date to a past date
                            document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                            
                            // Optionally, you can reload the page or redirect the user
                            window.location.replace("/");
                        });
                    };
                </script>
            ' . $post_object->post_content; // Prepend custom HTML
            setup_postdata( $post_object );
        }
    }

    // if(!$bannerShown){
    //     // check if this is a regular QA post - also include banner
    //     $postId = $post_object->ID;

    //     // Get the restricted post IDs from the saved settings
    //     $restricted_posts = get_option('custom_qa_restricted_urls', '');
    
    //     // Convert the saved IDs to an array
    //     $restricted_post_ids = array_filter(array_map('trim', explode(PHP_EOL, $restricted_posts)));
    
    //     // Check if the post ID is not in the array
    //     if (in_array($postId, $restricted_post_ids)) {
    //         add_action( 'wp_enqueue_scripts', 'qa_enqueue_custom_js' );
    //         $post_object->post_content = '<div style="
    //             display:none;
    //             text-align: center;
    //             background: #ff6200;
    //             z-index: 999;
    //             position: relative;
    //             font-weight: bold;
    //             color: white;
    //             padding: 10px;" id="qa-notification">You are viewing a QA version of the page</div>' . $post_object->post_content; // Prepend custom HTML
    //         setup_postdata( $post_object );
    //     }
    // }
    
    
    return $post_object;
}
add_action( 'the_post', 'serve_rewrite_and_republish_version' );

// this function checks if there was ?password=... get request
// if so, it checks if the password matches password set in the plugin
// if password matches, a cookie with current guid gets issues
// this guid gets reset every 24 hours and when present in a cookie it gets compared to the current guid
// if guid in cookie matches, user can access QA pages
function passwordCheck(){
    // Name of your transient
    $transient_name = 'qa_guid';

    // Get the stored settings
    $options = get_option('qa_plugin_settings');

    if ($options){
        // Password saved in the plugin
        $saved_password = $options['password']; // Get the saved password

        // Check if password is sent in GET parameters and it matches the saved password
        if ( isset($_GET['password']) && $_GET['password'] === $saved_password ) {

            // Check if the GUID is not already saved or it's expired
            if ( false === ($guid = get_transient($transient_name)) ) {
                // Generate a new GUID
                $guid = wp_generate_uuid4();

                // Save the GUID in a transient that expires in 24 hours
                set_transient($transient_name, $guid, DAY_IN_SECONDS);
            }

            // Set the guid cookie - this will maintain the QA session
            setcookie('qa_guid', $guid, time() + DAY_IN_SECONDS, COOKIEPATH, COOKIE_DOMAIN, is_ssl());
            return true;
        }

        // Check if GUID is present in cookie and it matches the stored GUID
        if ( isset($_COOKIE['qa_guid']) && $_COOKIE['qa_guid'] === get_transient($transient_name) ) {
            return true;
        }
    }
    return false;
}

// Add orange banner indicating users are on the QA page
function add_custom_html_to_content($content) {
    global $post;
    $postId = $post->ID;

    // Get the restricted post IDs from the saved settings
    $restricted_posts = get_option('custom_qa_restricted_urls_enabled', '');

    // Convert the saved IDs to an array
    $restricted_post_ids = array_filter(array_map('trim', explode(PHP_EOL, $restricted_posts)));

    // Check if the post ID is not in the array
    if (in_array($postId, $restricted_post_ids)) {

        add_action( 'wp_enqueue_scripts', 'qa_enqueue_custom_js' );
        $custom_html = '<div style="
        display:none;
        text-align: center;
        background: #ff6200;
        z-index: 999;
        position: relative;
        font-weight: bold;
        color: white;
        padding: 10px;" id="qa-notification">You are viewing a QA version of the page. <span style="text-decoration:underline; cursor:pointer; display:none;" id="qa-exit-button">Exit</span></div>
        <script>
            window.onload = function() {
                // Check if cookie exists
                var cookieName = "qa_guid"; // Replace with your actual cookie name
                if (document.cookie.split(";").some((item) => item.trim().startsWith(cookieName + "="))) {
                    // If cookie exists, show the button
                    document.getElementById("qa-exit-button").style.display = "inline";
                }
                
                // Add event listener to the Exit button
                document.getElementById("qa-exit-button").addEventListener("click", function() {
                    // Delete the cookie by setting its expiration date to a past date
                    document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                    
                    // Optionally, you can reload the page or redirect the user
                    window.location.replace("/");
                });
            };
        </script>
        ';
        
        // Only add custom HTML for single posts.
        $content = $custom_html . $content;
    }

    return $content;
}
add_filter('the_content', 'add_custom_html_to_content');

function qa_enqueue_custom_js() {
    wp_register_script('custom_js', false);
    wp_enqueue_script('custom_js');
    wp_add_inline_script('custom_js', '
        document.addEventListener("DOMContentLoaded", (event) => {
            var element = document.getElementById("qa-notification");
            if (element) {
                element.style.display = "block";
                document.body.insertBefore(element, document.body.firstChild);
            }
        });
    ');
}


// Admin UI

function custom_qa_restricted_urls_enabled_menu() {
    add_options_page(
        'QA Enabled Pages',
        'QA Enabled Pages',
        'manage_options',
        'custom-qa-restricted-urls-enabled',
        'custom_qa_restricted_urls_enabled_settings_page'
    );
}

add_action('admin_menu', 'custom_qa_restricted_urls_enabled_menu');

function custom_qa_restricted_urls_enabled_settings_page() {
    // Check user capabilities
    if (!current_user_can('manage_options')) {
        return;
    }

    // Save settings
    if (isset($_POST['submit']) && check_admin_referer('custom_qa_restricted_urls_enabled_settings')) {
        update_option('custom_qa_restricted_urls_enabled', sanitize_textarea_field($_POST['custom_qa_restricted_urls_enabled']));
    }

    // Load existing settings
    $restricted_urls = get_option('custom_qa_restricted_urls_enabled', '');

    ?>
    <div class="wrap">
        <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
        <form method="post" action="">
            <?php wp_nonce_field('custom_qa_restricted_urls_enabled_settings'); ?>
            <table class="form-table">
                <tr>
                    <th scope="row">
                        <label for="custom_qa_restricted_urls_enabled">QA Enabled Pages</label>
                    </th>
                    <td>
                        <textarea id="custom_qa_restricted_urls_enabled" name="custom_qa_restricted_urls_enabled" rows="10" cols="50" class="large-text code"><?php echo esc_textarea($restricted_urls); ?></textarea>
                        <p class="description">Enter one page ID per line.</p>
                    </td>
                </tr>
            </table>
            <?php submit_button(); ?>
        </form>
    </div>
    <?php
}

// Prevent actual access for QA pages by redirecting users to login page
function qa_custom_redirect_to_login() {
    if (!qa_runOnClient()){ // this page can be in QA
        return;
    }
    if (current_user_can('view_qa')) { // user can view qa pages, so we don't need to check anything else, allow
        return;
    }

    // Get the restricted post IDs from the saved settings
    $restricted_posts = get_option('custom_qa_restricted_urls', '');

    // Convert the saved IDs to an array
    $restricted_post_ids = array_filter(array_map('trim', explode(PHP_EOL, $restricted_posts)));

    // Get the current page post ID
    $current_page_id = get_queried_object_id();



    if(passwordCheck()){
        return;
    }



    if (!current_user_can('view_qa') && in_array($current_page_id, $restricted_post_ids) && is_user_logged_in() ) {
        // user is logged in, but can't view_qa, means this is a regular user, so redirect to home
        wp_redirect('/');
        exit;
    }

    // Check if the current page is restricted and the user is not logged in
    if (in_array($current_page_id, $restricted_post_ids) && !is_user_logged_in()) {
        // Get the login URL
        $login_url = wp_login_url(get_permalink($current_page_id));

        // Redirect the user to the login URL
        wp_redirect($login_url);
        exit;
    }
}

add_action('template_redirect', 'qa_custom_redirect_to_login');


// Register custom post type for QA
// function qa_my_custom_post_status() {
//     register_post_status('custom_status', array(
//         'label'                     => 'QA',
//         'public'                    => true,
//         'exclude_from_search'       => true,
//         'show_in_admin_all_list'    => true,
//         'show_in_admin_status_list' => true,
//         'label_count'               => _n_noop('QA <span class="count">(%s)</span>', 'QA <span class="count">(%s)</span>')
//     ));
// }
// add_action('init', 'qa_my_custom_post_status');

// Display "QA" status when viewing the list of pages for pages that are in QA
function qa_display_custom_state($states) {
    global $post;

    $postId = $post->ID;

    // Get the restricted post IDs from the saved settings
    $restricted_posts = get_option('custom_qa_restricted_urls', '');

    // Convert the saved IDs to an array
    $restricted_post_ids = array_filter(array_map('trim', explode(PHP_EOL, $restricted_posts)));

    // Check if the post ID is in the array
    if (in_array($postId, $restricted_post_ids)) {
        // Add the 'QA' state to the existing states
        $states[] = 'QA';
    }

    return $states;
}
add_filter( 'display_post_states', 'qa_display_custom_state' );


// detect a change in permalink - if user changed the permalink, make sure we delete old entry and add new permalink
// add_action( 'post_updated', 'qa_detect_permalink_change', 10, 3 );

// function qa_detect_permalink_change( $post_ID, $post_after, $post_before ) {
//     try{
//         if (!qa_runOnAdmin_checkPostID($post_ID)){
//             return;
//         }

//         if ($post_before->post_status == 'draft' && $post_after->post_status == 'publish') {
//             // The post has just been published for the first time
//             return;
//         }

//         // Get old and new permalinks
//         $old_permalink = get_permalink($post_before);
//         $new_permalink = get_permalink($post_after);

//         // Parse the paths from the permalinks
//         $old_path = parse_url($old_permalink, PHP_URL_PATH);
//         $new_path = parse_url($new_permalink, PHP_URL_PATH);

        
//         // Compare the old and new paths
//         if ($old_path != $new_path && $new_path!="/") {
//                 // Get the restricted URLs from the saved settings
//                 $restricted_urls = get_option('custom_qa_restricted_urls', '');

//                 // Convert the saved URLs to an array
//                 $restricted_page_urls = array_filter(array_map('trim', explode(PHP_EOL, $restricted_urls)));
//                 // echo("before: ");
//                 // print_r($restricted_page_urls);

//                 $restricted_page_urls[] = $new_path;
            
//                 $url_index = array_search($old_path, $restricted_page_urls);
//                 unset($restricted_page_urls[$url_index]);
                
//                 $restricted_urls = implode(PHP_EOL, $restricted_page_urls);

//                 // Save the updated list of URLs
//                 update_option('custom_qa_restricted_urls', $restricted_urls);
                
//         }
//     } catch (Exception $e) {
//         // just in case, otherwise will tell users that it failed to save the post, would rather fail silently (but shouldn't)
//     }
// }


// Prevent users that have publishing ability for the purposes of qa, but were assigned restrict_publish_to_qa_only from publishing to production
// the only publishing that should happen for these users is via the digimod_qa_toggle function and when we automatically put new pages into QA
$qa_except_publish = false; // Initialize your global variable

function qa_restrict_publish_to_qa_only($new_status, $old_status, $post) {
    global $qa_except_publish; // Use your global variable here

    if ($new_status == 'publish' && $old_status  !=  $new_status) {
        $user = wp_get_current_user();

        // If the user has the 'restrict_publish_to_qa_only' capability and they're not an administrator
        if ((in_array('restrict_publish_to_qa_only', (array) $user->allcaps) && !in_array('administrator', (array) $user->roles)) && !$qa_except_publish ) {
            // Prevent the user from publishing the page
            $post->post_status = $old_status;  // Change the post status to $old_status
            wp_update_post($post);
            wp_die('QA Plugin - Sorry, you are not allowed to publish pages on this site.'); // Stop the script
        }
    }
    $qa_except_publish = false; // Reset the global variable after use
}
add_action('transition_post_status', 'qa_restrict_publish_to_qa_only', 10, 3);

// put new pages into published state as soon as they are created
function qa_change_default_post_status( $data, $postarr ) {
    global $duplicatingPost;
    global $qa_except_publish; // Use your global variable here
    $qa_except_publish = true; // Set it to true as we are creating a post

    if ( !isset( $postarr['post_type'] ) || $postarr['post_type'] !== 'wcag' ) { // todo: remove once out of beta
        return $data;
    }

    // Check for the 'duplicate_post_rewrite' action in the URL.
    $is_rewrite_and_republish = isset($_GET['action']) && $_GET['action'] === 'duplicate_post_rewrite';

    // second flag is if we are duplicating the post programmatically, for example in case of "Publish" action
    // this is so after publish we can redirect users to the clone of the document instead of showing the published copy
    if($is_rewrite_and_republish || $duplicatingPost) 
        return $data;

    if( $data['post_status'] == 'auto-draft' ) { //  || $data['post_status'] == 'draft'
        $data['post_status'] = 'publish';
    }
    if( $data['post_title'] == 'Auto Draft' ) {
        $data['post_title'] = 'Untitled';
    }
    return $data;
}
add_filter( 'wp_insert_post_data', 'qa_change_default_post_status', 10, 2 );


// When a new post is being created, we have transitioned it automatically to QA (so it's in "published" state)
// now that it's in published state, add it to the QA restricted list and redirect user to the proper url
function qa_notify_new_published_post( $post_ID, $post, $update ) {
    global $pagenow;

    if (!qa_runOnAdmin_checkPostID($post_ID)) { // todo: remove once out of beta
        return;
    }

    if ( $post->post_status == 'publish' && !$update ) {  // Check if the post is being published and it is not an update
        // $is_rewrite_and_republish = !empty(get_post_meta( $postId, '_dp_original', true ));
        // if ($is_rewrite_and_republish)
        // {
        //     return;
        // }

        // Do something with $post_ID and $post here
        // Get the restricted post IDs from the saved settings
        $restricted_posts = get_option('custom_qa_restricted_urls', '');

        // Convert the saved IDs to an array
        $restricted_post_ids = array_filter(array_map('trim', explode(PHP_EOL, $restricted_posts)));

        $restricted_post_ids[] = $post_ID;
        
        // Convert the array back into a string, with each ID on a new line
        $restricted_posts = implode(PHP_EOL, $restricted_post_ids);

        // Save the updated list of post IDs
        update_option('custom_qa_restricted_urls', $restricted_posts);

        // echo('set transient');
        // set_transient( 'qa_redirect_after_creation', $post_ID, 30 );
        wp_redirect( admin_url("post.php?post=$post_ID&action=edit") );
    }
}
add_action( 'save_post', 'qa_notify_new_published_post', 10, 3 );


// function that returns false if rewrite and republish of a post doesn't exist, otherwise return rewrite and republish id for a given post
function qa_get_rewrite_and_republish_id( $original_post_id ) {
    $args = array(
        'post_type'  => 'any',
        'post_status' => 'draft',
        'meta_query' => array(
            array(
                'key'   => '_dp_original',
                'value' => $original_post_id,
            ),
        ),
    );
    $query = new WP_Query( $args );
    if ( $query->have_posts() ) {
        // Reset post data to ensure we're getting the first post in the query
        wp_reset_postdata();
        // Return the ID of the rewrite version
        return $query->posts[0]->ID;
    } else {
        return false;
    }
}

// check if a given postId is listed in the QA plugin
function qa_is_in_qa($postId){
    $restricted_posts = get_option('custom_qa_restricted_urls', '');

    // Convert the saved IDs to an array
    $restricted_post_ids = array_filter(array_map('trim', explode(PHP_EOL, $restricted_posts)));

    // Check if the ID is not in the array
    if (!in_array($postId, $restricted_post_ids)) {
        return false;
    }
    return true;
}

// function that checks if a given postId is the production version of the page
// must be "published" and not listed int he qa plugin
function qa_is_production_page($postId){
    $postStatus = get_post_status($postId); 
    if ($postStatus=='publish' && !qa_is_in_qa($postId)){
        return true;
    }
    return false;
}

function qa_get_orig_id_from_rewrite_and_republish_id($postId){
    $post_meta = get_post_meta( $postId, '_dp_original', true );
    $is_rewrite_and_republish = !empty($post_meta );
    if (!$is_rewrite_and_republish)
    {
        return false;
    }else{
        return $post_meta;
    }
}

// When user tries to load a production version of the page into the editor (for example after clicking "Republish")
// Redirect users to a rewrite and republish version of the page, as we don't want them accessing regular published page unless it's necessary
function qa_redirect_to_rewrite_and_republish() {
    

    global $pagenow;

    // Check if we're on a post edit screen
    if ( $pagenow === 'post.php' && isset( $_GET['post'] ) && isset( $_GET['action'] ) && $_GET['action'] === 'edit' ) {
        
        $original_post_id = $_GET['post'];

        if (!qa_runOnAdmin_checkPostID($original_post_id)) { // todo: remove once out of beta
            return;
        }

        if (!qa_is_production_page($original_post_id)){ // this is not a production page
            return;
        }
        
        $rewrite_id = qa_get_rewrite_and_republish_id( $original_post_id );
        
        if ( $rewrite_id ) {
            // Redirect to the rewrite and republish version of the post
            wp_redirect( admin_url( "post.php?post=$rewrite_id&action=edit" ) );
            exit;
        }else{
            // rewrite and republish doesn't exist - create one and redirect users to that 
            $rewrite_id=qa_create_rewrite_and_republish_post($original_post_id);
            wp_redirect( admin_url( "post.php?post=$rewrite_id&action=edit" ) );
            exit;
        }
    }
}
add_action( 'admin_init', 'qa_redirect_to_rewrite_and_republish' );


// if user is deleteing a rewrite and republish post, also delete the original post as well
// function qa_delete_original_on_rewrite_and_republish_delete( $post_id ) {
//     if (!qa_runOnAdmin_checkPostID($post_id)) { // todo: remove once out of beta
//         return;
//     }
//     // Check if the post being deleted is a "Rewrite and Republish" version

//     remove_action( 'wp_trash_post', 'qa_delete_original_on_rewrite_and_republish_delete' );

//     $original_post_id = get_post_meta( $post_id, '_dp_original', true );
//     if ( $original_post_id ) {
//         // The post is a "Rewrite and Republish" version, so delete the original post
//         // Use wp_delete_post with force delete true to bypass trash
//         wp_trash_post( $original_post_id );
//     }

//       // Add the action back
//       add_action( 'wp_trash_post', 'qa_delete_original_on_rewrite_and_republish_delete' );
// }
// add_action( 'wp_trash_post', 'qa_delete_original_on_rewrite_and_republish_delete' );


// QA PASSWORD UI
// Create an admin menu item and page
function qa_plugin_add_admin_menu() {
    add_options_page(
        'QA Password Settings',
        'QA Password Settings',
        'manage_options',
        'qa_plugin-settings',
        'qa_plugin_settings_page'
    );
}
add_action('admin_menu', 'qa_plugin_add_admin_menu');

// QA PASSWORD UI-Initialize settings
function qa_plugin_settings_init() {
    register_setting('qa_plugin', 'qa_plugin_settings');

    add_settings_section(
        'qa_plugin_section',
        __('QA Password Settings', 'qa_plugin'),
        '',
        'qa_plugin'
    );

    add_settings_field(
        'password',
        __('Password', 'qa_plugin'),
        'qa_plugin_password_render',
        'qa_plugin',
        'qa_plugin_section'
    );
}
add_action('admin_init', 'qa_plugin_settings_init');

// QA PASSWORD UI-Render the password input field
function qa_plugin_password_render() {
    $options = get_option('qa_plugin_settings');
    $pass = "";
    if ($options){
        $pass = $options['password'];
    }
    ?>
    <input type='text' name='qa_plugin_settings[password]' value='<?php echo $pass; ?>'>
    <?php
}

// QA PASSWORD UI-Render the settings page
function qa_plugin_settings_page() {
    ?>
    <form action='options.php' method='post'>
        <?php
        settings_fields('qa_plugin');
        do_settings_sections('qa_plugin');
        submit_button();
        ?>
    </form>
    <?php
}