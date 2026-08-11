<?php
/**
 * Tests for SearchResultsBlock helpers.
 *
 * @package Bcgov\DigitalGov
 */

use Bcgov\DigitalGov\SearchResultsBlock;
use PHPUnit\Framework\TestCase;

/**
 * SearchResultsBlock tests.
 */
class SearchResultsBlockTest extends TestCase {

	/**
	 * Creates an instance without running the WordPress-dependent constructor.
	 *
	 * @return SearchResultsBlock
	 */
	private function create_block_instance(): SearchResultsBlock {
		$reflection = new ReflectionClass( SearchResultsBlock::class );

		return $reflection->newInstanceWithoutConstructor();
	}

	/**
	 * Invokes a private SearchResultsBlock helper.
	 *
	 * @param string $method_name Method name.
	 * @param array  $arguments Arguments to pass.
	 *
	 * @return mixed
	 */
	private function invoke_private_method( string $method_name, array $arguments = array() ) {
		$reflection = new ReflectionClass( SearchResultsBlock::class );
		$method     = $reflection->getMethod( $method_name );

		$method->setAccessible( true );

		return $method->invokeArgs( $this->create_block_instance(), $arguments );
	}

	/**
	 * Search results container classes include grid and image modifiers.
	 */
	public function test_get_container_classes_returns_expected_values(): void {
		$classes = $this->invoke_private_method(
			'get_container_classes',
			array(
				array(
					'swp-layout-style'    => 'grid',
					'swp-results-per-row' => 4,
					'swp-image-size'      => 'large',
				),
			)
		);

		$this->assertSame( 'swp-search-results swp-grid swp-grid--cols-4 swp-rp--img-l', $classes );
	}

	/**
	 * Search results pagination classes include the boxed modifier.
	 */
	public function test_get_pagination_classes_returns_expected_values(): void {
		$classes = $this->invoke_private_method(
			'get_pagination_classes',
			array(
				array(
					'swp-pagination-style' => 'boxed',
				),
			)
		);

		$this->assertSame( 'nav-links swp-results-pagination swp-results-pagination--boxed', $classes );
	}
}
