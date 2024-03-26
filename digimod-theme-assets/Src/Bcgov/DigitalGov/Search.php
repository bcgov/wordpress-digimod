<?php
/**
 * Search additions for DigitalGov.
 *
 * @package Bcgov\DigitalGov
 * @since 1.3.0
 */
namespace Bcgov\DigitalGov;

/**
 * Search class.
 */
class Search {
	/**
     * Constructor.
     */
    public function __construct() {
        $this->init();
    }

	/**
     * Sets up hooks for Blocks.
     *
     * @return void
     */
    public function init() {
		add_filter( 'searchwp_live_search_base_styles', [ $this, 'searchwp_turn_off_base_styles' ] );
		add_action( 'wp_enqueue_scripts', [ $this, 'searchwp_live_search_theme_css' ], 20 );
		add_filter( 'searchwp_live_search_configs', [ $this, 'searchwp_live_search_configs' ] );
		add_filter( 'searchwp_live_search_results_template', [ $this, 'portfolio_page_template' ], 99 );
		add_filter( 'render_block', [ $this, 'render_block' ], null, 2 );
    }

	/**
	 *  Override the filter so that it looks for the search results template inside of our plugin folder.
	 */
	public function portfolio_page_template() {
		return Plugin::$plugin_dir . 'theme/templates/search-results.php';
	}



	/**
	 *  Turn off the base styles for live search, which controls position css.
	 */
	public function searchwp_turn_off_base_styles() {
		return false;
	}



	/**
	 *  Completely remove all the styling of the live search.
	 */
	public function searchwp_live_search_theme_css() {
		wp_dequeue_style( 'searchwp-live-search' );
	}


	/**
	 * Adjust the SearchWP Live Search config.
	 *
	 * @param array $config The original configuration array that will get modified.
	 */
	public function searchwp_live_search_configs( $config ) {

		$config['default']['results']['offset']['y'] = -32;                         // Push up the live search results to line up with the search box.
		$config['default']['parent_el']              = '.live-search-container';    // Put the live search in our new container.
		$config['default']['input']['delay']         = 800;                         // Increase the delay to start searching to this many MS as some people type slowly.

		return $config;
	}


	/**
	 * Provide for the ability to change block html content.
	 *   Used to add attributes to the search results post content.
	 *
	 * @param string $block_content The content inside the block.
	 * @param array  $block The settings of the block.
	 */
	public function render_block( string $block_content, array $block ): string {
		// phpcs:ignore
		// echo print_r($block['blockName'],true) . ' ' . PHP_EOL;	

		if ( 'core/search' === $block['blockName'] ) {
			ob_start();
			require Plugin::$plugin_dir . 'theme/templates/live-search-container.php';
			
			$block_content .= ob_get_clean();
		}

		return $block_content;
	}


	/**
	 * Apply overides and other rules to the post title to get to the final search results title.
	 *
	 * @param object $post_obj The post object.
	 * @param bool   $highlight Should we highlight search query in the title.
	 * @param string $search_query The search query used.
	 *
	 * @return string $post_title The re-worked title for the post.
	 */
	public static function get_final_title( $post_obj, $highlight = true, $search_query = '' ) {
		$highlighter = new \SearchWP\Highlighter();

		$post_is_restricted = custom_redirect_to_login_check_if_url_in_list( get_permalink( $post_obj->ID ) ) || post_password_required( $post_obj->ID );
		$post_title         = $post_obj->post_title; // Use the original title to avoid the double 'protected' problem with get_the_title( $result );.

		$possible_title_override = get_post_meta( $post_obj->ID, 'digimod-theme-assets-custom-title', true );

		$requires_highlighting = false; // Depending on the source of our title, it may come pre-highlighted so only highlight as needed.
		if ( ! empty( $possible_title_override ) ) {
			$post_title            = $possible_title_override;
			$requires_highlighting = true;

		} elseif ( function_exists( 'aioseo' ) ) { // Allow for the AIOSEO title change capability.
			$aioseo_title_pre_process = aioseo()->meta->metaData->getMetaData( $post_obj )->title;    // Has the replacement tags #.
			if ( $aioseo_title_pre_process ) {
				$aioseo_title_post_process = aioseo()->meta->title->getPostTitle( $post_obj );          // Tags are now replaced.
				if ( $aioseo_title_pre_process ) {
					$possible_title = substr( $aioseo_title_pre_process, 0, strspn( $aioseo_title_pre_process, $aioseo_title_post_process ) ); // Diff the two and return only the same, which should be the title sans any site name or tags.
					if ( $possible_title ) {
						$post_title = $possible_title;

						$requires_highlighting = true;
					}
				}
			}
		}

		if ( $post_is_restricted ) {
			// Double check that the post does have the Protected title.
			if ( stripos( $post_title, 'Protected:' ) !== 0 ) {    // Very important to check for not 0 and only not 0. false means something else.
				$post_title = 'Protected: ' . $post_title;
			}
		}

		if ( $requires_highlighting && $highlight && '' !== $search_query ) {
			if ( $highlighter ) {
				$post_title = $highlighter->apply( $post_title, $search_query );
			}
		}

		return $post_title;
	}
}
