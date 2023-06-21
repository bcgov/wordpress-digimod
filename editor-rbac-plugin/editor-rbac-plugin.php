<?php
/*
Plugin Name: Role-based Page Restriction
Description: Restricts viewing and editing pages in the admin dashboard based on user roles
Author: Your Name
Version: 1.0
*/

if (!defined('ABSPATH')) {
    exit;
}

class RoleBasedPageRestriction {
    private $allowed_pages;

    public function __construct() {
        $this->allowed_pages = get_option('role_based_page_restriction_allowed_pages', []);

        add_action('admin_menu', [$this, 'admin_menu']);
        add_action('load-page-new.php', [$this, 'restrict_pages']);
        add_action('load-page.php', [$this, 'restrict_pages']);
        add_action('wp_ajax_quick_edit_data', [$this, 'save_quick_edit_data']);
        add_action('wp_ajax_role_based_page_restriction_update_settings', [$this, 'update_settings']);
    }

    public function admin_menu() {
        add_options_page(
            'Role-based Page Restriction',
            'Role-based Page Restriction',
            'manage_options',
            'role-based-page-restriction',
            [$this, 'settings_page']
        );
    }

    // Settings page content

    // 1. Load all roles and pages
    // 2. If it's a POST request, process form submission
    // 3. Then render the settings form
    public function settings_page() {
        wp_enqueue_script('jquery-ui-draggable');
        wp_enqueue_script('jquery-ui-droppable');
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            check_admin_referer('role_based_page_restriction_update_settings');   
            $this->allowed_pages = [];
            foreach ($_POST['allowed_pages'] as $role => $pages) {
                $this->allowed_pages[$role] = array_map('absint', $pages);
            }
    
            update_option('role_based_page_restriction_allowed_pages', $this->allowed_pages);
        }
    
        $default_roles = array(
            'administrator' => 'Administrator',
            'editor' => 'Editor',
            'author' => 'Author',
            'contributor' => 'Contributor',
            'subscriber' => 'Subscriber'
        );
        
        $roles = array_diff_key(wp_roles()->get_names(), $default_roles);
        
        //all statuses except trash
        $all_pages = get_pages(array('post_status' => array('publish', 'pending', 'draft', 'auto-draft', 'future', 'private', 'inherit')));
        foreach ($all_pages as $page) {
            error_log(print_r($page->post_title, true));

            error_log(print_r($page->post_status, true));
        }

        echo '<div class="wrap">';
        echo '<h2>Role-based Page Restriction</h2>';
        echo '<form method="POST">';
        wp_nonce_field('role_based_page_restriction_update_settings');
        echo '<table class="form-table">';
        echo '<tbody>';
    
        echo '<tr>';
        echo '<th scope="row">Select Role</th>';
        echo '<td>';
        echo '<select id="role_select" onchange="showAllowedPages(this.value);">';
        foreach ($roles as $role => $name) {
            echo '<option value="' . esc_attr($role) . '">' . esc_html($name) . '</option>';
        }
        echo '</select>';
        echo '</table>';
        echo '</td>';
        echo '</tr>';
        echo '</tbody>';
        echo '</table>';
        echo '<div style="display: flex;">';
        foreach ($roles as $role => $name) {
            $allowed = isset($this->allowed_pages[$role]) ? $this->allowed_pages[$role] : [];
            $allowed_page_names = array_map(function ($page_id) {
                $status = get_post_status($page_id);
                $is_rewrite = get_metadata('post',$post_id, 'dp_is_rewrite_republish_copy', true);
                // error_log(print_r('Rewrite and Republish',true));
                // error_log(print_r($is_rewrite, true));
                $is_rewrite = $is_rewrite == null ? '' : ' - Rewrite and Republish';
                $status = $status == 'publish' ? null : ' - ' . $status;
                $status = $status . $is_rewrite;
                return array(
                    "ID" => $page_id,
                    "post_title" => get_the_title($page_id) . $status
                );
            }, $allowed);
            
            $allowed_page_ids = array_map(function ($page) {
                return $page["ID"];
            }, $allowed_page_names);
            //error_log(print_r('allowed',true));
            //error_log(print_r($allowed_page_ids, true));
            $not_allowed_pages = array_filter($all_pages, function($page) use ($allowed_page_ids) {
                return !in_array($page->ID, $allowed_page_ids);
            });
            //error_log(print_r('not allowed',true));
            //error_log(print_r($not_allowed_pages, true));
            $not_allowed_pages = array_map(function($page) {
                $status = get_post_status($page->ID);
                $status = $status == 'publish' ? null : ' - ' . $status;
                return array(
                    "ID" => $page->ID,
                    "post_title" => get_the_title($page->ID) . $status
                );
            }, $not_allowed_pages);
            //error_log(print_r('not allowed',true));
            //error_log(print_r($not_allowed_pages, true));

            echo '<div style="flex: 0.2; display:none" class="allowed_pages pages_wrapper" id="' . esc_attr($role) . '_allowed_container">';
            echo '<h3>' . esc_html($name) . ' - Allowed Pages</h3>';
            echo '<table id="' . esc_attr($role) . '_allowed" class="allowed_pages" style="display: none;">';
            foreach ($allowed_page_names as $page) {
                echo '<tr class="draggable" data-pageid="' . esc_attr($page['ID']) . '"><td>' . esc_html($page['post_title']) . '<input type="hidden" name="allowed_pages[' . esc_attr($role) . '][]" value="' . esc_attr($page['ID']) . '" /></td></tr>';
            }
            echo '</table>';
            echo '</div>';
            
            echo '<div style="flex: 0.8; display:none" class="not_allowed_pages pages_wrapper" id="' . esc_attr($role) . '_not_allowed_container">';
            echo '<h3>' . esc_html($name) . ' - Not Allowed Pages</h3>';
            echo '<table id="' . esc_attr($role) . '_not_allowed" class="not_allowed_pages" style="display: none;">';
            foreach ($not_allowed_pages as $page) {
                echo '<tr class="draggable" data-pageid="' . esc_attr($page['ID']) . '"><td>' . esc_html($page['post_title']) . '</td></tr>';
            }
            echo '</table>';
            echo '</div>';
        }
        echo '</div>'; // End of flex container
    
