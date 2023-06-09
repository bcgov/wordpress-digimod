<?php
/**
* Plugin Name: DIGIMOD - QA functionality
* Description: Adds "Publish to QA" button to the full site editor
* Version: 1.0.0
* Author: Digimod
* License: GPL-2.0+
* License URI: http://www.gnu.org/licenses/gpl-2.0.txt
*/

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Enqueue JS for the editor
function publish_to_qa_button_enqueue() {
    wp_enqueue_script( 'publish-to-qa-button', plugin_dir_url( __FILE__ ) . 'publish-to-qa.js', array( 'jquery', 'wp-edit-post' ), '1.0', true );
}
add_action( 'enqueue_block_editor_assets', 'publish_to_qa_button_enqueue' );

function qa_enqueue_block_editor_styles() {
    global $post;
    $current_user = wp_get_current_user();
    $role = null;
    if ( !empty( $current_user->roles ) ) {
        // The user has roles, so we'll get the first one (users can have multiple roles)
        $role = $current_user->roles[0]; 
        if ($role!='administrator'){
            // not admin - hide publish button
            wp_enqueue_style( 'my-block-editor-styles',plugin_dir_url( __FILE__ ) . 'editor-style.css', false, '1.0', 'all' );

            $postStatus = get_post_status($post->ID ); 

            if ($postStatus=='publish'){
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
    $restricted_urls = get_option('custom_restricted_urls', '');

    // Convert the saved URLs to an array
    $restricted_page_urls = array_filter(array_map('trim', explode(PHP_EOL, $restricted_urls)));
    // echo("before: ");
    // print_r($restricted_page_urls);

    // Check if the URL is not in the array
    $added = false;
    $url_to_add = $path;
    if (!in_array($url_to_add, $restricted_page_urls)) {
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
    update_option('custom_restricted_urls', $restricted_urls);

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
    $restricted_urls = get_option('custom_restricted_urls', '');

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
    update_option('custom_restricted_urls', $restricted_urls);

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

// This approach simply redirects users to the preview page of the rewrite and republish page
// function serve_rewrite_and_republish_version() {
//     if ( is_user_logged_in() ) {
//         global $post;

//         // Get the post types for which the "rewrite & republish" feature is enabled
//         $enabled_post_types = get_option( 'duplicate_post_types_enabled', array() );

//         if ( in_array( $post->post_type, $enabled_post_types ) ) {
//             // Check if there is a "rewrite & republish" version of the current post
//             $republished_post = get_posts( array(
//                 'post_type'      => $post->post_type,
//                 'post_status'    => 'draft', // You might need to adjust this depending on how your site handles "rewrite & republish" posts
//                 'posts_per_page' => 1,
//                 'meta_key'       => '_dp_original',
//                 'meta_value'     => $post->ID,
//             ) );

//             if ( !empty( $republished_post ) ) {
//                 // There is a "rewrite & republish" version of the post, so redirect to it
//                 wp_redirect( get_permalink( $republished_post[0]->ID ) );
//                 exit;
//             }
//         }
//     }
// }
// add_action( 'template_redirect', 'serve_rewrite_and_republish_version' );


function serve_rewrite_and_republish_version($post_object) {
    if ( is_user_logged_in() ) {
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