<?php
/**
 * Plugin for DigitalGov. Extends the existing digimod-theme-assets plugin into class based plugin
 *
 * @package Bcgov\DigitalGov
 * @since 1.3.0
 */
namespace Bcgov\DigitalGov;

use Bcgov\DigitalGov\Blocks;
use Bcgov\Common\Loader;

class Plugin {
	/**
	 * The unique identifier of this plugin.
	 *
	 * @since    1.0.0
	 * @access   public
	 * @var      string    $plugin_name    The string used to uniquely identify this plugin.
	 */
	public static $plugin_name = 'digimod-theme-assets';

    /**
     * Human-readable title of this plugin.
     *
     * @var string $plugin_title The string containing the human-readable title of this plugin.
     */
    public static $plugin_title = 'Digital Gov Theme Assets';

    /**
     * The plugin root directory.
     *
     * @var string $plugin_dir The path to this plugin's root directory.
     */
	public static $plugin_folder = '/digimod-theme-assets/';

    public static $plugin_dir = null;

    public static $plugin_url = null;  // Set up later dynamically

	/**
	 * Define the core functionality of the plugin.
	 *
	 * Set the plugin name and the plugin version that can be used throughout the plugin.
	 * Load the dependencies, define the locale, and set the hooks for the admin area and
	 * the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function __construct() {
		self::$plugin_dir = WP_PLUGIN_DIR . self::$plugin_folder;
		self::$plugin_url = plugins_url() . self::$plugin_folder;

        new Blocks();
		new Search();

        $loader = new Loader();
		$loader->add_filter( 'get_the_excerpt', $this, 'protect_excerpt', 50, 2 );
        $loader->add_action( 'admin_enqueue_scripts', $this, 'register_admin_js' );
		$loader->run();
	}


	/**
     * Register our admin JS assets
     */
	function register_admin_js() {
        $asset_file = include self::$plugin_dir . 'dist-plugin/admin.asset.php';

        wp_enqueue_script(
            'digitalgov/digimod-theme-assets-plugin-admin',
            self::$plugin_url . 'dist-plugin/admin.js',
            $asset_file['dependencies'],
            $asset_file['version']
        );
	}


	/**
	 * Protect the excerpt for idir protected pages on search results, in case the results show up outside the search results templates we setup.
	 *  This doesnt account for built in wp password protected pages, wp handles the excerpt itself for those.
	 */
	function protect_excerpt( $excerpt, $post ) {
		if ( is_search() ) {
			$post_excerpt       = $post->post_excerpt ?
				$excerpt :
				wp_trim_excerpt( '', $post );
			$post_is_restricted = custom_redirect_to_login_check_if_url_in_list( get_permalink( $post ) );

			$result_content = '';
			if ( $post_is_restricted ) {
				if ( is_user_logged_in() ) {
					$result_content .= $post_excerpt;
				} else {
					$result_content .= ' <p>' . __( 'There is no excerpt because this is a protected post. ' ) . '</p>';
				}
			} else {
				$result_content .= $post_excerpt;
			}
			return $result_content;
		}

		return $excerpt;
	}




	/**
	 * Provide for the ability to change block html content.
	 *  Used to add attributes to the search results post content.
	 */
	/*
	function digimod_theme_assets_render_block( string $block_content, array $block ): string {
		// echo print_r($block['blockName'],true) . ' ' . PHP_EOL;

		if ( is_search() ) {
			if ( isset( $block['blockName'] ) ) {
				$post_is_restricted = custom_redirect_to_login_check_if_url_in_list( get_permalink( get_the_id() ) );

				if ( $block['blockName'] === 'core/post-title' ) {
					if ( $post_is_restricted ) {
						$html = str_replace(
							[
								'class="wp-block-post-title"',
							],
							[
								'class="wp-block-post-title" title="private"',
							],
							$block_content
						);
						return $html;
					}
				} elseif ( $block['blockName'] === 'core/post-excerpt' ) {
					if ( $post_is_restricted ) {
						$html = str_replace(
							[
								'class="wp-block-post-excerpt"',
							],
							[
								'class="wp-block-post-excerpt" title="private"',
							],
							$block_content
						);
						return $html;
					}
				}
			}
		}

		if ( $block['blockName'] === 'core/search' ) {
			$block_content .= '<div class="live-search-container"></div>';
		}

		return $block_content;
	}
	add_filter( 'render_block', 'digimod_theme_assets_render_block', null, 2 );
	*/
}