        echo '</tbody>';
        echo '</table>';
        echo '<p class="submit">';
        echo '<input type="submit" name="submit" id="submit" class="button button-primary" value="Save Changes">';
        echo '</p>';
        echo '</form>';
        echo '</div>';
        echo '<style>
                #drag_and_drop_tables {
                    display: flex;
                    justify-content: space-between;
                }
                .draggable {
                    cursor: move;
                }
                .allowed_pages table, .not_allowed_pages table {
                    background-color: white;
                    min-height: 100px;
                    min-width: 200px;
                    margin: 0 25px; /* Add 25px margin on left and right sides */

                }

                .allowed_pages table tbody, .not_allowed_pages table tbody {
                    max-height: 400px; /* Set maximum height */
                    overflow-y: auto; /* Enable vertical scrolling */
                    display: block;
                }

            </style>';
        echo '<script>
            function showAllowedPages(role) {
                // Get all elements with class "allowed_pages" and "not_allowed_pages"
                var allowedRows = document.getElementsByClassName("allowed_pages");
                var notAllowedRows = document.getElementsByClassName("not_allowed_pages");

                // Initially hide all rows
                for (var i = 0; i < allowedRows.length; i++) {
                    allowedRows[i].style.display = "none";              
                }
                for (var i = 0; i < notAllowedRows.length; i++) {
                    notAllowedRows[i].style.display = "none";              
                }

                // Show rows only for the selected role
                document.getElementById(role + "_allowed_container").style.display = "block";
                document.getElementById(role + "_not_allowed_container").style.display = "block";
                document.getElementById(role + "_allowed").style.display = "table";
                document.getElementById(role + "_not_allowed").style.display = "table";
            }

        </script>';

        echo '<script>
            jQuery(document).ready(function($) {
                //initialize the page with whatever role is first
                $("#role_select").find("option:first").prop("selected", true);
                $("#role_select").change();

                $(".draggable").draggable({
                    helper: "clone",
                    revert: "invalid"
                });

                $("table.allowed_pages, table.not_allowed_pages").droppable({
                    accept: ".draggable",
                    drop: function(event, ui) {
                        var droppedItem = $(ui.draggable).clone();
                        var droppedOn = $(this).attr("class").split(" ");
                        var role = $("#role_select").val();
                        if (droppedOn.includes("allowed_pages")) {
                            droppedItem.append("<input type=\'hidden\' name=\'allowed_pages[" + role + "][]\' value=\'" + droppedItem.data("pageid") + "\'/>");
                        } else {
                            droppedItem.find("input").remove();
                        }
                        $(ui.draggable).remove();
                        $(this).append(droppedItem);
                        $(".draggable").draggable({
                            helper: "clone",
                            revert: "invalid"
                        });
                    }
                });
            });
        </script>';

    }
    
    
    

    // This is called before rendering the "Add New Page" or "Edit Page" screen
    // It checks whether the user has the required role to access the page

    // 1. If there's no 'post' query var, return immediately
    // 2. Otherwise, check if the current user's role(s) allow them to access the page
    // 3. If not, terminate the request with a 403 status
    public function restrict_pages() {
        if (!isset($_GET['post'])) {
            return;
        }
    
        $post = get_post($_GET['post']);
        $roles = wp_get_current_user()->roles;
        $is_allowed = false;

        #administrators do not follow these restrictions
        if (in_array('administrator', $roles)) {
            $is_allowed = true;
            return;
        }
        foreach ($roles as $role) {
            $allowed = isset($this->allowed_pages[$role]) ? $this->allowed_pages[$role] : [];
            if (in_array($post->ID, $allowed)) {
                $is_allowed = true;
                break;
            }
        }
    
        if (!$is_allowed) {
            wp_die('You are not allowed to edit this page.', 403);
        }
    }

    // This is an AJAX callback for saving Quick Edit data
    // 1. Verify the nonce
    // 2. If the request includes post IDs and selected roles, update the 'allowed_pages' option
    // 3. Then send a JSON success response    
    public function save_quick_edit_data() {
        error_log(print_r('role_based_page_restriction', true));
        check_ajax_referer('role_based_page_restriction', 'role_based_page_restriction_nonce');
    
        $post_ids = (!empty($_POST['post_ids']) && is_array($_POST['post_ids'])) ? $_POST['post_ids'] : null;
        $selected_roles = (!empty($_POST['allowed_roles']) && is_array($_POST['allowed_roles'])) ? $_POST['allowed_roles'] : null;
    
        if (!empty($post_ids) && !empty($selected_roles)) {
            // Fetch the current list of allowed pages for each role.
            $allowed_pages = get_option('role_based_page_restriction_allowed_pages', []);
    
            foreach ($post_ids as $post_id) {
                foreach ($selected_roles as $role) {
                    // If the role does not have any allowed pages yet, create a new array for it.
                    if (!isset($allowed_pages[$role])) {
                        $allowed_pages[$role] = [];
                    }
    
                    // Add the post ID to the list of allowed pages for this role, if it is not already there.
                    if (!in_array($post_id, $allowed_pages[$role])) {
                        $allowed_pages[$role][] = absint($post_id);
                    }
                }
            }
    
            // Update the list of allowed pages for each role.
            update_option('role_based_page_restriction_allowed_pages', $allowed_pages);
        }
        wp_send_json_success(array('message' => 'save_quick_edit_data was run'));
        wp_die();
    }
    
}
// Initialize the class immediately
new RoleBasedPageRestriction();

