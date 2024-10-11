<?php

/**
* Plugin Name: DIGIMOD - IDIR Protect Media Files
* Description: Provides the ability to protect media files behind IDIR.
* Version: 1.0.0
 * Author: Digimod
 * Author URI: https://digital.gov.bc.ca
 * License: GPL2
 * Repository: https://github.com/bcgov/wordpress-digimod/tree/main/digimod-media-idir-protect
 * Plugin URI: https://github.com/bcgov/wordpress-digimod/tree/main/digimod-media-idir-protect
 * Update URI: https://raw.githubusercontent.com/bcgov/wordpress-digimod/main/digimod-media-idir-protect/index.php
* Requires Plugins: safe-redirect-manager
*/


// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) exit;


/**
 * Begins execution of the plugin.
 *
 */
function run_idir_protected_media_files() {
	if ( class_exists( 'IdirProtectedMediaFiles' ) ) {
		new IdirProtectedMediaFiles();

	} else {
		echo '<!-- Unable to run plugin -->';
    }
}

/** This is to ensure that the common-plugin gets loaded before this plugin, otherwise admin functions will not work. */
add_action(
    'plugins_loaded',
    function () {
		run_idir_protected_media_files();
	}
);



/*
* Our main Plugin class

*/

class IdirProtectedMediaFiles {
	private $cache_transient_key         = '_idir_protected_media_cache';


	public function __construct() {
		add_action( 'init', array($this, 'url_handler')  );
		add_action( 'admin_init', array($this, 'check_has_required_plugin') );

		add_filter('wp_get_attachment_url', array($this, 'override_get_attachment_url'), 10, 2 );

		add_filter('attachment_fields_to_edit', array($this, 'add_custom_text_field_to_attachment_fields_to_edit'), null, 2); 
		add_filter('attachment_fields_to_save', array($this, 'save_custom_checkbox_attachment_field'), null, 2);


		add_filter('srm_registered_redirects', array($this, 'edit_srm_redirects'), null, 2);
	}


	/*
	* Check that the other plugins required for this plugin to function are installed and enabled
	*	For now it is only the Safe Redirect Manager
	*/
	function check_has_required_plugin() {
		if ( is_admin() && current_user_can( 'activate_plugins' ) &&  !is_plugin_active( 'safe-redirect-manager/safe-redirect-manager.php' ) ) {
			add_action( 'admin_notices', array($this, 'missing_required_plugin_notice') );
	
			deactivate_plugins( plugin_basename( __FILE__ ) ); 
	
			if ( isset( $_GET['activate'] ) ) {
				unset( $_GET['activate'] );
			}
		}
	}
	
	/*
	* Html to present the error to the admin
	*/
	function missing_required_plugin_notice(){
		?><div class="error"><p>Sorry, but DIGIMOD - IDIR Protect Media Files Plugin requires the Safe Redirect Manager plugin to be installed and active.</p></div><?php
	}
	


	/*
	* Setup the checkbox for the media attachment details dialog
	*/
	function add_custom_text_field_to_attachment_fields_to_edit( $form_fields, $post ) {
		$is_idir_protected = (bool) get_post_meta($post->ID, 'idir_protected', true);
		$form_fields['idir_protected'] = array(
			'label' => 'IDIR Protected',
			'input' => 'html',
			'html' => '<input type="checkbox" id="attachments-'.$post->ID.'-idir_protected" name="attachments['.$post->ID.'][idir_protected]" value="1"'.($is_idir_protected ? ' checked="checked"' : '').' /> ', 
			'value' => $text_field,
			'helps' => 'Should new links to this media item be IDIR protected. Existing links to this media item will redirect to the new private url.'
		);
		return $form_fields;
	}

