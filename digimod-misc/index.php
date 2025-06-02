<?php

/**
 * Plugin Name: DIGIMOD - miscellaneous
 * Description: Miscellaneous features for DigitalGov; Defines WCAG Tag taxonomy, CLI Keycloak SSO/Miniorange adjuster.
 * Version: 1.2.5
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

1.2.0 - Added enabling custom admin notification banner under Admin Settings menu.

1.2.1 - Added admin notice to not upgrade AIO SEO past 4.7.1.1 until further notice, as 4.7.2 breaks gutenberg on WP 6.4.3

1.2.2 - Disabled the AIO SEO warning and block update as AIO SEO 4.7.3.1 fixed the problem.

1.2.3 - Added disabling of miniOrange setting that checks for email_verified=1 from IDIR which is not provided and breaks login.

1.2.4 - Split out the code from 1.2.3 into its own CLI function.

1.2.5 - Added hiding of password protected pages from the search results
*/

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}




// Begin shortcode for notifications 

//BNFW grabs the post edited by user via the posts' lock meta. If this is not properly updated by WP, the notification will have the wrong author.
//  Lets add a new shortcode that actually grabs the logged in user.
//  Based on https://betternotificationsforwp.com/documentation/adding-custom-shortcodes/
function digimod_misc_bnfw_shortcode_logged_in_user()
{
    $user = wp_get_current_user();

    return $user->user_login;
}
add_shortcode('digimod_logged_in_username', 'digimod_misc_bnfw_shortcode_logged_in_user', 1, 1);
// end notification feature shortcode


// Begin function to check for updates to plugin
require_once "digimod-update-check.php";

add_action('init', 'digimod_misc_update_check_init');
function digimod_misc_update_check_init()
{
    if (class_exists('digimod_plugin_update_check')) {
        new digimod_plugin_update_check(__FILE__, plugin_basename(__FILE__));
    }
}
//End update check code.



// Begin function to add options page for Admin Notification Settings
function custom_admin_notification_settings_page() {
    add_options_page(
        'Admin Notification Settings',
        'Admin Notification',
        'manage_options',
        'custom-admin-notification-settings',
        'custom_admin_notification_settings_page_content'
    );
}
add_action('admin_menu', 'custom_admin_notification_settings_page');

// Register Admin Notification Settings
function custom_admin_notification_settings_init()
{
    register_setting('custom-admin-notification-settings-group', 'custom_admin_notification_enabled');
    register_setting('custom-admin-notification-settings-group', 'custom_admin_notification_message');
    register_setting('custom-admin-notification-settings-group', 'custom_admin_notification_class');
    register_setting('custom-admin-notification-settings-group', 'custom_admin_notification_dismissible');
    register_setting('custom-admin-notification-settings-group', 'custom_admin_notification_custom_style');
}
add_action('admin_init', 'custom_admin_notification_settings_init');



