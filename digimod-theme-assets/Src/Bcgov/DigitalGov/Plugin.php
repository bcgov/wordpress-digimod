<?php
/**
 * Plugin for DigitalGov. Extends the existing digimod-theme-assets plugin into class based plugin
 *
 * @package Bcgov\DigitalGov
 * @since 1.3.0
 */
namespace Bcgov\DigitalGov;

use Bcgov\DigitalGov\Blocks;
use Bcgov\DigitalGov\Search;


/**
 * Plugin class.
 */
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
     * The plugin directory.
     *
     * @var string $plugin_folder The name of plugin's directory.
     */
	public static $plugin_folder = '/digimod-theme-assets/';

	/**
     * The plugin root directory.
     *
     * @var string $plugin_folder The path to this plugin's root directory.
     */
    public static $plugin_dir = null; // Set up later dynamically.

	/**
     * The plugin root url.
     *
     * @var string $plugin_folder The path to this plugin's root url.
     */
    public static $plugin_url = null;  // Set up later dynamically.

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

		add_filter( 'get_the_excerpt', [ $this, 'protect_excerpt' ], 99, 2 );
        add_action( 'admin_enqueue_scripts', [ $this, 'register_admin_js' ] );

		add_filter( 'aioseo_breadcrumbs_trail', [$this, 'aioseo_breadcrumbs_trail'] );

        new Blocks();
		new Search();

		// Register Meta box for custom fields.
		add_action(
            'add_meta_boxes',
            function () {
				add_meta_box( 'digimod-theme-assets-post-extra', 'Extra Options', [ $this, 'post_extra_cb' ], get_post_types(), 'side' );
			}
        );

		// save meta value with save post hook.
		add_action(
            'save_post',
            function ( $post_id ) {
				if ( isset( $_POST['digimod-theme-assets-custom-title'] ) ) {                                                       //phpcs:ignore WordPress.Security.NonceVerification.Missing
					update_post_meta( $post_id, 'digimod-theme-assets-custom-title', $_POST['digimod-theme-assets-custom-title'] ); //phpcs:ignore WordPress.Security.NonceVerification.Missing
				}
			}
        );

		// Hook into the global query filter.
		add_filter( 'query', [ $this, 'optimize_searchwp_quoted_search' ] );

		// Add excerpts to pages for better search support.
		add_post_type_support( 'page', 'excerpt' );
	}



	/**
	 * Modify the wp query from searchwp to fix performance issue when doing a quoted search.
	 *
	 * @param string $sql The sql query to be modified.
	 *
	 * @return string $sql The modified sql query.
	 */
	public function optimize_searchwp_quoted_search( $sql ) {
		if ( class_exists( 'SearchWP' ) && \SearchWP\Settings::get( 'quoted_search_support', 'boolean' ) ) {
			//phpcs:ignore WordPress.Security.NonceVerification.Recommended
			if ( isset( $_REQUEST['s'] ) ) {    // Only modify the query if its a search query.
				if ( stripos( $sql, '(SELECT ID AS id FROM wp_posts WHERE 1=1 AND' ) !== false ) { // Look for the quoted search query.

					// Extract the post type being queried for, then use that post type to help filter down the query.
					preg_match( '/(?:AND s.source = \'post.)(.*)(?:\')/i', $sql, $tmp_regex_result );
					if ( count( $tmp_regex_result ) === 2 ) {
						$source_post_type = $tmp_regex_result[1];

						$sql = str_ireplace(
							'(SELECT ID AS id FROM wp_posts WHERE 1=1 AND ',
							'(SELECT ID AS id FROM wp_posts WHERE 1=1 AND post_status="publish" AND post_type="' . $source_post_type . '" AND ',
							$sql
						);

					} else {
						// In case we have a problem extracting the post type, we can still add the publish post status.
						$sql = str_ireplace(
							'(SELECT ID AS id FROM wp_posts WHERE 1=1 AND ',
							'(SELECT ID AS id FROM wp_posts WHERE 1=1 AND post_status="publish" AND ',
							$sql
						);
					}

					// Rework the query so that the JOIN doesnt join the all the data but just the ID's. Speeds up significantly the query (from 7s to 0.03s).
					$sql = str_ireplace(
						[
							'LEFT JOIN wp_searchwp_index s',
							'ON s.id = p.id',
							'GROUP BY id',
						],
						[
							'LEFT JOIN (SELECT distinct(ID) FROM wp_searchwp_index s',
							'',
							') as s ON s.id = p.id GROUP BY id',
						],
						$sql
					);

				}
			}
		}

		return $sql;
	}


	/**
	 * The meta box to add to posts.
	 *
	 * @param object $post The post object being edited.
	 */
	public function post_extra_cb( $post ) {
		$meta_val = get_post_meta( $post->ID, 'digimod-theme-assets-custom-title', true );
		?>
		<label>Custom Title for Search:</label>
		<input type="text" name="digimod-theme-assets-custom-title" value="<?php echo esc_attr( $meta_val ); ?>">
		<?php
	}


	/**
     * Register our admin JS assets.
     */
	public function register_admin_js() {
        $asset_file = include self::$plugin_dir . 'dist-plugin/admin.asset.php';

        wp_enqueue_script(
            'digitalgov/digimod-theme-assets-plugin-admin',
            self::$plugin_url . 'dist-plugin/admin.js',
            $asset_file['dependencies'],
            $asset_file['version'],
			[
				'in_footer' => true,
			]
        );
	}


	/**
	 * Protect the excerpt for idir protected pages on search results, in case the results show up outside the search results templates we setup.
	 *  This doesnt account for built in wp password protected pages, wp handles the excerpt itself for those.
	 *
	 * @param string $excerpt The original excerpt text.
	 * @param object $post The post object.
	 */
	public function protect_excerpt( $excerpt, $post ) {
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
					$result_content .= ' <p>' . __( 'This content requires an IDIR login to view.' ) . '</p>';
				}
			} else {
				$result_content .= $post_excerpt;
			}
			return $result_content;
		}

		return $excerpt;
	}


	/**
	 * Modify the breadcrumbs generated by AIO SEO to remove the search category taxonomy
	 * 
	 * @param array $crumbs Array of the breadcrumbs
	 * @return array $crumbs The modified array of breadcrumbs
	 */
	public function aioseo_breadcrumbs_trail( $crumbs ) {
		foreach ( $crumbs as $key => $crumb ) {
			if ( is_a( $crumb['reference'], 'WP_Term' ) && 'search-category' === $crumb['reference']->taxonomy ) {
				unset( $crumbs[ $key ] );
			}
		}
	
		return $crumbs;
	}

	// phpcs:disable
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
	// phpcs:enable
}