	/* 
	* Save custom checkbox attachment field
	*/
	function save_custom_checkbox_attachment_field($post, $attachment) { 
		if( isset($attachment['idir_protected']) ){  
			$this->move_to_private_folder($post['ID']);

		}else{
			$this->move_to_public_folder($post['ID']);
		}
		return $post;  
	}
	
	
	/* 
	* move the media item to the public folder and update the proper meta
	*/
	function move_to_public_folder($attachment_id){
		$file_path = get_post_meta( $attachment_id, '_wp_attached_file', true );

		if(stripos($file_path, 'private/') !== 0){
			//already in private folder.
			return;
		}
		$file_path_new = str_ireplace('private/', '', $file_path);

		$upload_folder_arr = wp_get_upload_dir();
		$private_folder_path = $upload_folder_arr['basedir'] . '/private';

		//We assume the folders exist on public for the file to be moved back.

		global $wp_filesystem;

		// Make sure that the above variable is properly setup.
		require_once ABSPATH . 'wp-admin/includes/file.php';
		WP_Filesystem();

		$moved_success = $wp_filesystem->move($upload_folder_arr['basedir'] . '/' . $file_path, $upload_folder_arr['basedir'] . '/' . $file_path_new);
		//echo $file_path . "\n". $upload_folder_arr['basedir'] . '/' . $file_path_new; 
		if($moved_success){
			// Update the path inside the post meta
			update_post_meta( $attachment_id, '_wp_attached_file', $file_path_new );

			$old_metadata = wp_get_attachment_metadata( $attachment_id );
			$old_metadata['file'] = $file_path_new;

			// Update the path inside the meta data
			wp_update_attachment_metadata( $attachment_id, $old_metadata );

			delete_post_meta($attachment_id, 'idir_protected' );

			$this->clear_redirect_cache();
		}

	}


	/* 
	* move the media item to the protected folder and update the proper meta
	*/
	function move_to_private_folder($attachment_id){
		$file_path = get_post_meta( $attachment_id, '_wp_attached_file', true );

		if(stripos($file_path, 'private/') === 0){
			//already in private folder.
			return;
		}
		$file_path_new = 'private/' . $file_path;


		$upload_folder_arr = wp_get_upload_dir();
		$private_folder_path = $upload_folder_arr['basedir'] . '/private';
		if (!file_exists($private_folder_path)) {
			mkdir($private_folder_path, 0777, true);
		}

		//Recreate folders on private folder if not exists
		if(!file_exists(dirname($private_folder_path . '/' . $file_path))){
			mkdir(dirname($private_folder_path . '/' . $file_path), 0777, true);
		}

		global $wp_filesystem;

		// Make sure that the above variable is properly setup.
		require_once ABSPATH . 'wp-admin/includes/file.php';
		WP_Filesystem();

		$moved_success = $wp_filesystem->move($upload_folder_arr['basedir'] . '/' . $file_path, $private_folder_path . '/' . $file_path);
		if($moved_success){
			// Update the path inside the post meta
			update_post_meta( $attachment_id, '_wp_attached_file', $file_path_new );

			$old_metadata = wp_get_attachment_metadata( $attachment_id );
			$old_metadata['file'] = $file_path_new;

			// Update the path inside the meta data
			wp_update_attachment_metadata( $attachment_id, $old_metadata );

			update_post_meta($attachment_id, 'idir_protected', 1);  

			$this->clear_redirect_cache();
		}

	}

	




