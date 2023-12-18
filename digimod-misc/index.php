<?php
/**
* Plugin Name: DIGIMOD - miscellaneous
* Description: Miscellaneous features for DigitalGov; Defines WCAG Tag taxonomy, CLI Keycloak SSO/Miniorange adjuster.
* Version: 1.1.0
* Author: Digimod
* License: GPL-2.0+
* License URI: http://www.gnu.org/licenses/gpl-2.0.txt
* Plugin URI: https://github.com/bcgov/wordpress-digimod/tree/main/digimod-misc
* Update URI: https://raw.githubusercontent.com/bcgov/wordpress-digimod/main/digimod-misc/index.php
*/

/* 
Changelog

1.0.0 - Initial release.

1.1.0 - Added plugin check version against github
      - Added shortcode for 'Better Notifications for WP' to grab the logged in user
*/

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}




// Begin shortcode for notifications 

//BNFW grabs the post edited by user via the posts' lock meta. If this is not properly updated by WP, the notification will have the wrong author.
//  Lets add a new shortcode that actually grabs the logged in user.
//  Based on https://betternotificationsforwp.com/documentation/adding-custom-shortcodes/
function digimod_misc_bnfw_shortcode_logged_in_user() {
    $user = wp_get_current_user();

    return $user->user_login;
}
add_shortcode( 'digimod_logged_in_username', 'digimod_misc_bnfw_shortcode_logged_in_user', 1, 1 );
    

// end notification feature shortcode





// Begin function to check for updates to plugin
require_once "digimod-update-check.php";

add_action( 'init', 'digimod_misc_update_check_init' );
function digimod_misc_update_check_init(){
    if(class_exists('digimod_plugin_update_check')){
        new digimod_plugin_update_check(__FILE__, plugin_basename(__FILE__) );
    }
}
//End update check code.



// WCAG stuff
function register_wcag_tags(){
    // unregister_taxonomy('wcag_tag_TODO_RENAME');
    // unregister_taxonomy('wcag_tag');

    register_taxonomy(
        'wcag_tag',
        'wcag-card',
        array(
            'label' =>  __('WCAG Tag'),
            'show_in_rest' => true,
            'public' => true,
            'capabilities' => array(
                'manage_terms' => 'manage_wcag_tags',
                'edit_terms'   => 'edit_wcag_tags',
                'delete_terms' => 'delete_wcag_tags',
                'assign_terms' => 'assign_wcag_tags',
            )
        )
    );

    // todo: delete this
    // register_taxonomy(
    //     'wcag_tag_TODO_RENAME',
    //     'wcag',
    //     array(
    //         'label' =>  __('WCAG Tag'),
    //         'show_in_rest' => true,
    //         'public' => true,
    //         'capabilities' => array(
    //             'manage_terms' => 'manage_wcag_tags_del',
    //             'edit_terms'   => 'edit_wcag_tags_del',
    //             'delete_terms' => 'delete_wcag_tags_del',
    //             'assign_terms' => 'assign_wcag_tags_del',
    //         )
    //     )
    // );
}


add_action( 'init', 'register_wcag_tags', 0 );

//End WCAG Stuff










// CLI command to modify keycloak config (used for when the site gets imported to a different instance)
if ( defined( 'WP_CLI' ) ) {
	class Digimod_config_mo extends WP_CLI_Command {
		public function __invoke($args) {

            // [ssoprotocol] => xxx
            // [apptype] => xxx
            // [clientid] => xxx
            // [clientsecret] => xxx
            // [redirecturi] => xxx DO NOT CHANGE THIS - plugin hardcodes for this automatically
            // [send_headers] => xx
            // [send_body] => xx
            // [send_state] => xx
            // [show_on_login_page] => xx
            // [appId] => xx
            // [scope] => xxx
            // [authorizeurl] => "auth-server-url": "https://test.loginproxy.gov.bc.ca/auth"
            // [accesstokenurl] => xxx
            // [resourceownerdetailsurl] => 
            // [username_attr] => xxx

            
            $clientSecret = $args[0];
            $ssoURI = $args[1];
            $siteURL = $args[2];
            
            $appslist = get_option( 'mo_oauth_apps_list' );
            $app = $appslist['keycloak'];
            // WP_CLI::log('clientSecret: ');
            // WP_CLI::log($app['clientsecret']);
            
            //WP_CLI::log(implode(', ', $app));
            // WP_CLI::log(implode(', ', array_keys($app)));
            
             
            $app['clientsecret']=$clientSecret;//$clientSecret;
            $app['authorizeurl']=$ssoURI.'/realms/standard/protocol/openid-connect/auth';
            $app['accesstokenurl']=$ssoURI.'/realms/standard/protocol/openid-connect/token';
            $app['redirecturi']=$siteURL;
            $appslist['keycloak']=$app;
            update_option( 'mo_oauth_apps_list', $appslist );

			WP_CLI::success( 'Miniorange settings reconfigured!');
		}
	}

    WP_CLI::add_command( 'digimod-config-mo', 'Digimod_config_mo');
}