// Admin Notification Settings page content
function custom_admin_notification_settings_page_content()
{
?>
    <div class="wrap">
        <h2>Admin Notification Settings</h2>
        <form method="post" action="options.php">
            <?php settings_fields('custom-admin-notification-settings-group'); ?>
            <?php do_settings_sections('custom-admin-notification-settings-group'); ?>
            <table class="form-table">
                <tr valign="top">
                    <th scope="row">Enable Admin Notification</th>
                    <td><input type="checkbox" name="custom_admin_notification_enabled" value="1" <?php checked(1, get_option('custom_admin_notification_enabled'), true); ?> /></td>
                </tr>
                <tr valign="top">
                    <th scope="row">Notification Message</th>
                    <td><input class="large-text" type="text" name="custom_admin_notification_message" value="<?php echo esc_attr(get_option('custom_admin_notification_message')); ?>" /></td>
                </tr>
                <tr valign="top">
                    <th scope="row">Notification colour</th>
                    <td>
                        <select name="custom_admin_notification_class">
                            <option value="notice-info" <?php selected('notice-info', get_option('custom_admin_notification_class')); ?>>Info</option>
                            <option value="notice-success" <?php selected('notice-success', get_option('custom_admin_notification_class')); ?>>Success</option>
                            <option value="notice-warning" <?php selected('notice-warning', get_option('custom_admin_notification_class')); ?>>Warning</option>
                            <option value="notice-error" <?php selected('notice-error', get_option('custom_admin_notification_class')); ?>>Error</option>
                        </select>
                    </td>
                </tr>
                <tr valign="top">
                    <th scope="row">Let users dismiss</th>
                    <td><input type="checkbox" name="custom_admin_notification_dismissible" value="1" <?php checked(1, get_option('custom_admin_notification_dismissible'), true); ?> /></td>
                </tr>
                <tr valign="top">
                    <th scope="row">Make it bold</th>
                    <td><input type="checkbox" name="custom_admin_notification_custom_style" value="1" <?php checked(1, get_option('custom_admin_notification_custom_style'), true); ?> <?php echo get_option('custom_admin_notification_custom_style') ? 'style="font-size: 2rem !important; font-weight: bold;"' : ''; ?> />
</td>
                </tr>
            </table>
            <?php submit_button(); ?>
        </form>
    </div>
    <?php
}

// Add Admin Notification banner for admins in wp-admin
function custom_admin_notification_banner() {
    // Check if the notification is enabled
    $notification_enabled = get_option('custom_admin_notification_enabled');
    if ($notification_enabled && current_user_can('administrator')) {
        $notification_message = get_option('custom_admin_notification_message', 'This is your custom notification banner for admins.');
        $notification_class = get_option('custom_admin_notification_class', 'notice-info');
        $notification_dismissible = get_option('custom_admin_notification_dismissible', 1); // Default to dismissible if not set
        $use_custom_style = get_option('custom_admin_notification_custom_style', 0);

        // Construct classes based on dismissible setting
        $notification_classes = 'notice';
        if ($use_custom_style) {
            $notification_classes .= ' custom-notification';
        }
        $notification_classes .= ' ' . esc_attr($notification_class);
        if ($notification_dismissible) {
            $notification_classes .= ' is-dismissible';
        }

        // Construct style attribute for custom notification style
        $notification_style = '';
        if ($use_custom_style) {
            $notification_style = 'style="font-size: 18px; font-weight: bold;"'; // Adjust style as needed
        }
    ?>
        <div class="<?php echo $notification_classes; ?>" <?php echo $notification_style; ?>>
            <p><?php echo esc_html($notification_message); ?></p>
        </div>
<?php
    }
}
add_action('admin_notices', 'custom_admin_notification_banner');
//End Admin Notification Settings code.


