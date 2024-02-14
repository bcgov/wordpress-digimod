<?php
/**
 * Search additions for DigitalGov.
 *
 * @package Bcgov\DigitalGov
 * @since 1.3.0
 */
namespace Bcgov\DigitalGov;

use Bcgov\Common\Loader;

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
        $loader = new Loader();
		$loader->add_filter( 'searchwp_live_search_base_styles', $this, 'searchwp_turn_off_base_styles' );
		$loader->add_action( 'wp_enqueue_scripts', $this, 'searchwp_live_search_theme_css', 20 );
		$loader->add_filter( 'searchwp_live_search_configs', $this, 'searchwp_live_search_configs' );
		$loader->add_filter( 'searchwp_live_search_results_template', $this, 'portfolio_page_template', 99 );
		$loader->add_filter( 'render_block', $this, 'render_block', null, 2 );

        $loader->run();
    }

	/**
	 *  Override the filter so that it looks for the search results template inside of our plugin folder.
	 */
	function portfolio_page_template() {
		return Plugin::$plugin_dir . 'theme/templates/search-results.php';
	}



	/**
	 *  Turn off the base styles for live search, which controls position css.
	 */
	function searchwp_turn_off_base_styles() {
		return false;
	}



	/**
	 *  Completely remove all the styling of the live search.
	 */
	function searchwp_live_search_theme_css() {
		wp_dequeue_style( 'searchwp-live-search' );
	}


	/**
	 * Adjust the SearchWP Live Search config.
	 */
	function searchwp_live_search_configs( $config ) {
		$config['default']['results']['offset']['y'] = -32;                         // Push up the live search results to line up with the search box.
		$config['default']['parent_el']              = '.live-search-container';    // Put the live search in our new container.

		return $config;
	}


	/**
	 * Provide for the ability to change block html content.
	 *   Used to add attributes to the search results post content.
	 */
	function render_block( string $block_content, array $block ): string {
		// echo print_r($block['blockName'],true) . ' ' . PHP_EOL;

		if ( $block['blockName'] === 'core/search' ) {
			$block_content .= '<div class="live-search-container"></div>';
		}

		return $block_content;
	}
}
