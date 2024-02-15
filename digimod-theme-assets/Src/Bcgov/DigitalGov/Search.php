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
			$block_content .= '<div class="live-search-container"></div>';
		}

		return $block_content;
	}
}