	/*
	* Handle the special idir protected url base for loading of the resources
	*/
	function url_handler() {
		if (stripos($_SERVER["REQUEST_URI"], '/wp-uploads-idir-protected') === 0) {
			$url_exploded = explode('/',$_SERVER["REQUEST_URI"]);

			if($url_exploded[1] == 'wp-uploads-idir-protected' && is_numeric($url_exploded[2])){

				if(is_user_logged_in()){
					//$file_to_load = str_ireplace('/wp-uploads-idir-protected', '', $_SERVER["REQUEST_URI"]);
					$attachment_id = $url_exploded[2];
					$file_path = get_post_meta( $attachment_id, '_wp_attached_file', true );

					$upload_folder_arr = wp_get_upload_dir();

					$file_path_full = $upload_folder_arr['basedir'] . '/' . $file_path;

					$finfo = finfo_open(FILEINFO_MIME_TYPE);
					$mime_type = finfo_file($finfo, $file_path_full);


					//header("Content-Disposition: attachment; filename=" . basename($file_path) . ";");
					header("Content-Type: $mime_type");
					header("Content-Description: File Transfer");
					header("Content-Transfer-Encoding: binary");
					header('Content-Length: ' . filesize($file_path_full));
					header("Cache-Control: no-cache private");


					echo file_get_contents($file_path_full);

					exit();

				}else{
					//Copied from digimod restrictpageslogin plugin
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
		}
	}



	/*
	* override the url for protected attachments
	*/
	function override_get_attachment_url($url, $attachment_id) {
		//$attachment_id = attachment_url_to_postid($url);

		$is_idir_protected = (bool) get_post_meta($attachment_id, 'idir_protected', true);

		if($is_idir_protected){
			$file_path = get_post_meta( $attachment_id, '_wp_attached_file', true );

			if(stripos($file_path, 'private/') === 0){				
				return get_site_url() . '/wp-uploads-idir-protected/' . $attachment_id . '/'.basename($file_path);  //str_ireplace('private/','', $file_path);
			}
			
		}

		return $url;
	}


	/*
	* Clear the cache we have of media redirects
	*/
	function clear_redirect_cache(){		
		delete_transient( $this->$cache_transient_key);
	}

	/*
	* Adjust the redirects to make the previously public media go to the private url and prevent a 404
	*/
	function edit_srm_redirects($redirects, $requested_path){
		$ipm_redirects             = get_transient( $this->$cache_transient_key );

		if ( false === $ipm_redirects ) {
			$ipm_redirects = array();

			$upload_folder_arr = wp_get_upload_dir();

			$args = array(
				'meta_key' => 'idir_protected',
				'meta_value' => 1,
				'post_type' => 'attachment',
				'post_status' => 'any',
				'posts_per_page' => -1
			);
			$media = get_posts($args);
			foreach ( $media as $aProtectedMedia ) {
				$file_path = get_post_meta( $aProtectedMedia->ID, '_wp_attached_file', true );

				if(stripos($file_path, 'private/') === 0){	
					//Setup the redirect from the original non-private url to the new private url.			
					$new_url =  str_ireplace(get_site_url(), '', $this->override_get_attachment_url(null, $aProtectedMedia->ID));	//Remove the site url so redirects only start with the slash
					
					$file_path_old = str_ireplace('private/', '', $file_path);
					$old_url = $file_path_old; 

					$old_url_parsed = parse_url($upload_folder_arr['url'] . '/' .  $old_url);


					$old_url = str_ireplace(get_site_url(), '', $upload_folder_arr['url']) . '/' .  $old_url;


					$redirect_data = array(
						'ID'            => 'ipm_' . $aProtectedMedia->ID,
						'redirect_from' => $old_url,
						'redirect_to'   => $new_url,
						'status_code'   => (int) 302,
					);
					$ipm_redirects[] = $redirect_data;

				}
			}

			//set_transient( $this->$cache_transient_key, $ipm_redirects, 30 * DAY_IN_SECONDS );
	

			if(isset($_GET['x']) && $_GET['x'] == 1){
				print_r(get_site_url());
				print_r($old_url_parsed);
				print_r($upload_folder_arr);
				print_r($media);
				print_r($ipm_redirects); die();	
			}
			return array_merge($ipm_redirects, $redirects);

		}else{
				
			return array_merge($ipm_redirects, $redirects);
		}
	}
}



// Begin function to check for updates to plugin
require_once "digimod-update-check.php";
function idir_protected_media_files_update_check_init(){
    if (class_exists('digimod_plugin_update_check')) {
		if( !function_exists('get_plugin_data') ){
			require_once( ABSPATH . 'wp-admin/includes/plugin.php' );
		}

        new digimod_plugin_update_check(__FILE__, plugin_basename(__FILE__));
    }
}
add_action('init', 'idir_protected_media_files_update_check_init');
//End update check code.