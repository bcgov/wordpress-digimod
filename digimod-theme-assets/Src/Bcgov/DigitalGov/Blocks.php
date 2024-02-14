<?php
/**
 * Some Blocks for DigitalGov.
 *
 * @package Bcgov\DigitalGov
 * @since 1.3.0
 */
namespace Bcgov\DigitalGov;

use Bcgov\Common\Loader;

/**
 * Blocks class sets up dynamic blocks.
 */
class Blocks {

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
        $loader->add_action( 'init', $this, 'register_blocks' );
        $loader->run();
    }

    /**
     * Helper function to check if the block render call is coming from Gutenburg or the website
     *
     * @return bool $is_gb_editor
     */
    public static function check_is_gb_editor() {
        $is_gb_editor = defined( 'REST_REQUEST' ) && true === REST_REQUEST && ! empty( $_REQUEST['context'] ) && 'edit' === filter_input( INPUT_GET, 'context', FILTER_SANITIZE_SPECIAL_CHARS ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended

        return $is_gb_editor;
    }



	 /**
      * Registers blocks and callbacks for dynamic blocks.
      *
      * @return void
      */
    public function register_blocks(): void {
        register_block_type(
            'digimod-plugin/search-results',
            [
				'render_callback' => [ new SearchResultsBlock(), 'render_search_results' ],
			]
        );
	}
}
