<?php
/**
* Plugin Name: DIGIMOD - Security
* Description: Prevents form login for any users that have "@" in their username (keycloak users). Also disables /users API endpoint
* Version: 1.0.0
* Author: Digimod
* License: GPL-2.0+
* License URI: http://www.gnu.org/licenses/gpl-2.0.txt
* Repository: https://github.com/bcgov/wordpress-digimod/tree/main/digimod-theme-assets
*/

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
    exit( 'Direct access denied.' );
}

add_filter('wp_authenticate_user', 'dm_sec_block_at_symbol_usernames', 10, 2);

/**
 * Blocks the login if username contains "@" character.
 *
 * @param WP_User $user
 * @param string $password
 * @return WP_User|WP_Error
 */
function dm_sec_block_at_symbol_usernames($user, $password) {
    if (strpos($user->user_login, '@') !== false) {
        return new WP_Error('invalid_username', __('<strong>ERROR</strong>: Invalid username.'));
    }

    return $user;
}

add_filter('rest_endpoints', function ($endpoints) {
    // Disable listing all users.
    if (isset($endpoints['/wp/v2/users'])) {
        unset($endpoints['/wp/v2/users']);
    }

    // Disable retrieving a specific user.
    if (isset($endpoints['/wp/v2/users/(?P<id>[\d]+)'])) {
        unset($endpoints['/wp/v2/users/(?P<id>[\d]+)']);
    }

    return $endpoints;
});