// WCAG stuff
function register_wcag_tags()
{
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


add_action('init', 'register_wcag_tags', 0);

//End WCAG Stuff



/*
Prevent updating of AIO SEO
From: https://wordpress.stackexchange.com/questions/397326/how-do-i-disable-an-update-for-a-specific-plugin
*/
//NG, Nov 19, 2024. Disabled this code as AIO SEO 4.7.3.1 fixes the bug.
/*
function digimod_misc_disable_plugin_updates( $value ) {
    //create an array of plugins you want to exclude from updates ( string composed by folder/main_file.php)
     $pluginsNotUpdatable = [
      'all-in-one-seo-pack/all_in_one_seo_pack.php'
    ];

    if ( isset($value) && is_object($value) ) {
      foreach ($pluginsNotUpdatable as $plugin) {
          if ( isset( $value->response[$plugin] ) ) {
              unset( $value->response[$plugin] );
          }
        }
    }
    return $value;
}
add_filter( 'site_transient_update_plugins', 'digimod_misc_disable_plugin_updates' );

function digimod_misc_custom_admin_notice() {
    global $pagenow;
    if ( $pagenow == 'plugins.php' ){
        echo '<div class="notice notice-warning"><p>Do <strong>not</strong> update All In One SEO past 4.7.1.1 until further notice! It will break gutenberg on WP 6.4.</p></div>';
    }
}
add_action( 'admin_notices', 'digimod_misc_custom_admin_notice' );
*/



/* Prevent WP Password protected pages from showing in the site search 
    From: https://gist.github.com/jchristopher/8af4f64df046d1aeaa659975229c64cb
*/
add_filter( 'searchwp\query\mods', function( $mods ) {
	global $wpdb;

	$mod = new \SearchWP\Mod();
	$mod->set_local_table( $wpdb->posts );
	$mod->on( 'ID', [ 'column' => 'id' ] );
	$mod->raw_where_sql( function( $runtime ) {
		return "LENGTH({$runtime->get_local_table_alias()}.post_password) = 0";
	} );

	$mods[] = $mod;

	return $mods;
} );

/* Prevent WP password protected pages from showing in web searches
*/
function digimod_misc_noindex_protected_pages($robots) {
    global $post;
    if ( post_password_required( $post ) ) {
        $robots['nofollow'] = true;
        $robots['noindex'] = true;
        return $robots;
    }
}
function digimod_misc_noindex_protected_pages_aioseo($attributes){
    global $post;
    if ( post_password_required( $post ) ) {
        $attributes['noindex']  = 'noindex';
        $attributes['nofollow'] = 'nofollow';
    }

    return $attributes;
}
add_filter( 'wp_robots', 'digimod_misc_noindex_protected_pages' );
add_filter( 'aioseo_robots_meta', 'digimod_misc_noindex_protected_pages_aioseo' );


// CLI command to modify keycloak config (used for when the site gets imported to a different instance)
if (defined('WP_CLI')) {
    class Digimod_config_mo extends WP_CLI_Command
    {
        public function __invoke($args)
        {

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

            if(!is_array($args) || count($args) != 3){
                WP_CLI::error('Missing arguments!');
                return;
            }

            $clientSecret = $args[0];
            $ssoURI = $args[1];
            $siteURL = $args[2];

            $appslist = get_option('mo_oauth_apps_list');
            $app = $appslist['keycloak'];
            // WP_CLI::log('clientSecret: ');
            // WP_CLI::log($app['clientsecret']);

            //WP_CLI::log(implode(', ', $app));
            // WP_CLI::log(implode(', ', array_keys($app)));


            $app['clientsecret'] = $clientSecret; //$clientSecret;
            $app['authorizeurl'] = $ssoURI . '/realms/standard/protocol/openid-connect/auth';
            $app['accesstokenurl'] = $ssoURI . '/realms/standard/protocol/openid-connect/token';
            $app['redirecturi'] = $siteURL;
            $appslist['keycloak'] = $app;
            update_option('mo_oauth_apps_list', $appslist);

            WP_CLI::success('Miniorange settings reconfigured!');
        }
    }

    class Digimod_fix_mo extends WP_CLI_Command
    {
        public function __invoke($args)
        {

            //Turn off the new setting (6.26.4+) to enforce email_verified that breaks IDIR login as IDIR provider does not provide that field=1
            WP_CLI::log('Checking "Allow login to Verified IDP Account" setting.');
            $mo_oauth_email_verify_config = get_option( 'mo_oauth_login_settings_option' );
            if($mo_oauth_email_verify_config && isset($mo_oauth_email_verify_config['mo_oauth_email_verify_check']) && $mo_oauth_email_verify_config['mo_oauth_email_verify_check'] != ''){
                $mo_oauth_email_verify_config['mo_oauth_email_verify_check'] = '';
                update_option( 'mo_oauth_login_settings_option', $mo_oauth_email_verify_config );

                WP_CLI::log('Disabled setting.');

            }else{
                WP_CLI::log('Setting already disabled');
            }


            WP_CLI::success('Miniorange reconfigured!');
        }
    }

    WP_CLI::add_command('digimod-config-mo', 'Digimod_config_mo');
    WP_CLI::add_command('digimod-fix-mo', 'Digimod_fix_mo');
}