function intercept_quick_edit($post_id) {
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    if (defined('DOING_AJAX') && DOING_AJAX && isset($_POST['action']) && $_POST['action'] === 'inline-save') {
        check_admin_referer('role_based_page_restriction', 'role_based_page_restriction_nonce');
        $allowed_roles = isset($_POST['allowed_roles']) ? $_POST['allowed_roles'] : null;
        // error_log(print_r($allowed_roles, true));
        if (!empty($allowed_roles) && is_array($allowed_roles)) {
            $allowed_pages = get_option('role_based_page_restriction_allowed_pages', []);
            foreach ($allowed_roles as $role) {
                if (!isset($allowed_pages[$role])) {
                    $allowed_pages[$role] = [];
                }
                // error_log(print_r($allowed_pages, true));
                // error_log(print_r('postId'.$post_id, true));
                if (!in_array($post_id, $allowed_pages[$role])) {
                    error_log(print_r('not here - adding'.$post_id, true));
                    $allowed_pages[$role][] = absint($post_id);
                }
            }
            // error_log(print_r('updating... ', true));
            // error_log(print_r($allowed_pages, true));
            update_option('role_based_page_restriction_allowed_pages', $allowed_pages);
        }
    }
}

// Attaches 'intercept_quick_edit' function to 'save_post' WordPress action. This function is triggered when a post is saved
add_action('save_post', 'intercept_quick_edit', 10, 1);


// Adds a new column in the admin pages list
function role_add_custom_column($columns) {
    // The content of this column will be generated in the 'role_display_custom_column' function
    $columns['role_quick_edit'] = '';
    return $columns;
}
add_filter('manage_pages_columns', 'role_add_custom_column');

// Displays the roles for which the page is available in the 'role_quick_edit' column
function role_display_custom_column($column_name, $post_id) {
    if ('role_quick_edit' !== $column_name) {
        return;
    }
    // Retrieves the option holding the allowed pages for each role
    $allowed_pages = get_option('role_based_page_restriction_allowed_pages', []);
    $roles = [];
    // Iterates over each role and checks if the current page is in the list of allowed pages for this role
    foreach ($allowed_pages as $role => $pages) {
        if (in_array($post_id, $pages)) {
            $roles[] = $role;
        }
    }
    // Prints the roles list in the 'role_quick_edit' column
    echo '<div class="hidden allowed_roles" data-allowed_roles="' . esc_attr(implode(',', $roles)) . '"></div>';
}

