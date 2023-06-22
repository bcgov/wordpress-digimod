<?php
/**
* Plugin Name: DIGIMOD - miscellaneous
* Description: Defines WCAG Tag taxonomy
* Version: 1.0.0
* Author: Digimod
* License: GPL-2.0+
* License URI: http://www.gnu.org/licenses/gpl-2.0.txt
*/

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

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




// CLI command to modify keycloak config (used for when the site gets imported to a different instance)


if ( ! defined( 'ABSPATH' ) ) {
	die( 'Kangaroos cannot jump here' );
}

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
            $siteURL =  'https://'.$args[2];
            $ssoURI='n/a';
            switch ($args[1]) {
                case 'test':
                    $ssoURI = 'dev.';
                    break;
                case 'stage':
                    $ssoURI = 'test.';
                    break;
                case 'prod':
                    $ssoURI = '';
                    break;
                default:
                    echo "No SSO integration set up for $args[1]";
                    exit(1);
                    break;
            }
            
            
            $ssoURI = 'https://'.$ssoURI.'loginproxy.gov.bc.ca/auth';
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