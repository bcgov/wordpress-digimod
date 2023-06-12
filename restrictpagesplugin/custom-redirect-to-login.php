<?php
/**
 * Plugin Name: Custom Redirect to Login
 * Description: A custom plugin that redirects users to the login URL when they access certain pages.
 * Version: 1.1
 * Author: Digimod
 * Author URI: https://yourwebsite.com
 * License: GPL2
 */
function custom_redirect_to_login() {
    // Get the restricted URLs from the saved settings
    $restricted_urls = get_option('custom_restricted_urls', '');

    // Convert the saved URLs to an array
    $restricted_page_urls = array_filter(array_map('trim', explode(PHP_EOL, $restricted_urls)));

    // Get the current page URL path
    $current_page_url = strtok($_SERVER["REQUEST_URI"], '?');

    // Check if the current page is restricted and the user is not logged in
    if (in_array($current_page_url, $restricted_page_urls) && !is_user_logged_in()) {
        // Get the login URL
        $login_url = wp_login_url(home_url($current_page_url));

        // Redirect the user to the login URL
        wp_redirect($login_url);
        exit;
    }
}

add_action('template_redirect', 'custom_redirect_to_login');


function custom_check_plugin_working() {
    echo '<!-- Custom Redirect to Login plugin is active and working -->';
}

function custom_hide_admin_bar_for_non_editors() {
	
				
    if (is_user_logged_in()) {
        $current_user = wp_get_current_user();
        if (!in_array('editor', (array) $current_user->roles) && !in_array('administrator', (array) $current_user->roles)) {
			add_action('wp_footer', 'custom_check_plugin_working');
            show_admin_bar(false);
        }
    }
}

add_action('init', 'custom_hide_admin_bar_for_non_editors');

function custom_restricted_urls_menu() {
    add_options_page(
        'Restricted URLs',
        'Restricted URLs',
        'manage_options',
        'custom-restricted-urls',
        'custom_restricted_urls_settings_page'
    );
}

add_action('admin_menu', 'custom_restricted_urls_menu');

function custom_restricted_urls_settings_page() {
    // Check user capabilities
    if (!current_user_can('manage_options')) {
        return;
    }

    // Save settings
    if (isset($_POST['submit']) && check_admin_referer('custom_restricted_urls_settings')) {
        update_option('custom_restricted_urls', sanitize_textarea_field($_POST['custom_restricted_urls']));
    }

    // Load existing settings
    $restricted_urls = get_option('custom_restricted_urls', '');

    ?>
    <div class="wrap">
        <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
        <form method="post" action="">
            <?php wp_nonce_field('custom_restricted_urls_settings'); ?>
            <table class="form-table">
                <tr>
                    <th scope="row">
                        <label for="custom_restricted_urls">Restricted URLs</label>
                    </th>
                    <td>
                        <textarea id="custom_restricted_urls" name="custom_restricted_urls" rows="10" cols="50" class="large-text code"><?php echo esc_textarea($restricted_urls); ?></textarea>
                        <p class="description">Enter one URL per line. URLs should be relative to your site's domain (e.g., /restricted-page-1/).</p>
                    </td>
                </tr>
            </table>
            <?php submit_button(); ?>
        </form>
    </div>
    <?php
}