add_action('manage_pages_custom_column', 'role_display_custom_column', 10, 2);

// Adds a select dropdown in the Quick Edit menu to select the roles for which the page will be available
function role_quickedit_custom_box($column_name, $post_type) {
    // Get the current user
    $user = wp_get_current_user();

    // If user is administrator, return and don't modify the quick edit
    if(!in_array('administrator', $user->roles)) {
        return;
    }
    
    // Ignore non-page post types and non-'role_quick_edit' columns
    if ($post_type != 'page' || $column_name != 'role_quick_edit') {
        return;
    }

    // Print the nonce field once only
    static $printNonce = TRUE;
    if ($printNonce) {
        $printNonce = FALSE;
        wp_nonce_field('role_based_page_restriction', 'role_based_page_restriction_nonce');
    }
    ?>
    
    <fieldset class="inline-edit-col-right inline-edit-book">
        <div class="inline-edit-col column-<?php echo $column_name; ?>">
            <label class="inline-edit-group">
            <span class="title">Permitted Roles</span>
                <?php
                $default_roles = array(
                    'administrator' => 'Administrator',
                    'editor' => 'Editor',
                    'author' => 'Author',
                    'contributor' => 'Contributor',
                    'subscriber' => 'Subscriber'
                );
                
                $roles = array_diff_key(wp_roles()->get_names(), $default_roles);
                
                echo '<select class="allowed_roles" name="allowed_roles[]" multiple>';
                foreach ($roles as $role => $name) {
                    echo '<option value="' . esc_attr($role) . '">' . esc_html($name) . '</option>';
                }
                echo '</select>';
                ?>
            </label>
        </div>
    </fieldset>
    <?php
}
add_action('quick_edit_custom_box',  'role_quickedit_custom_box', 10, 2);
function editor_rbac_asset_loader() {
    $plugin_dir = plugin_dir_path(__FILE__);
    $file_url = plugins_url(str_replace($plugin_dir, '', $file), __FILE__);
    $admin_js_files = glob($plugin_dir . '*.js');
    foreach ($admin_js_files as $file) {
        $file_url = plugins_url(str_replace($plugin_dir, '', $file), __FILE__);
        wp_enqueue_script('custom-admin-' . basename($file, '.js'), $file_url, [], false, true);
    }}
add_action('admin_enqueue_scripts', 'editor_rbac_asset_loader');

add_action('pre_get_posts', 'modify_admin_pages_query');

function modify_admin_pages_query($query) {
    // We only want to modify the query in the admin dashboard and for the 'page' post type
    if (!is_admin() || $query->get('post_type') !== 'page') {
        return;
    }

    // Get the current user
    $user = wp_get_current_user();
    
    // If user is administrator, return and don't modify the query
    if(in_array('administrator', $user->roles)) {
        return;
    }

    // Fetch the option holding the allowed pages
    $allowed_pages = get_option('role_based_page_restriction_allowed_pages', []);

    // Determine which roles are attributed to the user
    $user_roles = $user->roles;
    
    // Initialize an array to hold all allowed pages for the user
    $user_allowed_pages = [];
    
    // Loop over the user roles and add any allowed pages to the array
    foreach($user_roles as $role) {
        if(isset($allowed_pages[$role])) {
            $user_allowed_pages = array_merge($user_allowed_pages, $allowed_pages[$role]);
        }
    }

    // Modify the query to only include pages that are allowed for the current user
    // Make sure to not run this modification if $user_allowed_pages is empty to avoid errors
    if (!empty($user_allowed_pages)) {
        $query->set('post__in', $user_allowed_pages);
    } else {
        // If the user doesn't have any pages, we can return an impossible condition to ensure no pages are shown
        $query->set('post__in', [0]);
    }
}
add_action('save_post', 'add_to_allowed_pages', 15, 3);
add_action('rest_after_insert_post', 'add_to_allowed_pages', 10, 3);

// We assume if a post is being saved, it should be allow to be edited.
// this captures when new pages are being created.
function add_to_allowed_pages($post_id, $post, $update) {
    if(!is_page($post_id)) return;
    error_log('Add to allowed posts');
    
    // Retrieve the allowed_pages option from the database
    $allowed_pages = get_option('role_based_page_restriction_allowed_pages', []);

    // Get the current user
    $user = wp_get_current_user();
    // Determine which roles are attributed to the user
    $user_roles = $user->roles;

    foreach ($user_roles as $role) {
        $allowed_pages[$role][] = $post_id;
    }

    // Update the allowed_pages option in the database
    update_option('role_based_page_restriction_allowed_pages', $allowed_pages);
}
