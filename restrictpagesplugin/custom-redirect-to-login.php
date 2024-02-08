<?php
/**
 * Plugin Name: Custom Redirect to Login
 * Description: A custom plugin that redirects users to the login URL when they access certain pages.
 * Version: 1.2.0
 * Author: Digimod
 * Author URI: https://digital.gov.bc.ca
 * License: GPL2
 * Repository: https://github.com/bcgov/wordpress-digimod/tree/main/restrictpagesplugin
 * Plugin URI: https://github.com/bcgov/wordpress-digimod/tree/main/restrictpagesplugin
 * Update URI: https://raw.githubusercontent.com/bcgov/wordpress-digimod/main/restrictpagesplugin/custom-redirect-to-login.php
 */

 /** 
  * Function used to check and redirect users to the login page for restricted pages.
  *  This function will handle the redirection.
  *  Logged in users are NOT restricted.
  *
  * @param string $url_to_check (optional) The url to be checked, otherwise it uses $_SERVER["REQUEST_URI"]
  */
function custom_redirect_to_login($url_to_check = null) {
    // Get the restricted URLs from the saved settings
    $restricted_urls = get_option('custom_restricted_urls', '');

    // Convert the saved URLs to an array
    $restricted_page_urls = array_filter(array_map('trim', explode(PHP_EOL, $restricted_urls)));

    //Allow for the function to be passed a url, or use default value.
    if($url_to_check){
        $tmp_url = parse_url($url_to_check);
        $url_to_check = $tmp_url['path'];
        
    }else{
        // Get the current page URL path
        $url_to_check = $_SERVER["REQUEST_URI"];
    }
    $current_page_url = strtok($url_to_check, '?');

    // Check if the current page is restricted and the user is not logged in
    if (in_array($current_page_url, $restricted_page_urls) && !is_user_logged_in()) {
        
        // Set the cookie for redirection after login
        $name = "my_login_redirect";
        $value = 'http' . (isset($_SERVER['HTTPS']) ? 's' : '') . '://' . "{$_SERVER['HTTP_HOST']}{$_SERVER['REQUEST_URI']}"; // Get the full URL

        $expire_time = time() + (5 * 60); // 5 minutes from now
        setcookie($name, $value, $expire_time, '/'); // Setting the cookie

        // Get the login URL
        $login_url = wp_login_url(home_url($current_page_url));

        // Redirect the user to the login URL
        wp_redirect("/?option=oauthredirect&app_name=keycloak");
        exit;
    }
}
add_action('template_redirect', 'custom_redirect_to_login');


 /** 
  * Check if a passed in URL (or current url) is in the restricted URL list.
  *
  * @param string $url_to_check (optional) The url to be checked, otherwise it uses $_SERVER["REQUEST_URI"]
  * @return bool Whether the URL is in the list or not.
  */
function custom_redirect_to_login_check_if_url_in_list($url_to_check = null){
    // Get the restricted URLs from the saved settings
    $restricted_urls = get_option('custom_restricted_urls', '');

    // Convert the saved URLs to an array
    $restricted_page_urls = array_filter(array_map('trim', explode(PHP_EOL, $restricted_urls)));

    if($url_to_check){
        $tmp_url = parse_url($url_to_check);
        $url_to_check = $tmp_url['path'];

    }else{
        $url_to_check = $_SERVER["REQUEST_URI"];
    }
    // Get the current page URL path
    $current_page_url = strtok($url_to_check, '?');

    // Check if the page is restricted 
    if (in_array($current_page_url, $restricted_page_urls) ) {  
        return true;
    }

    return false;
}


function custom_redirect_to_login_plugin_working() {
    echo '<!-- Custom Redirect to Login plugin is active and working -->';
}

function custom_redirect_to_login_hide_admin_bar_for_non_editors() {				
    if (is_user_logged_in()) {
        $current_user = wp_get_current_user();
        if (!in_array('editor', (array) $current_user->roles) && !in_array('administrator', (array) $current_user->roles)) {
			add_action('wp_footer', 'custom_redirect_to_login_plugin_working');
            show_admin_bar(false);
        }
    }
}
add_action('init', 'custom_redirect_to_login_hide_admin_bar_for_non_editors');


function custom_redirect_to_login_urls_menu() {
    add_options_page(
        'Restricted URLs',
        'Restricted URLs',
        'manage_options',
        'custom-restricted-urls',
        'custom_redirect_to_login_restricted_urls_settings_page'
    );
}
add_action('admin_menu', 'custom_redirect_to_login_urls_menu');


function custom_redirect_to_login_restricted_urls_settings_page() {
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



// Begin function to check for updates to plugin
require_once "digimod-update-check.php";
function custom_redirect_to_login_update_check_init(){
    if (class_exists('digimod_plugin_update_check')) {
        new digimod_plugin_update_check(__FILE__, plugin_basename(__FILE__));
    }
}
add_action('init', 'custom_redirect_to_login_update_check_init');
//End update check code.