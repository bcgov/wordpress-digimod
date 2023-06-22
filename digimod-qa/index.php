<?php
/**
* Plugin Name: DIGIMOD - QA functionality
* Description: Adds "Publish to QA" button to the block editor
* Version: 1.0.0
* Author: Digimod
* License: GPL-2.0+
* License URI: http://www.gnu.org/licenses/gpl-2.0.txt
*/

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

function qa_runOnClient(){
    global $post;
    if ( !isset( $post ) ) { // global post object is not set - do not run qa functionality on this page (for example 404)
        return false;
    }

    $current_url = get_permalink($post->ID);
    $path = parse_url($current_url, PHP_URL_PATH);
    
    if ( is_singular( 'wcag' ) || get_the_title($post->ID)=="Web content accessibility guidelines (WCAG)" ) {
        return true;
    }else{
        return false;
    }
}

function qa_runOnAdmin(){
    global $post;

    // Make sure we're on an admin page and it's the post editor
    if (is_admin() && get_current_screen()->base == 'post') {
        return qa_runOnAdmin_checkPostID($post->ID);
    }
    return false;
}

function qa_runOnAdmin_checkPostID($postId){
    $post_type = get_post_type($postId);

    $current_url = get_permalink($postId);
    $path = parse_url($current_url, PHP_URL_PATH);
    
    if ($post_type == 'wcag' || get_the_title($postId)=="Web content accessibility guidelines (WCAG)") {
        // This is a 'wcag' post type
        // Perform your actions here
        return true;
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
function my_admin_style() {
    global $post;
    $current_user = wp_get_current_user();
    $role = null;
    if ( !empty( $current_user->roles ) ) {
        // The user has roles, so we'll get the first one (users can have multiple roles)
        $role = $current_user->roles[0]; 
        if ($role!='administrator'){
            // not admin - hide publish button
            // wp_enqueue_style('my-admin-style', get_template_directory_uri() . '/css/remove-clone-and-new-draft.css');
            wp_enqueue_style( 'hide-clone-and-new-draft',plugin_dir_url( __FILE__ ) . 'remove-clone-and-new-draft.css', false, '1.0', 'all' );
        }
    }
    
}
add_action('admin_enqueue_scripts', 'my_admin_style');

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
    // global $post;
    $data =  $request->get_body_params();

    $postId = $data['postId'];
    $post = get_post( $postId );

    $post_type = get_post_type_object( $post->post_type );
    if ( !current_user_can( $post_type->cap->publish_posts ) ) {
        return;
    }

    // Check if the post exists and is published
    $unpublish = false;
    if ( 'publish' !== get_post_status( $postId ) ) {
        // echo('published\r\n');
        // wp_publish_post( $post );
        $updated_post = array(
            'ID' => $postId,
            'post_status' => 'publish',
        );
    
        wp_update_post( $updated_post, true );

    }else{
        $unpublish = true;
    }

    $current_url = get_permalink($postId);

    // echo('postId: '.$postId.'\r\n');
    // echo('permalink: '. $current_url.'\r\n');

    $path = parse_url($current_url, PHP_URL_PATH);

    // Get the restricted URLs from the saved settings
    $restricted_urls = get_option('custom_qa_restricted_urls', '');

    // Convert the saved URLs to an array
    $restricted_page_urls = array_filter(array_map('trim', explode(PHP_EOL, $restricted_urls)));
    // echo("before: ");
    // print_r($restricted_page_urls);

    // Check if the URL is not in the array
    $added = false;
    $url_to_add = $path;
    if (!in_array($url_to_add, $restricted_page_urls) && $url_to_add!="/") {
        // If it's not in the array, add it
        $added=true;
        $restricted_page_urls[] = $url_to_add;
    }else{
        // If it's in the array, remove it
        
        $url_index = array_search($url_to_add, $restricted_page_urls);
        // echo('$url_to_add: '.$url_to_add);
        // echo('unsetting: '. $url_index);
        unset($restricted_page_urls[$url_index]);
    }

    // Convert the array back into a string, with each URL on a new line
    // echo('after: ');
    // print_r($restricted_page_urls);
    $restricted_urls = implode(PHP_EOL, $restricted_page_urls);

    // Save the updated list of URLs
    update_option('custom_qa_restricted_urls', $restricted_urls);

    if ($unpublish){
        // Unpublish the post
        $post->post_status = 'draft';
        wp_update_post($post);
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
function digimod_qa_remove_qa_lock( $request ) {
    $current_user = wp_get_current_user();
    $role = null;
    if ( !empty( $current_user->roles ) ) {
        // The user has roles, so we'll get the first one (users can have multiple roles)
        $role = $current_user->roles[0]; 
        if ($role=='administrator'){
            // global $post;
            $data =  $request->get_body_params();

            $postId = $data['postId'];
            $post = get_post( $postId );


            $current_url = get_permalink($postId);
            $path = parse_url($current_url, PHP_URL_PATH);

            // Get the restricted URLs from the saved settings
            $restricted_urls = get_option('custom_qa_restricted_urls', '');

            // Convert the saved URLs to an array
            $restricted_page_urls = array_filter(array_map('trim', explode(PHP_EOL, $restricted_urls)));

            $url_to_add = $path;
            if (!in_array($url_to_add, $restricted_page_urls)) {

            }else{
                // If it's in the array, remove it
                
                $url_index = array_search($url_to_add, $restricted_page_urls);
                // echo('$url_to_add: '.$url_to_add);
                // echo('unsetting: '. $url_index);
                unset($restricted_page_urls[$url_index]);
            }

            // Convert the array back into a string, with each URL on a new line
            // echo('after: ');
            // print_r($restricted_page_urls);
            $restricted_urls = implode(PHP_EOL, $restricted_page_urls);

            // Save the updated list of URLs
            update_option('custom_qa_restricted_urls', $restricted_urls);

            // Return a response
            return new WP_REST_Response( array(
                'status' => 'ok',
            ), 200 );
            
        }
    }
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

    $current_url = get_permalink($data['postId']);
    $path = parse_url($current_url, PHP_URL_PATH);

    
    // get post status, e.g. "publish"
    $postStatus = get_post_status( $data['postId'] );

    // check if the post is a "rewrite and republish" post
    $is_rewrite_and_republish = !empty(get_post_meta( $data['postId'], '_dp_original', true ));

    // Get the restricted URLs from the saved settings
    $restricted_urls = get_option('custom_qa_restricted_urls', '');

    // Convert the saved URLs to an array
    $restricted_page_urls = array_filter(array_map('trim', explode(PHP_EOL, $restricted_urls)));

    // Check if the URL is not in the array
    $url_to_add = $path;
    if (!in_array($url_to_add, $restricted_page_urls)) {
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

    // Convert the array back into a string, with each URL on a new line
    $restricted_urls = implode(PHP_EOL, $restricted_page_urls);

    // Save the updated list of URLs
    update_option('custom_qa_restricted_urls', $restricted_urls);

    // Make sure user is logged in
    // if ( ! is_user_logged_in() ) {
    //     return new WP_Error( 'not_logged_in', 'You must be logged in to access this endpoint.', array( 'status' => 401 ) );
    // }
    
    // Make sure user has the 'editor' role. Replace 'editor' with the role you want to check for.
    // $user = wp_get_current_user();
    // if ( ! in_array( 'editor', (array) $user->roles ) ) {
    //     return new WP_Error( 'not_authorized', 'You do not have access to this endpoint.', array( 'status' => 403 ) );
    // }

    // $post_id = ... // The ID of the post or page you want to check

    // if ( current_user_can( 'edit_post', $post_id ) ) {
    //     // The user can edit the post or page
    // } else {
    //     // The user cannot edit the post or page
    // }


    // Handle the request here. $request contains the data sent in the request.
    // For example, to get JSON data sent in the request, you could do:
    // $data = json_decode($request->get_body());
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
    if ( is_user_logged_in() ) {
        if (!qa_runOnClient()){
            return;
        }

        // only serve qa pages to users with appropriate role
        global $current_user;
        // print_r( $current_user->roles);
        if (!in_array('qa', $current_user->roles)  && !in_array('administrator', $current_user->roles)) {
            return;
        }

        // Get the post types for which the "rewrite & republish" feature is enabled
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
                // There is a "rewrite & republish" version of the post, so serve it instead
                $post_object = $republished_posts[0];
                add_action( 'wp_enqueue_scripts', 'enqueue_custom_js' );
                $post_object->post_content = '<div style="
                    display:none;
                    text-align: center;
                    background: #ff6200;
                    z-index: 999;
                    position: relative;
                    font-weight: bold;
                    color: white;
                    padding: 10px;" id="qa-notification">You are viewing a QA version of the page</div>' . $post_object->post_content; // Prepend custom HTML
                setup_postdata( $post_object );
            }
        }
    }
    
    return $post_object;
}
add_action( 'the_post', 'serve_rewrite_and_republish_version' );

function enqueue_custom_js() {
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


// UI



function custom_qa_restricted_urls_menu() {
    add_options_page(
        'Restricted QA URLs',
        'Restricted QA URLs',
        'manage_options',
        'custom-qa-restricted-urls',
        'custom_qa_restricted_urls_settings_page'
    );
}

add_action('admin_menu', 'custom_qa_restricted_urls_menu');

function custom_qa_restricted_urls_settings_page() {
    // Check user capabilities
    if (!current_user_can('manage_options')) {
        return;
    }

    // Save settings
    if (isset($_POST['submit']) && check_admin_referer('custom_qa_restricted_urls_settings')) {
        update_option('custom_qa_restricted_urls', sanitize_textarea_field($_POST['custom_qa_restricted_urls']));
    }

    // Load existing settings
    $restricted_urls = get_option('custom_qa_restricted_urls', '');

    ?>
    <div class="wrap">
        <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
        <form method="post" action="">
            <?php wp_nonce_field('custom_qa_restricted_urls_settings'); ?>
            <table class="form-table">
                <tr>
                    <th scope="row">
                        <label for="custom_qa_restricted_urls">Restricted URLs</label>
                    </th>
                    <td>
                        <textarea id="custom_qa_restricted_urls" name="custom_qa_restricted_urls" rows="10" cols="50" class="large-text code"><?php echo esc_textarea($restricted_urls); ?></textarea>
                        <p class="description">Enter one URL per line. URLs should be relative to your site's domain (e.g., /restricted-page-1/).</p>
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

    // Get the restricted URLs from the saved settings
    $restricted_urls = get_option('custom_qa_restricted_urls', '');

    // Convert the saved URLs to an array
    $restricted_page_urls = array_filter(array_map('trim', explode(PHP_EOL, $restricted_urls)));

    // Get the current page URL path
    $current_page_url = strtok($_SERVER["REQUEST_URI"], '?');

    if (!current_user_can('view_qa') && in_array($current_page_url, $restricted_page_urls) && is_user_logged_in() ) {
        // user is logged in, but can't view_qa, means this is a regular user, so redirect to home
        wp_redirect('/');
        exit;
    }

    // Check if the current page is restricted and the user is not logged in
    if (in_array($current_page_url, $restricted_page_urls) && !is_user_logged_in()) {
        // Get the login URL
        $login_url = wp_login_url(home_url($current_page_url));

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

function qa_display_custom_state($states) {
    global $post;

    $postId = $post->ID;

    $current_url = get_permalink($postId);

    // echo('postId: '.$postId.'\r\n');
    // echo('permalink: '. $current_url.'\r\n');

    $path = parse_url($current_url, PHP_URL_PATH);

    // Get the restricted URLs from the saved settings
    $restricted_urls = get_option('custom_qa_restricted_urls', '');

    // Convert the saved URLs to an array
    $restricted_page_urls = array_filter(array_map('trim', explode(PHP_EOL, $restricted_urls)));
    // echo("before: ");
    // print_r($restricted_page_urls);

    // Check if the URL is not in the array
    $url_to_add = $path;
    if (in_array($url_to_add, $restricted_page_urls)) {
        return array('QA');
    }
    // $arg = get_query_var( 'post_status' );
    
    // if($arg !== 'qa'){
    //     if($post->post_status == 'qa'){
    //         return array('QA');
    //     }
    // }
    return $states;
}
add_filter( 'display_post_states', 'qa_display_custom_state' );


// detect a change in permalink - if user changed the permalink, make sure we delete old entry and add new permalink
add_action( 'post_updated', 'qa_detect_permalink_change', 10, 3 );

function qa_detect_permalink_change( $post_ID, $post_after, $post_before ) {
    try{
        if (!qa_runOnAdmin_checkPostID($post_ID)){
            return;
        }

        if ($post_before->post_status == 'draft' && $post_after->post_status == 'publish') {
            // The post has just been published for the first time
            return;
        }

        // Get old and new permalinks
        $old_permalink = get_permalink($post_before);
        $new_permalink = get_permalink($post_after);

        // Parse the paths from the permalinks
        $old_path = parse_url($old_permalink, PHP_URL_PATH);
        $new_path = parse_url($new_permalink, PHP_URL_PATH);

        
        // Compare the old and new paths
        if ($old_path != $new_path) {
                // Get the restricted URLs from the saved settings
                $restricted_urls = get_option('custom_qa_restricted_urls', '');

                // Convert the saved URLs to an array
                $restricted_page_urls = array_filter(array_map('trim', explode(PHP_EOL, $restricted_urls)));
                // echo("before: ");
                // print_r($restricted_page_urls);

                $restricted_page_urls[] = $new_path;
            
                $url_index = array_search($old_path, $restricted_page_urls);
                unset($restricted_page_urls[$url_index]);
                
                $restricted_urls = implode(PHP_EOL, $restricted_page_urls);

                // Save the updated list of URLs
                update_option('custom_qa_restricted_urls', $restricted_urls);
                
        }
    } catch (Exception $e) {
        // just in case, otherwise will tell users that it failed to save the post, would rather fail silently (but shouldn't)
    }
}