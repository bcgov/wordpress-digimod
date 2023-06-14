<?php
/**
 * Plugin Name:       Restrict Content Plugin
 * Description:       Example block scaffolded with Create Block tool.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       restrictcontentplugin
 *
 * @package           create-block
 */

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */

function my_protected_block() {
    register_block_type( __DIR__ . '/build');
}

add_action('init', 'my_protected_block');



function filter_protected_blocks($block_content, $block) {
    if ($block['blockName'] === 'digimod/restrictcontentblock') {  // replace with your block name
        if (!is_user_logged_in()) {
            //not logged in, replace with a login button
			return '
            <script>
                function setRedirCookie(){
                    let name = "my_login_redirect";
                    let value = window.location.href;

                    var date = new Date();
                    // Set it expire in 5 minutes
                    date.setTime(date.getTime() + (5*60*1000));
                    var expires = "; expires=" + date.toUTCString();
                    document.cookie = name + "=" + (value || "") + expires + "; path=/";

                    window.location = "/?option=oauthredirect&app_name=keycloak";
                }
            </script>

            <p>You must be logged in to view this content. 
                <div class="wp-block-button has-size-regular">
                    <a href="/?option=oauthredirect&app_name=keycloak" onclick="setRedirCookie(); return false;" tabindex="0" class="wp-block-button__link wp-element-button" data-text="Login with IDIR">Login with IDIR</a>
                </div>
            </p>';
			}
            // href="'.wp_login_url(get_permalink()).'"
    }

    // // for other blocks or if user is logged in, return the original block content
     return $block_content;
}

add_filter('render_block', 'filter_protected_blocks', 10, 2);

function my_login_init() {
    if(isset($_REQUEST['redirect_to'])){
        $redirect_url = $_REQUEST['redirect_to'];
		#echo 'The login init filter fired. setting cookie';
        #set the cookie duration for 5 minutes
        setcookie( 'my_login_redirect', $redirect_url, time() + ( 5 * 60 ), COOKIEPATH, COOKIE_DOMAIN );
    }
	if ( $_SERVER['REQUEST_URI'] == wp_login_url() || $_SERVER['REQUEST_URI'] == site_url( '/wp-login.php', 'login' ) ) {
        #echo 'login page - redirecting';
		wp_redirect( site_url( '/?option=oauthredirect&app_name=keycloak' ) );
        exit();
    }
}
add_action( 'login_init', 'my_login_init' );

function my_homepage_redirect() {
    // Check if user is on the home page
	#echo 'The login_redirect filter fired. checking cookie';
    if ( is_front_page()) {
		#echo 'The my_homepage_redirect filter fired. is home';
        // Check if the my_login_redirect cookie is set
        if ( isset( $_COOKIE['my_login_redirect'] ) ) {
            // Get the URL from the cookie
			#echo 'The my_homepage_redirect filter fired. Redirecting user.';
            $redirect_url = $_COOKIE['my_login_redirect'];
			// Delete the my_login_redirect cookie
            unset( $_COOKIE['my_login_redirect'] );
            setcookie( 'my_login_redirect', '', time() - 3600, COOKIEPATH, COOKIE_DOMAIN );
            // Redirect to the URL
            wp_redirect( $redirect_url );
            exit;
        }
    }
}
add_action( 'template_redirect', 'my_homepage_redirect' );

/*hide the login fields so users must use Keycloak*/
function custom_login_styles() {
    echo '<style>
        .user-pass-wrap, #user_login,.login label[for="user_login"], .forgetmenot, .submit, #nav {
            display: none;
        }
    </style>';
}
add_action( 'login_enqueue_scripts', 'custom_login_styles' );