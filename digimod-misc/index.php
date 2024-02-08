<?php

/**
 * Plugin Name: DIGIMOD - miscellaneous
 * Description: Miscellaneous features for DigitalGov; Defines WCAG Tag taxonomy, CLI Keycloak SSO/Miniorange adjuster.
 * Version: 1.2.0
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

    WP_CLI::add_command('digimod-config-mo', 'Digimod_config_mo');
}
